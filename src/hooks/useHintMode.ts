import { useState } from 'react';
import { RunAnywhere } from '@runanywhere/core';
import { PROMPTS } from '../utils/prompts';

export function useHintMode() {
  const [hints, setHints] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateHint = async (problemText: string, step: number) => {
    if (step < 1 || step > 4) return null;
    if (step > currentStep + 1) return null; // No skipping

    setIsGenerating(true);
    setError(null);

    try {
      const promptMap: Record<number, (text: string) => string> = {
        1: PROMPTS.hint1,
        2: PROMPTS.hint2,
        3: PROMPTS.hint3,
        4: PROMPTS.solution,
      };

      const prompt = promptMap[step](problemText);
      
      const maxTokensMap: Record<number, number> = {
        1: 100,  // Just a hint
        2: 200,  // Pseudocode
        3: 300,  // Partial code
        4: 500,  // Full solution
      };

      // Stream for better UX
      const streamResult = await RunAnywhere.generateStream(prompt, {
        maxTokens: maxTokensMap[step],
        temperature: 0.7,
      });

      let fullResponse = '';
      for await (const token of streamResult.stream) {
        fullResponse += token;
      }

      // Update hints array
      const newHints = [...hints];
      newHints[step - 1] = fullResponse;
      setHints(newHints);
      setCurrentStep(step);

      return fullResponse;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Generation failed';
      setError(errorMsg);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setHints([]);
    setCurrentStep(0);
    setError(null);
  };

  return {
    hints,
    currentStep,
    isGenerating,
    error,
    generateHint,
    reset,
  };
}
