import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fake_notifications } from '../data/fakeNotification';
import { Notification } from '../interface/Notification';
export default function NotificationsScreen() {
  // 渲染單個通知項目的函數
  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <View style={styles.notification}>
      <Text style={styles.title}>{item.title}</Text>
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
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>通知中心</Text>
      <FlatList
        data={fake_notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.notifications}
      />
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
  notifications: {
    flexGrow: 1,
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  content: {
    fontSize: 16,
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
});