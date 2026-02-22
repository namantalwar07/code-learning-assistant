// CREATE THIS FILE
// Purpose: Component that renders mixed text + code content

/* Features:
1. Takes parsed content array
2. Renders text as <Text> and code as <CodeBlock>
3. Handles empty states
4. Scrollable
*/

import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { ParsedContent, codeParser } from '../utils/codeParser';
import { CodeBlock } from './CodeBlock';
import { AppColors } from '../theme';

interface FormattedResponseProps {
  content: string; // Raw LLM response
}

export const FormattedResponse: React.FC<FormattedResponseProps> = ({ content }) => {
  const parsed = codeParser.formatResponse(content);

  return (
    <ScrollView style={styles.container}>
      {parsed.map((item, index) =>
        item.type === 'code' ? (
          <CodeBlock
            key={index}
            code={item.content}
            language={item.language || 'javascript'}
            showLineNumbers
          />
        ) : (
          <Text key={index} style={styles.text}>
            {item.content}
          </Text>
        )
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  text: {
    color: AppColors.textPrimary,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
});