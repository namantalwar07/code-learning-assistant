// CREATE THIS FILE
// Purpose: Render code with syntax highlighting, line numbers, copy button

/* Features to implement:
1. Accept props: code, language, showLineNumbers, maxHeight
2. Use react-syntax-highlighter library
3. Theme: 'atomOneDark' (matches app dark theme)
4. Add copy-to-clipboard button (top-right corner)
5. Add expand/collapse for long code (>20 lines)
6. Add line numbers on left side
7. Match AppColors theme
*/

// Dependencies needed:
import SyntaxHighlighter from 'react-native-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/styles/hljs';
import Clipboard from '@react-native-clipboard/clipboard';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// Component structure:
interface CodeBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  maxHeight?: number;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, showLineNumbers = false, maxHeight = 200 }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    Clipboard.setString(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <View>
      <TouchableOpacity onPress={handleCopy}>
        <Text>{copied ? 'Copied!' : 'Copy'}</Text>
      </TouchableOpacity>

      <SyntaxHighlighter
        language={language}
        style={atomOneDark}
        showLineNumbers={showLineNumbers}
      >
        {code}
      </SyntaxHighlighter>
    </View>
  );
  
  // Render syntax highlighter with custom styling
  // Add copy button overlay
  // Add expand/collapse if code is long
};
