import { useState } from 'react';
import { RunAnywhere } from '@runanywhere/core';
import { PROMPTS } from '../utils/prompts';
import { ProgrammingLanguage } from '../types/learning';

export function useErrorExplainer() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [tokensPerSecond, setTokensPerSecond] = useState<number | undefined>();

  const explainError = async (
    errorText: string,
    mode: 'simple' | 'technical',
    language?: ProgrammingLanguage
  ) => {
    if (!errorText.trim()) {
      setError('Please enter an error message');
      return null;
    }

    setIsGenerating(true);
    setExplanation('');
    setError(null);

    try {
      const prompt = mode === 'simple'
        ? PROMPTS.errorSimple(errorText, language)
        : PROMPTS.errorTechnical(errorText, language || 'Unknown');

      // Use streaming for better UX (like ChatScreen.tsx does)
      const streamResult = await RunAnywhere.generateStream(prompt, {
        maxTokens: mode === 'simple' ? 250 : 350,
        temperature: 0.7,
      });

      let fullResponse = '';
      for await (const token of streamResult.stream) {
        fullResponse += token;
        setExplanation(fullResponse);
      }

      const finalResult = await streamResult.result;
    //   setTokensPerSecond(finalResult.performanceMetrics?.tokensPerSecond);
      setTokensPerSecond(
        (finalResult as any)?.performanceMetrics?.tokensPerSecond
        );

      return {
        text: fullResponse,
        //tokensPerSecond: finalResult.performanceMetrics?.tokensPerSecond,
        tokensPerSecond: (finalResult as any)?.performanceMetrics?.tokensPerSecond,
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Generation failed';
      setError(errorMsg);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const clear = () => {
    setExplanation('');
    setError(null);
  };

  return {
    explanation,
    isGenerating,
    error,
    tokensPerSecond,
    explainError,
    clear,
  };
}
