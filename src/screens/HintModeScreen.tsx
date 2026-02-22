import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AppColors } from '../theme';
import { useHintMode } from '../hooks/useHintMode';
import { useHistory } from '../hooks/useHistory';
import { useModelService } from '../services/ModelService';
import { ModelLoaderWidget } from '../components';
import { FormattedResponse } from '../components/FormattedResponse';
import { VoiceButton } from '../components/VoiceButton';
import { useNavigation } from '@react-navigation/native';
import { codeParser } from '../utils/codeParser';

export const HintModeScreen: React.FC = () => {
  const modelService = useModelService();
  const { hints, currentStep, isGenerating, generateHint, reset } = useHintMode();
  const { saveItem } = useHistory();
  
  const [problemText, setProblemText] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const navigation = useNavigation<any>();

  const handleGenerateHint = async (step: number) => {
    if (step === 1 && !problemText.trim()) {
      Alert.alert('Error', 'Please enter a problem description');
      return;
    }

    const hint = await generateHint(problemText, step);
    
    // Save when reaching final solution
    if (step === 4 && hint) {
      await saveItem({
        id: Date.now().toString(),
        type: 'hint',
        query: problemText,
        response: hints.join('\n\n--- NEXT HINT ---\n\n') + '\n\n--- SOLUTION ---\n\n' + hint,
        timestamp: Date.now(),
      });
    }
    
    setHasStarted(true);
  };

  const handleReset = () => {
    setProblemText('');
    setHasStarted(false);
    reset();
  };

  const loadSample = () => {
    setProblemText('Find two numbers in an array that sum to a target value. For example, given [2, 7, 11, 15] and target = 9, return indices [0, 1] because 2 + 7 = 9.');
  };
  const extractCodeFromResponse = (text: string): string => {
    const parsed = codeParser.extractCodeBlocks(text);
    const codeBlock = parsed.find(item => item.type === 'code');
    return codeBlock?.content || '';
  };

  if (!modelService.isLLMLoaded) {
    return (
      <ModelLoaderWidget
        title="LLM Model Required"
        subtitle="Download model to start learning with hints"
        icon="lightbulb"
        accentColor={AppColors.accentViolet}
        isDownloading={modelService.isLLMDownloading}
        isLoading={modelService.isLLMLoading}
        progress={modelService.llmDownloadProgress}
        onLoad={modelService.downloadAndLoadLLM}
      />
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        {/* Input Section */}
        {!hasStarted && (
          <View style={styles.inputSection}>
            <Text style={styles.label}>Describe Your Coding Problem:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Find two numbers that sum to target..."
              placeholderTextColor={AppColors.textMuted}
              value={problemText}
              onChangeText={setProblemText}
              multiline
              numberOfLines={6}
              editable={!isGenerating}
            />
            {/* Voice Input Row */}
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', marginTop: 12 }}>
              <VoiceButton onTranscribe={(text) => setProblemText(text)} />
                <Text style={{ color: AppColors.textSecondary, fontSize: 13 }}>
                    Or speak your problem
                </Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.sampleButton} onPress={loadSample}>
                <Text style={styles.sampleButtonText}>📝 Sample Problem</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => handleGenerateHint(1)} 
                disabled={isGenerating || !problemText.trim()}
              >
                <LinearGradient
                  colors={[AppColors.accentViolet, AppColors.accentPink]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.startButton}
                >
                  <Text style={styles.startButtonText}>💡 Start Hints</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Info Card */}
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>🎯 How Hint Mode Works</Text>
              <Text style={styles.infoText}>
                • Step 1: Get a strategic hint{'\n'}
                • Step 2: See pseudocode{'\n'}
                • Step 3: Get partial solution{'\n'}
                • Step 4: View complete solution{'\n\n'}
                No skipping! Learn step-by-step 🚀
              </Text>
            </View>
          </View>
        )}

        {/* Progress Bar */}
        {hasStarted && (
          <View style={styles.progressSection}>
            <Text style={styles.progressText}>Progress: Step {currentStep} of 4</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(currentStep / 4) * 100}%` }]} />
            </View>
          </View>
        )}

        {/* Hints Section */}
        {hasStarted && (
          <View style={styles.hintsSection}>
            {/* Problem Display */}
            <View style={styles.problemCard}>
              <Text style={styles.problemTitle}>📋 Your Problem:</Text>
              <Text style={styles.problemText}>{problemText}</Text>
            </View>

            {/* Hint 1 */}
            <HintCard
              stepNumber={1}
              title="💡 Hint 1: Strategy"
              content={hints[0]}
              isUnlocked={currentStep >= 1}
              isLoading={isGenerating && currentStep === 0}
              onUnlock={() => handleGenerateHint(1)}
            />

            {/* Hint 2 */}
            <HintCard
              stepNumber={2}
              title="📝 Hint 2: Pseudocode"
              content={hints[1]}
              isUnlocked={currentStep >= 2}
              isLoading={isGenerating && currentStep === 1}
              onUnlock={() => handleGenerateHint(2)}
              disabled={currentStep < 1}
            />

            {/* Hint 3 */}
            <HintCard
              stepNumber={3}
              title="💻 Hint 3: Partial Code"
              content={hints[2]}
              isUnlocked={currentStep >= 3}
              isLoading={isGenerating && currentStep === 2}
              onUnlock={() => handleGenerateHint(3)}
              disabled={currentStep < 2}
            />

            {/* Solution */}
            {/* Solution */}
<HintCard
  stepNumber={4}
  title="✅ Full Solution"
  content={hints[3]}
  isUnlocked={currentStep >= 4}
  isLoading={isGenerating && currentStep === 3}
  onUnlock={() => handleGenerateHint(4)}
  disabled={currentStep < 3}
  isSolution
/>

{/* Try It Button */}
{currentStep >= 4 && hints[3] && hints[3].includes('```') && (
  <TouchableOpacity
    style={styles.tryItButton}
    onPress={() => {
      const code = extractCodeFromResponse(hints[3]);
      navigation.navigate('Playground', {
        code,
        language: codeParser.detectLanguage(code),
      });
    }}
  >
    <Text style={styles.tryItText}>⚡ Try This Code</Text>
  </TouchableOpacity>
)}

            {/* Reset Button */}
            {currentStep > 0 && (
              <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                <Text style={styles.resetButtonText}>🔄 Start New Problem</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// Hint Card Component
const HintCard: React.FC<{
  stepNumber: number;
  title: string;
  content?: string;
  isUnlocked: boolean;
  isLoading: boolean;
  onUnlock: () => void;
  disabled?: boolean;
  isSolution?: boolean;
}> = ({ stepNumber, title, content, isUnlocked, isLoading, onUnlock, disabled, isSolution }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={[styles.hintCard, isSolution && styles.solutionCard]}>
      <TouchableOpacity 
        style={styles.hintHeader}
        onPress={() => isUnlocked && setExpanded(!expanded)}
        disabled={!isUnlocked}
      >
        <Text style={[styles.hintTitle, !isUnlocked && styles.hintTitleLocked]}>
          {isUnlocked ? title : `🔒 ${title}`}
        </Text>
        {!isUnlocked && !isLoading && (
          <TouchableOpacity
            style={[styles.unlockButton, disabled && styles.unlockButtonDisabled]}
            onPress={onUnlock}
            disabled={disabled}
          >
            <Text style={styles.unlockButtonText}>
              {disabled ? '⏸ Complete previous' : '🔓 Unlock'}
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={AppColors.accentViolet} />
          <Text style={styles.loadingText}>AI is thinking...</Text>
        </View>
      )}

      {isUnlocked && content && expanded && (
        <View style={styles.hintContent}>
          <FormattedResponse content={content} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.primaryDark,
  },
  scrollView: {
    flex: 1,
  },
  inputSection: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: AppColors.surfaceCard,
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: AppColors.textPrimary,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  sampleButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: AppColors.surfaceCard,
    borderRadius: 12,
  },
  sampleButtonText: {
    color: AppColors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  startButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: AppColors.accentViolet + '20',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: AppColors.accentViolet + '40',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.accentViolet,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: AppColors.textPrimary,
    lineHeight: 20,
  },
  progressSection: {
    padding: 16,
    paddingBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: AppColors.surfaceCard,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: AppColors.accentViolet,
  },
  hintsSection: {
    padding: 16,
    paddingTop: 8,
  },
  problemCard: {
    backgroundColor: AppColors.surfaceCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  problemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AppColors.accentCyan,
    marginBottom: 8,
  },
  problemText: {
    fontSize: 13,
    color: AppColors.textSecondary,
    lineHeight: 20,
  },
  hintCard: {
    backgroundColor: AppColors.surfaceCard,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  solutionCard: {
    borderWidth: 2,
    borderColor: AppColors.accentGreen,
  },
  hintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  hintTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.textPrimary,
    flex: 1,
  },
  hintTitleLocked: {
    color: AppColors.textMuted,
  },
  unlockButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: AppColors.accentViolet,
    borderRadius: 8,
  },
  unlockButtonDisabled: {
    backgroundColor: AppColors.textMuted,
  },
  unlockButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    color: AppColors.textSecondary,
    marginTop: 8,
    fontSize: 13,
  },
  hintContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: AppColors.primaryMid,
  },
  hintText: {
    fontSize: 13,
    color: AppColors.textPrimary,
    lineHeight: 20,
  },
  resetButton: {
    marginTop: 16,
    padding: 16,
    backgroundColor: AppColors.surfaceCard,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.accentCyan,
  },
  tryItButton: {
    marginTop: 12,
    backgroundColor: AppColors.accentGreen,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  
  tryItText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
