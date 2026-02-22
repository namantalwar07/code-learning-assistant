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
}  from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { AppColors } from '../theme';
import { useErrorExplainer } from '../hooks/useErrorExplainer';
import { useHistory } from '../hooks/useHistory';
import { useModelService } from '../services/ModelService';
import { ModelLoaderWidget } from '../components';
import { PROGRAMMING_LANGUAGES, ProgrammingLanguage } from '../types/learning';
import { FormattedResponse } from '../components/FormattedResponse';
import { VoiceButton } from '../components/VoiceButton';
import { SpeakerButton } from '../components/SpeakerButton';

export const ErrorExplainerScreen: React.FC = () => {
  const modelService = useModelService();
  const { explanation, isGenerating, explainError, clear } = useErrorExplainer();
  const { saveItem } = useHistory();
  
  const [errorText, setErrorText] = useState('');
  const [mode, setMode] = useState<'simple' | 'technical'>('simple');
  const [language, setLanguage] = useState<ProgrammingLanguage>('JavaScript');

  const handleExplain = async () => {
    if (!errorText.trim()) {
      Alert.alert('Error', 'Please enter an error message');
      return;
    }

    const result = await explainError(errorText, mode, language);
    
    if (result) {
      // Save to history
      await saveItem({
        id: Date.now().toString(),
        type: 'error',
        query: errorText,
        response: result.text,
        mode,
        language,
        timestamp: Date.now(),
        tokensPerSecond: result.tokensPerSecond,
      });
    }
  };

  const handleClear = () => {
    setErrorText('');
    clear();
  };

  const loadSample = () => {
    const samples = {
      JavaScript: "TypeError: Cannot read property 'length' of undefined",
      Python: "IndentationError: expected an indented block",
      Java: "NullPointerException at line 42",
    };
    setErrorText(samples[language as keyof typeof samples] || samples.JavaScript);
  };

  if (!modelService.isLLMLoaded) {
    return (
      <ModelLoaderWidget
        title="LLM Model Required"
        subtitle="Download model to start explaining errors"
        icon="error"
        accentColor={AppColors.accentCyan}
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
        <View style={styles.inputSection}>
          <Text style={styles.label}>Paste Your Error Message:</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., TypeError: Cannot read property..."
            placeholderTextColor={AppColors.textMuted}
            value={errorText}
            onChangeText={setErrorText}
            multiline
            numberOfLines={6}
            editable={!isGenerating}
          />
          {/* Voice Input Row */}
         <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', marginTop: 12 }}>
         <VoiceButton onTranscribe={(text) => setErrorText(text)} />
         <Text style={{ color: AppColors.textSecondary, fontSize: 13 }}>
           Or speak your error
         </Text>
         </View>

          {/* Language Selector */}
          <Text style={styles.label}>Programming Language:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={language}
              onValueChange={(value) => setLanguage(value as ProgrammingLanguage)}
              style={styles.picker}
              dropdownIconColor={AppColors.textPrimary}
            >
              {PROGRAMMING_LANGUAGES.map(lang => (
                <Picker.Item key={lang} label={lang} value={lang} />
              ))}
            </Picker>
          </View>

          {/* Mode Toggle */}
          <View style={styles.modeContainer}>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'simple' && styles.modeButtonActive]}
              onPress={() => setMode('simple')}
              disabled={isGenerating}
            >
              <Text style={[styles.modeText, mode === 'simple' && styles.modeTextActive]}>
                👶 Simple
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, mode === 'technical' && styles.modeButtonActive]}
              onPress={() => setMode('technical')}
              disabled={isGenerating}
            >
              <Text style={[styles.modeText, mode === 'technical' && styles.modeTextActive]}>
                🔧 Technical
              </Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.sampleButton}
              onPress={loadSample}
              disabled={isGenerating}
            >
              <Text style={styles.sampleButtonText}>📝 Sample</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleExplain} disabled={isGenerating || !errorText.trim()}>
              <LinearGradient
                colors={[AppColors.accentCyan, AppColors.accentViolet]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.explainButton}
              >
                {isGenerating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.explainButtonText}>✨ Explain Error</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Explanation Section */}
        {(explanation || isGenerating) && (
          <View style={styles.explanationSection}>
            <View style={styles.explanationHeader}>
              <Text style={styles.explanationTitle}>
                {mode === 'simple' ? '👶 Simple Explanation' : '🔧 Technical Explanation'}
              </Text>
              {!isGenerating && (
                <TouchableOpacity onPress={handleClear}>
                  <Text style={styles.clearButton}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.explanationCard}>
              {isGenerating && !explanation ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={AppColors.accentCyan} />
                  <Text style={styles.loadingText}>AI is thinking...</Text>
                </View>
              ) : (
                <>
                // <Text style={styles.explanationText}>{explanation}</Text>
                <FormattedResponse content={explanation} />

                {explanation && (
                    <View style={{ marginTop: 12 }}>
                      <SpeakerButton 
                        text={explanation}
                        label="🔊 Listen to explanation"
                      />
                    </View>
                  )}
                </>
              )}
            </View>
          </View>
        )}

        {/* Empty State */}
        {!explanation && !isGenerating && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🐛</Text>
            <Text style={styles.emptyTitle}>Paste an error to get started</Text>
            <Text style={styles.emptySubtitle}>
              Choose Simple mode for beginner-friendly explanations{'\n'}
              or Technical mode for expert-level analysis
            </Text>
          </View>
        )}
      </ScrollView>
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
    marginTop: 12,
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
  pickerContainer: {
    backgroundColor: AppColors.surfaceCard,
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    color: AppColors.textPrimary,
  },
  modeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: AppColors.surfaceCard,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  modeButtonActive: {
    borderColor: AppColors.accentCyan,
    backgroundColor: AppColors.accentCyan + '20',
  },
  modeText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },
  modeTextActive: {
    color: AppColors.accentCyan,
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
  explainButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  explainButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  explanationSection: {
    padding: 16,
    paddingTop: 0,
  },
  explanationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  clearButton: {
    color: AppColors.accentCyan,
    fontSize: 14,
    fontWeight: '600',
  },
  explanationCard: {
    backgroundColor: AppColors.surfaceCard,
    borderRadius: 12,
    padding: 16,
    minHeight: 150,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    color: AppColors.textSecondary,
    marginTop: 12,
    fontSize: 14,
  },
  explanationText: {
    color: AppColors.textPrimary,
    fontSize: 14,
    lineHeight: 22,
  },
  emptyState: {
    alignItems: 'center',
    padding: 48,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: AppColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

