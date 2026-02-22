// CREATE THIS FILE
// Purpose: Button to play text as speech

import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { AppColors } from '../theme';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

interface SpeakerButtonProps {
  text: string;
  label?: string;
}

export const SpeakerButton: React.FC<SpeakerButtonProps> = ({ text, label }) => {
  const { isSpeaking, speak, stop } = useTextToSpeech();
  
  const handlePress = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text);
    }
  };
  
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      disabled={!text.trim()}
    >
      <View style={styles.button}>
        <Text style={styles.icon}>{isSpeaking ? '⏹' : '🔊'}</Text>
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppColors.accentCyan + '30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
  },
  label: {
    fontSize: 13,
    color: AppColors.accentCyan,
    fontWeight: '600',
  },
});
