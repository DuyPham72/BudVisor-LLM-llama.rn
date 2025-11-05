// BudgetAssistant/services/ragService.ts
import { getLlamaContext } from './llamaService';
import { addChatMessage, getChatHistory, getAllDocs } from './dbService';
import { embedText } from './embeddingService';

// --- RAG INTERFACE ---
interface Document {
  id: string;
  text: string;
  embedding: number[];
}

// --- Message INTERFACE ---
interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

/**
 * Calculates the cosine similarity between two vectors.
 * Score closer to 1 means higher similarity.
 */
function cosine(a: number[], b: number[]): number {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    // Handle division by zero safety
    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    return denominator === 0 ? 0 : dot / denominator;
}


export async function answerQuery(
  query: string,
  onPartial?: (chunk: string) => void,
  topK = 1,
  nPredict = 384
): Promise<string> {
  const ctx = getLlamaContext();

  // ----------------------------------------------------
  // 1. PRE-RAG: HISTORY & QUERY REWRITING BLOCK 🧠
  // ----------------------------------------------------

  // Step 1: Load recent conversation history (needed for rewriting & final prompt)
  const history: ChatMessage[] = await getChatHistory(4);  // last 2 Q&A pairs

  let retrievalQuery = query;

  // Step 2: Query Rewriting (Crucial for follow-up questions)
  if (history.length > 0) {
    const rewritePrompt = `
You are a context assistant. Given the conversation history and the latest user message, rewrite the latest user message into a single, standalone query that fully captures the user's intent, without using pronouns like 'it', 'that', or 'this'. Only output the rewritten query.

Conversation History:
${history.map(m => `${m.role}: ${m.text}`).join('\n')}

Latest User Message: ${query}

Rewritten Query:`;

    // Use a quick, deterministic completion for rewriting
    try {
      const rewriteResult = await ctx.completion({
        prompt: `<bos><start_of_turn>user\n${rewritePrompt}<end_of_turn><start_of_turn>model\n`,
        n_predict: 50, 
        temperature: 0.0,
        stop: ['\n', '<end_of_turn>', 'Rewritten Query:'],
      });
      
      const rewrittenText = rewriteResult.text.trim();
      if (rewrittenText.length > 5) {
        retrievalQuery = rewrittenText;
      }
    } catch(e) {
      console.warn("Query rewriting failed, using original query.");
    }
  }

  // ----------------------------------------------------
  // 2. RETRIEVAL-AUGMENTATION BLOCK
  // ----------------------------------------------------

  // Step 1: Embed the query (using rewritten query if applicable)
  const queryEmbedding = await embedText(retrievalQuery);

  // Step 2: Retrieve all stored documents (chunks)
  const allDocs: Document[] = await getAllDocs();

  // Step 3: Calculate similarity and select top K
  const scored = allDocs
    .map((doc) => ({ 
        ...doc, 
        score: cosine(queryEmbedding, doc.embedding) 
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  // Step 4: Format the retrieved context for the prompt
  const contextText = scored
    .map((d, i) => `[Source Chunk ${i + 1} (Score: ${d.score.toFixed(3)}):\n${d.text.slice(0, 500)}]`) 
    .join('\n---\n');

  // ----------------------------------------------------
  // 3. PROMPT AUGMENTATION & COMPLETION BLOCK
  // ----------------------------------------------------

  // Step 1: Define system instructions
  const systemInstruction = `
You are CornBot, a professional financial data analyst and budget advisor.
Your goal is to help users understand their financial situation, analyze spending patterns, detect trends, and provide practical, data-driven insights.

Rules:
1. Use quantitative reasoning when analyzing numbers (e.g., percentages, averages, deltas).
2. When referencing numbers, always explain what they mean in context.
3. Keep explanations concise but analytical.
4. Round all float numbers to two decimal places.
5. Limit your answer to 250 words.

Response Structure:
Your response must be structured into three sections: 
- **Summary**: brief overview of the analysis or key findings.
- **Details**: relevant numbers, categories, and comparisons from the context.
- **Recommendation**: clear next steps or financial advice.

Tone: Professional and data-oriented.
`;

  // Step 2: Format the chat history
  const formattedHistory = history.map((m) => {
    const roleToken = m.role === 'user' ? 'user' : 'model';
    return `<start_of_turn>${roleToken}\n${m.text}<end_of_turn>`;
  }).join('');

  // Step 3: Create the augmented query with context
  const augmentedQuery = `
FINANCIAL CONTEXT:
---
${contextText || "No relevant financial documents found in the database. Rely only on general financial knowledge."}
---
User question: ${query}
`;

  // Step 4: FIX: Inject System Instruction ONLY if this is the FIRST turn.
  const userContent = history.length === 0 
    ? `${systemInstruction}\n\n${augmentedQuery}`
    : augmentedQuery;

  // Step 5: Combine everything into the final prompt string.
  const prompt = `<bos>${formattedHistory}<start_of_turn>user\n${userContent}<end_of_turn><start_of_turn>model\n`;

  // ----------------------------------------------------------
  // 4. LLM COMPLETION BLOCK
  // ----------------------------------------------------------

  let buffer = '';
  const flushTokenCount = 3;
  let tokenCounter = 0;
  const stopWords = ['<end_of_turn>', '<start_of_turn>user', '<start_of_turn>model', '[Stopped]'];

  let result;
  try {
    result = await ctx.completion(
      {
        prompt,
        n_predict: nPredict,
        top_p: 0.95,
        top_k: 64,
        temperature: 0.8,
        min_p: 0.02,
        stop: stopWords, 
      },
      (data) => {
        if (!data?.token) return;
        buffer += data.token;
        tokenCounter++;
        if (tokenCounter >= flushTokenCount) {
          onPartial?.(buffer);
          buffer = '';
          tokenCounter = 0;
        }
      }
    );
  } catch (error) {
    console.error("LLM completion failed:", error);
    return "Error: Could not get a response from the model.";
  }

  if (buffer.length > 0) onPartial?.(buffer);

  // Clean the reply by removing tokens
  const rawReply = result.text.trim();
  
  let reply = rawReply;
  const userTurnIndex = reply.indexOf('<start_of_turn>user');
  if (userTurnIndex !== -1) {
    reply = reply.substring(0, userTurnIndex);
  }
  reply = reply.replace(/<end_of_turn>|<end_of_text>|\n\n/g, '').trim();

  // Save chat history
  await addChatMessage('user', query);
  await addChatMessage('assistant', reply);

  return reply;
}