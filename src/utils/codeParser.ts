// CREATE THIS FILE
// Purpose: Parse LLM responses to extract code blocks

/* Functions to implement:
1. extractCodeBlocks(text: string): ParsedContent[]
   - Finds ```language\ncode\n``` patterns
   - Returns array of { type: 'text' | 'code', content, language }

2. detectLanguage(code: string): string
   - Auto-detect if no language specified
   - Look for keywords: def/print=python, function/const=javascript, etc.

3. formatResponse(text: string, renderCodeBlock: (code, lang) => JSX.Element): JSX.Element[]
   - Main function used by screens
   - Takes raw text, returns array of Text/CodeBlock components
*/

// export interface ParsedContent {
//     type: 'text' | 'code';
//     content: string;
//     language?: string;
//   }
  
//   export const codeParser = {
//     extractCodeBlocks(text: string): ParsedContent[] {
//       // Regex to find ```language\ncode\n```
//       // Split text into text and code segments
//       // Return structured array
//     },
    
//     detectLanguage(code: string): string {
//       // Simple heuristics
//     },
    
//     formatResponse(text: string): ParsedContent[] {
//       // Main public API
//     }
//   };
export interface ParsedContent {
    type: 'text' | 'code';
    content: string;
    language?: string;
  }
  
  export const codeParser = {
    extractCodeBlocks(text: string): ParsedContent[] {
      const regex = /```(\w+)?\n([\s\S]*?)```/g;
      const result: ParsedContent[] = [];
  
      let lastIndex = 0;
      let match: RegExpExecArray | null;
  
      while ((match = regex.exec(text)) !== null) {
        const [fullMatch, lang, code] = match;
  
        // Add text before code block
        if (match.index > lastIndex) {
          result.push({
            type: 'text',
            content: text.slice(lastIndex, match.index),
          });
        }
  
        result.push({
          type: 'code',
          content: code.trim(),
          language: lang || codeParser.detectLanguage(code),
        });
  
        lastIndex = match.index + fullMatch.length;
      }
  
      // Add remaining text
      if (lastIndex < text.length) {
        result.push({
          type: 'text',
          content: text.slice(lastIndex),
        });
      }
  
      return result;
    },
  
    detectLanguage(code: string): string {
      if (code.includes('def ') || code.includes('print(')) return 'python';
      if (code.includes('function') || code.includes('const ')) return 'javascript';
      if (code.includes('#include')) return 'cpp';
      if (code.includes('public class')) return 'java';
      return 'text';
    },
  
    formatResponse(text: string): ParsedContent[] {
      return codeParser.extractCodeBlocks(text);
    }
  };