// CREATE THIS FILE
// Purpose: Manage conversation state with context awareness

import { useState, useCallback } from 'react';
import { RunAnywhere } from '@runanywhere/core';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

interface ConversationContext {
  type?: 'error' | 'hint';
  originalQuery?: string;
  previousResponse?: string;
}

export function useConversation(context?: ConversationContext) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const buildContextPrompt = (userMessage: string): string => {
    // Build prompt with conversation history
    let prompt = '';
    
    // Add context if provided
    if (context?.type === 'error') {
      prompt += `Context: User asked about this error: "${context.originalQuery}"\n`;
      prompt += `Previous explanation: "${context.previousResponse}"\n\n`;
    } else if (context?.type === 'hint') {
      prompt += `Context: User is solving this problem: "${context.originalQuery}"\n`;
      prompt += `Previous hints: "${context.previousResponse}"\n\n`;
    }
    
    // Add conversation history (last 10 messages for context window)
    const recentMessages = messages.slice(-10);
    if (recentMessages.length > 0) {
      prompt += 'Previous conversation:\n';
      recentMessages.forEach(msg => {
        prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.text}\n`;
      });
      prompt += '\n';
    }
    
    prompt += `User: ${userMessage}\nAssistant:`;
    return prompt;
  };
  
  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim()) return;
    
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: userMessage,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    
    setIsGenerating(true);
    
    try {
      const prompt = buildContextPrompt(userMessage);
      
      // Stream response
      const streamResult = await RunAnywhere.generateStream(prompt, {
        maxTokens: 400,
        temperature: 0.8,
      });
      
      let fullResponse = '';
      for await (const token of streamResult.stream) {
        fullResponse += token;
        // Update UI in real-time (handled by screen component)
      }
      
      // Add assistant message
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: fullResponse,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, assistantMsg]);
      
      return fullResponse;
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [messages, context]);
  
  const clearConversation = useCallback(() => {
    setMessages([]);
  }, []);
  
  return {
    messages,
    isGenerating,
    sendMessage,
    clearConversation,
  };
}
