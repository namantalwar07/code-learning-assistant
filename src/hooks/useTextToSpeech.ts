// CREATE THIS FILE
// Purpose: Hook for converting text to speech and playing audio

/* Simpler than STT - just wrapper around RunAnywhere.synthesize()
*/

import { useState } from 'react';
import { RunAnywhere } from '@runanywhere/core';

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const speak = async (text: string): Promise<void> => {
    if (!text.trim()) return;
    
    setIsSpeaking(true);
    setError(null);
    
    try {
      // RunAnywhere.synthesize returns audio that plays automatically
      await RunAnywhere.synthesize(text, {
        voice: 'default', // Use default voice
        rate: 1.0,
        pitch: 1.0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'TTS failed');
    } finally {
      setIsSpeaking(false);
    }
  };
  
  const stop = async (): Promise<void> => {
    // Stop current speech
    // RunAnywhere API should have stop method
    setIsSpeaking(false);
  };
  
  return {
    isSpeaking,
    error,
    speak,
    stop,
  };
}
