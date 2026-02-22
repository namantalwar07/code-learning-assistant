import { useState, useEffect, useCallback } from 'react';
import { StorageManager } from '../utils/storage';
import { HistoryItem, AppData } from '../types/learning';

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [stats, setStats] = useState<AppData['stats']>({
    totalQueries: 0,
    errorCount: 0,
    hintCount: 0,
    commonTopics: {},
  });
  const [loading, setLoading] = useState(false);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const data = await StorageManager.getData();
      setHistory(data.history);
      setStats(data.stats);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveItem = useCallback(async (item: HistoryItem) => {
    await StorageManager.addHistoryItem(item);
    await loadHistory(); // Reload to get updated stats
  }, [loadHistory]);

  const deleteItem = useCallback(async (id: string) => {
    await StorageManager.deleteHistoryItem(id);
    await loadHistory();
  }, [loadHistory]);

  const clearAll = useCallback(async () => {
    await StorageManager.clearHistory();
    await loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    history,
    stats,
    loading,
    saveItem,
    deleteItem,
    clearAll,
    refresh: loadHistory,
  };
}
