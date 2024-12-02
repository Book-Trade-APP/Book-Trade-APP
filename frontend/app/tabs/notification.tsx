import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fake_notifications } from '../data/fakeNotification';
export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>通知中心</Text>
      <ScrollView contentContainerStyle={styles.notifications}>
        {fake_notifications.map((notification, index) => (
          <View key={index} style={styles.notification}>
            <Text style={styles.title}>{notification.title}</Text>
            <Text style={styles.content}>{notification.content}</Text>
            <Text style={styles.time}>
              {new Date(notification.time).toLocaleDateString('zh-Hant-TW', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })} {new Date(notification.time).toLocaleTimeString('zh-Hant-TW', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
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