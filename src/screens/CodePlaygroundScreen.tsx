// CREATE THIS FILE
// Purpose: Main code playground interface

/* Layout:
- Language selector dropdown (JS/Python)
- Code editor (enhanced TextInput)
- Run/Clear/Samples buttons
- Output console
- Error display
*/

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';
import { AppColors } from '../theme';
import { ExecutionEngine } from '../services/ExecutionEngine';
import { SAMPLE_CODE } from '../utils/codeSamples';
import { Platform } from 'react-native';

export const CodePlaygroundScreen: React.FC = () => {
  const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  
  const handleRun = async () => {
    setIsRunning(true);
    setOutput('');
    
    const startTime = Date.now();
    
    try {
    //   const result = language === 'javascript'
    //     ? await ExecutionEngine.executeJavaScript(code)
    //     : await ExecutionEngine.executePython(code);
    let result: { success: boolean; output?: string; error?: string };

     if (language === 'javascript') {
       result = await ExecutionEngine.executeJavaScript(code);
    } else {
      result = await ExecutionEngine.executePython(code);
    }
      
      const endTime = Date.now();
      setExecutionTime(endTime - startTime);
      
      if (result.success) {
        setOutput(result.output ?? '(No output)');
      } else {
        setOutput(`❌ Error:\n${result.error}`);
      }
    } catch (error) {
      setOutput(`❌ Error:\n${error}`);
    } finally {
      setIsRunning(false);
    }
  };
  
  const handleClear = () => {
    setCode('');
    setOutput('');
    setExecutionTime(null);
  };
  
  const loadSample = (sampleKey: string) => {
    setCode(SAMPLE_CODE[language][sampleKey]);
  };
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Language Selector */}
        <View style={styles.languageSection}>
          <Text style={styles.label}>Language:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={language}
              onValueChange={(value) => setLanguage(value as 'javascript' | 'python')}
              style={styles.picker}
            >
              <Picker.Item label="JavaScript" value="javascript" />
              <Picker.Item label="Python" value="python" />
            </Picker>
          </View>
        </View>
        
        {/* Code Editor */}
        <Text style={styles.label}>Code:</Text>
        <TextInput
          style={styles.codeEditor}
          placeholder={`Write ${language} code here...`}
          placeholderTextColor={AppColors.textMuted}
          value={code}
          onChangeText={setCode}
          multiline
          editable={!isRunning}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          textAlignVertical="top"
        />
        
        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.sampleButton} onPress={() => loadSample('hello')}>
            <Text style={styles.buttonText}>📝 Hello World</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.buttonText}>🗑️ Clear</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleRun} disabled={isRunning || !code.trim()}>
            <LinearGradient
              colors={[AppColors.accentGreen, AppColors.accentCyan]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.runButton}
            >
              {isRunning ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.runButtonText}>▶️ Run Code</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        {/* Output Console */}
        <Text style={styles.label}>Output:</Text>
        <View style={styles.outputConsole}>
          {output ? (
            <>
              <Text style={styles.outputText}>{output}</Text>
              {executionTime !== null && (
                <Text style={styles.executionTime}>
                  ✅ Executed in {executionTime}ms
                </Text>
              )}
            </>
          ) : (
            <Text style={styles.placeholderText}>
              Output will appear here...
            </Text>
          )}
        </View>
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
  languageSection: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textPrimary,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  pickerContainer: {
    backgroundColor: AppColors.surfaceCard,
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    color: AppColors.textPrimary,
  },
  codeEditor: {
    backgroundColor: AppColors.surfaceCard,
    borderRadius: 12,
    padding: 16,
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: AppColors.textPrimary,
    minHeight: 250,
    marginHorizontal: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  sampleButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: AppColors.surfaceCard,
    borderRadius: 12,
  },
  clearButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: AppColors.surfaceCard,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 13,
    color: AppColors.textPrimary,
    fontWeight: '600',
  },
  runButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  runButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  outputConsole: {
    backgroundColor: AppColors.primaryMid,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    minHeight: 150,
  },
  outputText: {
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: AppColors.textPrimary,
    lineHeight: 20,
  },
  placeholderText: {
    fontSize: 13,
    color: AppColors.textMuted,
    fontStyle: 'italic',
  },
  executionTime: {
    fontSize: 12,
    color: AppColors.accentGreen,
    marginTop: 12,
    fontWeight: '600',
  },
});
