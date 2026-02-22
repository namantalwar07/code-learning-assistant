// CREATE THIS FILE
// Purpose: Dedicated chat screen with context awareness

/* Based on starter app's ChatScreen.tsx but enhanced with:
1. Accept context from navigation params
2. Show context chip at top
3. Use FormattedResponse for code blocks
4. Add voice input button
5. Save conversation to history
*/

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useRoute, RouteProp } from '@react-navigation/native';
import { AppColors } from '../theme';
import { useConversation } from '../hooks/useConversation';
import { useModelService } from '../services/ModelService';
import { ModelLoaderWidget } from '../components';
import { FormattedResponse } from '../components/FormattedResponse';
import { VoiceButton } from '../components/VoiceButton';

type ChatRouteParams = {
  SmartChat: {
    contextType?: 'error' | 'hint';
    contextQuery?: string;
    contextResponse?: string;
  };
};

export const SmartChatScreen: React.FC = () => {
  const route = useRoute<RouteProp<ChatRouteParams, 'SmartChat'>>();
  const modelService = useModelService();
  
  const context = route.params ? {
    type: route.params.contextType,
    originalQuery: route.params.contextQuery,
    previousResponse: route.params.contextResponse,
  } : undefined;
  
  const { messages, isGenerating, sendMessage } = useConversation(context);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  
  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);
  
  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isGenerating) return;
    
    setInputText('');
    await sendMessage(text);
  };
  
  if (!modelService.isLLMLoaded) {
    return (
      <ModelLoaderWidget
        title="LLM Model Required"
        subtitle="Download model to start chatting"
        icon="chat"
        accentColor={AppColors.accentViolet}
        isDownloading={modelService.isLLMDownloading}
        isLoading={modelService.isLLMLoading}
        progress={modelService.llmDownloadProgress}
        onLoad={modelService.downloadAndLoadLLM}
      />
    );
  }
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Context Chip */}
      {context && (
        <View style={styles.contextChip}>
          <Text style={styles.contextText}>
            💬 Continuing from: {context.type === 'error' ? 'Error Explanation' : 'Hint Mode'}
          </Text>
        </View>
      )}
      
      {/* Messages */}
      {messages.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>💬</Text>
          <Text style={styles.emptyTitle}>Ask AI Anything</Text>
          <Text style={styles.emptySubtitle}>
            {context 
              ? 'Ask follow-up questions about your problem'
              : 'Start a conversation about coding'}
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => (
            <View style={[
              styles.messageBubble,
              item.role === 'user' ? styles.userBubble : styles.assistantBubble
            ]}>
              {item.role === 'user' ? (
                <Text style={styles.messageText}>{item.text}</Text>
              ) : (
                <FormattedResponse content={item.text} />
              )}
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
        />
      )}
      
      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Ask a question..."
            placeholderTextColor={AppColors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            editable={!isGenerating}
            multiline
          />
          
          <VoiceButton onTranscribe={(text) => setInputText(text)} />
          
          <TouchableOpacity onPress={handleSend} disabled={!inputText.trim()}>
            <LinearGradient
              colors={[AppColors.accentViolet, AppColors.accentPink]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sendButton}
            >
              <Text style={styles.sendIcon}>📤</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.primaryDark,
  },
  contextChip: {
    backgroundColor: AppColors.accentViolet + '30',
    padding: 12,
    margin: 16,
    marginBottom: 0,
    borderRadius: 8,
  },
  contextText: {
    fontSize: 13,
    color: AppColors.accentViolet,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },
  messageList: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: AppColors.accentCyan,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: AppColors.surfaceCard,
  },
  messageText: {
    fontSize: 14,
    color: AppColors.textPrimary,
    lineHeight: 20,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: AppColors.surfaceCard,
    borderTopWidth: 1,
    borderTopColor: AppColors.textMuted + '20',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: AppColors.primaryMid,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 15,
    color: AppColors.textPrimary,
    maxHeight: 100,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    fontSize: 20,
  },
});