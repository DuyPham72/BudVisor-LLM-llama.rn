// app/chat.tsx
import React, { useState, useRef, useEffect } from 'react';
import { FlatList, TextInput as RNTextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputBar from './components/InputBar';
import MessageBubble from './components/MessageBubble';
import { answerQuery } from '../services/ragService';

interface Message {
  id: string;
  text: string;
  role: 'user' | 'assistant';
}

const generateId = () => `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const streamingRefs = useRef<Record<string, string>>({});
  const shouldStopRef = useRef(false);
  const inputRef = useRef<RNTextInput>(null);
  const flatListRef = useRef<FlatList>(null);

  const addMessage = (msg: Message) => {
    setMessages(prev => [...prev, msg]);
  };

  const updateMessage = (id: string, text: string) => {
    setMessages(prev => prev.map(m => (m.id === id ? { ...m, text } : m)));
  };

  // Auto-scroll whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }
  }, [messages]);

  const stopGenerating = () => {
    shouldStopRef.current = true;
    setIsGenerating(false);
  };

  const onSend = async (text: string) => {
    if (isGenerating) return; // lock while generating

    const userId = generateId();
    addMessage({ id: userId, text, role: 'user' });

    const assistantId = generateId();
    streamingRefs.current[assistantId] = '';
    addMessage({ id: assistantId, text: 'Thinking...', role: 'assistant' });

    shouldStopRef.current = false;
    setIsGenerating(true);

    try {
      await answerQuery(text, (partial) => {
        if (shouldStopRef.current) throw new Error('stopped');
        streamingRefs.current[assistantId] += partial;
        updateMessage(assistantId, streamingRefs.current[assistantId]);
      });
    } catch (err: any) {
      if (err.message === 'stopped') {
        updateMessage(assistantId, '[Stopped]');
      } else {
        updateMessage(assistantId, 'Error generating answer');
        console.error(err);
      }
    } finally {
      setIsGenerating(false);
      inputRef.current?.focus();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble role={item.role} text={item.text} />}
        contentContainerStyle={{ padding: 12 }}
      />
      <InputBar
        ref={inputRef}
        onSend={onSend}
        onStop={stopGenerating}
        isGenerating={isGenerating}
      />
    </SafeAreaView>
  );
}
