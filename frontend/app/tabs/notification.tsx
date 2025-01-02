import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState, useCallback } from 'react';
import { EnhancedNotification, ApiResponse } from '../interface/Notification';
import { asyncGet, asyncPost } from '@/utils/fetch';
import { api } from '@/api/api';
import { getUserId } from '@/utils/stroage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { styles } from './styles/notification';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<EnhancedNotification[]>([]);
  const navigation = useNavigation<NavigationProp<any>>();
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
  const handleNotificationPress = async (notification: EnhancedNotification) => {
    // 先標記為已讀
    await markAsRead(notification);

    // 根據通知標題處理跳轉
    switch (notification.title) {
      case "新的待確認訂單":
        navigation.navigate("Profile", {
          screen: "OrderStatus",
          params: { status: "待確認" }
        });
        break;
      case "訂單已確認":
        navigation.navigate("Profile", {
          screen: "OrderStatus",
          params: { status: "待處理" }
        });
        break;
      case "收到新評價":
        navigation.navigate("Profile", {
          screen: "Index"
        });
        break;
      case "訂單已完成":
        navigation.navigate("Profile", {
          screen: "OrderStatus",
          params: { status: "已完成" }
        });
      case "系統提醒":
        navigation.navigate("Profile", {
          screen: "Setting"
        })
        break;
      default:
        // 如果不是上述幾種通知，只標記已讀不跳轉
        break;
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
      onPress={() => handleNotificationPress(item)}
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