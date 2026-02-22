export interface HistoryItem {
    id: string;
    type: 'error' | 'hint';
    query: string;
    response: string;
    mode?: 'simple' | 'technical'; // for error explainer
    language?: string;
    timestamp: number;
    tokensPerSecond?: number;
  }
  
  export interface AppData {
    history: HistoryItem[];
    stats: {
      totalQueries: number;
      errorCount: number;
      hintCount: number;
      commonTopics: Record<string, number>;
    };
  }
  
  export const PROGRAMMING_LANGUAGES = [
    'JavaScript',
    'Python',
    'Java',
    'C++',
    'C#',
    'Go',
    'Rust',
    'SQL',
    'PHP',
    'Other',
  ] as const;
  
  export type ProgrammingLanguage = typeof PROGRAMMING_LANGUAGES[number];
  