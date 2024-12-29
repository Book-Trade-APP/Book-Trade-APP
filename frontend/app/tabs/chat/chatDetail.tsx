import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import { api } from '../../../api/api';

export default function ChatDetail({ route }) {
    const { chatId, username, avatar } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const flatListRef = useRef(null);

    useEffect(() => {
        if (!chatId) {
            console.error("Invalid chatId");
            return;
        }
        console.log('chatId:', chatId); // 日誌
        fetchMessages();
    }, []);

    useEffect(() => {
        console.log('Updated messages state:', messages); // 日誌
        if (messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const response = await fetch(`${api.GetMessagesByChatId}${chatId}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            console.log('Fetched messages:', data); // 日誌
            setMessages(data);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            const response = await fetch(api.SendMessage, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    sender_id: '676e4d0a258fc1ff9af741c4',  // 替換為動態用戶 ID
                    receiver_id: '676eb01e2bf5f3b89e82e787', // 替換為對方用戶 ID
                    content: newMessage,
                }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const sentMessage = await response.json();
            setMessages((prevMessages) => [...prevMessages, sentMessage]);
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };


    const renderMessageItem = ({ item }) => (
        <View style={[styles.messageItem, item.isMine ? styles.myMessage : styles.theirMessage]}>
            <Text style={styles.messageContent}>{item.content}</Text>
            <Text style={styles.messageTime}>{new Date(item.time).toLocaleTimeString()}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={{ uri: avatar }} style={styles.avatar} />
                <Text style={styles.username}>{username}</Text>
            </View>
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessageItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.messageList}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="輸入訊息..."
                    multiline
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>發送</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#f5f5f5' },
    avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
    username: { fontSize: 18, fontWeight: 'bold' },
    messageList: { flex: 1, padding: 10 },
    messageItem: { padding: 10, borderRadius: 8, marginBottom: 10 },
    myMessage: { alignSelf: 'flex-end', backgroundColor: '#dcf8c6' },
    theirMessage: { alignSelf: 'flex-start', backgroundColor: '#e5e5ea' },
    messageContent: { fontSize: 16 },
    messageTime: { fontSize: 12, color: '#999', marginTop: 5, textAlign: 'right' },
    inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderColor: '#ccc' },
    input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginRight: 10 },
    sendButton: { backgroundColor: '#007bff', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 20 },
    sendButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
