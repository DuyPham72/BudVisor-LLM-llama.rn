// BudgetAssistant/services/ragService.ts
import { getLlamaContext } from './llamaService';
import { addChatMessage, getChatHistory, clearChatMemory } from './dbService';
// import { embedText } from './embeddingService';

// interface Document {
//   id: string;
//   text: string;
//   embedding: number[];
// }

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

// function cosine(a: number[], b: number[]): number {
//   let dot = 0, normA = 0, normB = 0;
//   for (let i = 0; i < a.length; i++) {
//     dot += a[i] * b[i];
//     normA += a[i] * a[i];
//     normB += b[i] * b[i];
//   }
//   return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-12);
// }

// export async function addDocumentAndEmbed(text: string): Promise<string> {
//   const embedding = await embedText(text);
//   const id = await db.addDocument(text, embedding);
//   return id;
// }

/**
 * Answers a user query by formatting recent chat history into the Gemma chat template
 * and sending it to the Llama context for completion.
 */
export async function answerQuery(
  query: string,
  onPartial?: (chunk: string) => void,
  // topK = 3,
  nPredict = 512
): Promise<string> {
  const ctx = getLlamaContext();

  // Load recent conversation history
  const history: ChatMessage[] = await getChatHistory(10);  // last 5 messages

  // System instructions
  const systemInstruction = `You are a helpful assistant. Answer the user's question as accurately as possible. Format your response in short but keep all the details.`;

  // Format the history using Gemma's turn tokens.
  const formattedHistory = history.map((m) => {
    // Note: 'model' is the expected token for the assistant in the Gemma template.
    const roleToken = m.role === 'user' ? 'user' : 'model';
    return `<start_of_turn>${roleToken}\n${m.text}<end_of_turn>`;
  }).join('');

  // const allDocs: Document[] = await db.getAllDocs();

  // const queryEmbedding = await embedText(query);

  // const scored = allDocs
  //   .map((doc) => ({ ...doc, score: cosine(queryEmbedding, doc.embedding) }))
  //   .sort((a, b) => b.score - a.score)
  //   .slice(0, topK);

  // const contextText = scored
  //   .map((d, i) => `Doc ${i + 1}: ${d.text.slice(0, 500)}`) // truncate
  //   .join('\n\n');

  // Combine everything into the final prompt string.
  const prompt = `<bos>${formattedHistory}<start_of_turn>user\n${systemInstruction}\n\n${query}<end_of_turn><start_of_turn>model\n`;

  // Retrieved context:
  // User question: ${query}
  // ${contextText}

  let buffer = '';
  const flushTokenCount = 5;
  let tokenCounter = 0;
  const stopWords = ['<end_of_turn>', '<start_of_turn>user', '<start_of_turn>model', '[Stopped]'];

  let result;
  try {
    result = await ctx.completion(
      {
        prompt,
        n_predict: nPredict,
        top_p: 0.9,
        temperature: 0.7,
        // Setting stop tokens is CRITICAL to prevent the model from generating the next turn
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

  // Clean the reply by removing any leading/trailing whitespace or tokens the model might have accidentally included
  const rawReply = result.text.trim();
  
  let reply = rawReply;
  const userTurnIndex = reply.indexOf('<start_of_turn>user');
  if (userTurnIndex !== -1) {
    reply = reply.substring(0, userTurnIndex);
  }
  reply = reply.replace(/<end_of_turn>|<end_of_text>|\n\n/g, '').trim();

  // Save reply
  await addChatMessage('user', query);
  await addChatMessage('assistant', reply);

  return reply;
}
