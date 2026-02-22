// CREATE THIS FILE
// Purpose: Reusable microphone button with recording animation
import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Animated } from 'react-native';
import { AppColors } from '../theme';
import { useVoiceInput } from '../hooks/useVoiceInput';

interface VoiceButtonProps {
  onTranscribe: (text: string) => void;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({ onTranscribe }) => {
  const { isRecording, startRecording, stopRecording } = useVoiceInput();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    if (isRecording) {
      // Pulsing animation while recording
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isRecording]);
  
  const handlePress = async () => {
    if (isRecording) {
      const text = await stopRecording();
      onTranscribe(text);
    } else {
      await startRecording();
    }
  };
  
  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View style={[
        styles.button,
        isRecording && styles.recording,
        { transform: [{ scale: pulseAnim }] }
      ]}>
        <Text style={styles.icon}>🎤</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AppColors.surfaceCard,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recording: {
    backgroundColor: AppColors.error,
  },
  icon: {
    fontSize: 24,
  },
});
