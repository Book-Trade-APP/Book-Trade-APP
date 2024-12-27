import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import { api } from '../../api/api';

export default function ChatScreen() {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const [chatId, setChatId] = useState('');
  const [userId, setUserId] = useState('676e4d0a258fc1ff9af741c4');  // 假設的用戶 ID

  useEffect(() => {
    fetchChats();  // 加載聊天列表
  }, []);

  // 獲取聊天列表
  const fetchChats = async () => {
    try {
      const response = await fetch(`${api.GetChatsByUserId}${userId}`);
      const data = await response.json();
      console.log('Chats fetched:', data);
      setChats(data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  // 發送消息
  const sendMessage = async () => {
    if (!message || !chatId) return;

    const messageData = {
      chat_id: chatId,
      sender_id: userId,
      receiver_id: '676eb01e2bf5f3b89e82e787',  // 假設的接收者 ID
      content: message,
    };

    try {
      const response = await fetch(api.SendMessage, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Message sent:', result);
        setMessage('');  // 清空輸入框
        fetchChats();  // 刷新聊天列表
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>聊聊</Text>

      <View>
        <Text style={styles.chatTitle}>聊天列表</Text>
        {chats.length > 0 ? (
          chats.map((chat) => (
            <View key={chat._id} style={styles.chatItem}>
              <Text>Chat with: {chat.participants.join(', ')}</Text>
              <Button title="Select Chat" onPress={() => setChatId(chat._id)} />
            </View>
          ))
        ) : (
          <Text>No chats available</Text>
        )}
      </View>

      <View style={styles.messageContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={message}
          onChangeText={setMessage}
        />
        <Button title="Send Message" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chatTitle: {
    fontSize: 20,
    marginVertical: 10,
  },
  chatItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  messageContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
});
