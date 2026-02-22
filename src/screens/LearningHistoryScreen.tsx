import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  Modal,
} from 'react-native';
import { AppColors } from '../theme';
import { useHistory } from '../hooks/useHistory';
import { HistoryItem } from '../types/learning';

export const LearningHistoryScreen: React.FC = () => {
  const { history, stats, loading, deleteItem, clearAll, refresh } = useHistory();
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteItem(id) },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All History',
      'This will delete all your learning history. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearAll },
      ]
    );
  };

  const handleItemPress = (item: HistoryItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = Date.now();
    const diff = now - timestamp;
    
    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return minutes <= 1 ? 'Just now' : `${minutes} mins ago`;
    }
    
    // Less than 24 hours
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    
    // Less than 7 days
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
    
    // Format as date
    return date.toLocaleDateString();
  };

  const getTopTopics = () => {
    return Object.entries(stats.commonTopics)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([topic]) => topic);
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => handleItemPress(item)}
      onLongPress={() => handleDelete(item.id)}
    >
      <View style={styles.itemHeader}>
        <View style={[
          styles.badge,
          item.type === 'error' ? styles.badgeError : styles.badgeHint
        ]}>
          <Text style={styles.badgeText}>
            {item.type === 'error' ? '🐛 Error' : '💡 Hint'}
          </Text>
        </View>
        <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
      </View>
      
      <Text style={styles.queryText} numberOfLines={2}>
        {item.query}
      </Text>
      
      {item.mode && (
        <Text style={styles.metadata}>
          Mode: {item.mode} {item.language && `• ${item.language}`}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Stats Section */}
      {history.length > 0 && (
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>📊 Your Learning Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalQueries}</Text>
              <Text style={styles.statLabel}>Total Queries</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.errorCount}</Text>
              <Text style={styles.statLabel}>Errors Explained</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.hintCount}</Text>
              <Text style={styles.statLabel}>Problems Solved</Text>
            </View>
          </View>
          
          {getTopTopics().length > 0 && (
            <View style={styles.topicsSection}>
              <Text style={styles.topicsLabel}>Common Topics:</Text>
              <View style={styles.topicsContainer}>
                {getTopTopics().map(topic => (
                  <View key={topic} style={styles.topicChip}>
                    <Text style={styles.topicText}>{topic}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      {/* History List */}
      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyTitle}>No History Yet</Text>
          <Text style={styles.emptySubtitle}>
            Your learning journey will be tracked here!{'\n'}
            Start by explaining an error or solving a problem.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={styles.clearButton}>Clear All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={history}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={refresh}
                tintColor={AppColors.accentCyan}
              />
            }
          />
        </>
      )}

      {/* Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedItem?.type === 'error' ? '🐛 Error Details' : '💡 Solution Details'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Query:</Text>
              <Text style={styles.modalQuery}>{selectedItem?.query}</Text>
              
              <Text style={styles.modalLabel}>Response:</Text>
              <Text style={styles.modalResponse}>{selectedItem?.response}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => {
                if (selectedItem) {
                  handleDelete(selectedItem.id);
                  setModalVisible(false);
                }
              }}
            >
              <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.primaryDark,
  },
  statsSection: {
    padding: 16,
    backgroundColor: AppColors.surfaceCard,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.textMuted + '20',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textPrimary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: AppColors.primaryMid,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: AppColors.accentCyan,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },
  topicsSection: {
    marginTop: 16,
  },
  topicsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: AppColors.textSecondary,
    marginBottom: 8,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicChip: {
    backgroundColor: AppColors.accentViolet + '30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  topicText: {
    fontSize: 12,
    color: AppColors.accentViolet,
    fontWeight: '600',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  clearButton: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.error,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  historyItem: {
    backgroundColor: AppColors.surfaceCard,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeError: {
    backgroundColor: AppColors.accentCyan + '30',
  },
  badgeHint: {
    backgroundColor: AppColors.accentViolet + '30',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: AppColors.textMuted,
  },
  queryText: {
    fontSize: 14,
    color: AppColors.textPrimary,
    lineHeight: 20,
    marginBottom: 8,
  },
  metadata: {
    fontSize: 11,
    color: AppColors.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  emptyIcon: {
    fontSize: 72,
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
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: AppColors.surfaceCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.textMuted + '20',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.textPrimary,
  },
  closeButton: {
    fontSize: 24,
    color: AppColors.textMuted,
    fontWeight: '300',
  },
  modalBody: {
    padding: 20,
  },
  modalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: AppColors.accentCyan,
    marginBottom: 8,
    marginTop: 16,
  },
  modalQuery: {
    fontSize: 14,
    color: AppColors.textPrimary,
    lineHeight: 20,
  },
  modalResponse: {
    fontSize: 13,
    color: AppColors.textSecondary,
    lineHeight: 20,
  },
  deleteButton: {
    margin: 20,
    marginTop: 0,
    padding: 16,
    backgroundColor: AppColors.error + '20',
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.error,
  },
});
