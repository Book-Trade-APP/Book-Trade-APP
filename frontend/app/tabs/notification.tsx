import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState, useCallback } from 'react';
import { EnhancedNotification, ApiResponse } from '../interface/Notification';
import { asyncGet, asyncPost } from '../../utils/fetch';
import { api } from '../../api/api';
import { getUserId } from '../../utils/stroage';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<EnhancedNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all');
  const [userId, setUserId] = useState<string>("");

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await asyncGet(`${api.GetUserAllNotification}?_id=${userId}`) as ApiResponse;
      
      const transformedNotifications: EnhancedNotification[] = (response.body || []).map(item => ({
        _id: item._id,
        title: item.title,
        content: item.message,
        time: new Date(item.created_at).getTime(),
        isRead: item.is_read,
      }));
      
      setNotifications(transformedNotifications);
    } catch (error) {
      console.error('獲取通知失敗:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const initializeUserId = async () => {
      const id = await getUserId();
      setUserId(id as string);
    };
    
    initializeUserId();
  }, []);
  
  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId, fetchNotifications]);

  const markAsRead = async (notification: EnhancedNotification) => {
    if (notification.isRead) return;

    try {
      await asyncPost(api.MakeRead, {
        notification_id: notification._id
      });
      
      setNotifications(prev => prev.map(item => 
        item._id === notification._id 
          ? { ...item, isRead: true }
          : item
      ));
    } catch (error) {
      console.error('標記已讀失敗:', error);
    }
  };

  const filteredNotifications = notifications
    .filter(notification => {
      switch (activeTab) {
        case 'unread':
          return !notification.isRead;
        case 'read':
          return notification.isRead;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      if (activeTab === 'all') {
        if (a.isRead !== b.isRead) {
          return a.isRead ? 1 : -1; // 未讀排在前面
        }
      }
      return b.time - a.time;
    });

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'all' && styles.activeTab]}
        onPress={() => setActiveTab('all')}
      >
        <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
          全部
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'unread' && styles.activeTab]}
        onPress={() => setActiveTab('unread')}
      >
        <Text style={[styles.tabText, activeTab === 'unread' && styles.activeTabText]}>
          未讀
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'read' && styles.activeTab]}
        onPress={() => setActiveTab('read')}
      >
        <Text style={[styles.tabText, activeTab === 'read' && styles.activeTabText]}>
          已讀
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderNotificationItem = ({ item }: { item: EnhancedNotification }) => (
    <TouchableOpacity 
      style={[
        styles.notification,
        !item.isRead && styles.unreadNotification
      ]}
      onPress={() => markAsRead(item)}
    >
      <View style={styles.notificationHeader}>
        <Text style={styles.title}>{item.title}</Text>
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>
      <Text style={styles.content}>{item.content}</Text>
      <Text style={styles.time}>
        {new Date(item.time).toLocaleDateString('zh-Hant-TW', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })} {new Date(item.time).toLocaleTimeString('zh-Hant-TW', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>通知中心</Text>
      {renderTabs()}
      {loading ? (
        <ActivityIndicator style={styles.loading} size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotificationItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.notifications}
          onRefresh={fetchNotifications}
          refreshing={loading}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingTop: 16,
    paddingLeft: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  notifications: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  notification: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadNotification: {
    backgroundColor: '#f0f9ff',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    maxWidth: 320,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
  content: {
    maxWidth: 320,
    textAlign: 'left',
    fontSize: 16,
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});