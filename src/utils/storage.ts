import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData, HistoryItem } from '../types/learning';

const STORAGE_KEY = '@code_learning_assistant_data';
const MAX_HISTORY_ITEMS = 100;

const getDefaultData = (): AppData => ({
  history: [],
  stats: {
    totalQueries: 0,
    errorCount: 0,
    hintCount: 0,
    commonTopics: {},
  },
});

export const StorageManager = {
  async getData(): Promise<AppData> {
    try {
      const jsonData = await AsyncStorage.getItem(STORAGE_KEY);
      if (!jsonData) return getDefaultData();
      return JSON.parse(jsonData);
    } catch (error) {
      console.error('Error loading data:', error);
      return getDefaultData();
    }
  },

  async saveData(data: AppData): Promise<void> {
    try {
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem(STORAGE_KEY, jsonData);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  },

  async addHistoryItem(item: HistoryItem): Promise<void> {
    try {
      const data = await this.getData();
      
      // Add to beginning of array (most recent first)
      data.history.unshift(item);
      
      // Limit to MAX_HISTORY_ITEMS
      if (data.history.length > MAX_HISTORY_ITEMS) {
        data.history = data.history.slice(0, MAX_HISTORY_ITEMS);
      }
      
      // Update stats
      data.stats.totalQueries++;
      if (item.type === 'error') {
        data.stats.errorCount++;
      } else {
        data.stats.hintCount++;
      }
      
      // Extract topics (simple keyword matching)
      const topics = this.extractTopics(item.query);
      topics.forEach(topic => {
        data.stats.commonTopics[topic] = (data.stats.commonTopics[topic] || 0) + 1;
      });
      
      await this.saveData(data);
    } catch (error) {
      console.error('Error adding history item:', error);
    }
  },

  async getHistory(): Promise<HistoryItem[]> {
    const data = await this.getData();
    return data.history;
  },

  async deleteHistoryItem(id: string): Promise<void> {
    const data = await this.getData();
    data.history = data.history.filter(item => item.id !== id);
    await this.saveData(data);
  },

  async clearHistory(): Promise<void> {
    await this.saveData(getDefaultData());
  },

  extractTopics(text: string): string[] {
    const keywords = [
      'null', 'undefined', 'syntax', 'array', 'loop', 'function',
      'class', 'pointer', 'memory', 'type', 'index', 'parse',
      'reference', 'scope', 'async', 'promise', 'import',
    ];
    
    const lowerText = text.toLowerCase();
    return keywords.filter(k => lowerText.includes(k));
  },
};
