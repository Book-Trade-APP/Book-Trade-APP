import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../../api/api';
import { Ionicons } from '@expo/vector-icons';

export default function ChatDetail({ route }) {
    const { chatId, userId, receiver_id, receiver_username, avatar } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const flatListRef = useRef(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await fetch(`${api.GetMessagesByChatId}${chatId}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
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
                    sender_id: userId,
                    receiver_id: receiver_id,
                    content: newMessage,
                }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const json = await response.json();
            const sentMessage = json["inserted_message"]
            console.log("json:", json);
            console.log("sentMessage:", sentMessage);

            setMessages((prevMessages) => [...prevMessages, sentMessage]);
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };


    const renderMessageItem = ({ item }) => {
        const isMine = item.sender_id === userId;
        const formatTime = (timestamp) => {
            const date = new Date(timestamp);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        return (
            <View style={[styles.messageItem, isMine ? styles.myMessage : styles.theirMessage]}>
                <Text style={styles.messageContent}>{item.content}</Text>
                <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                {avatar ? (
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                ) : (
                    <Ionicons
                        name="person-circle-outline"
                        size={40}
                        color="#ccc"
                        style={styles.avatarPlaceholder}
                    />
                )}
                <Text style={styles.receiver_username}>{receiver_username}</Text>
            </View>
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessageItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.messageList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#f5f5f5' },
    avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
    avatarPlaceholder: { marginRight: 10 },
    receiver_username: { fontSize: 18, fontWeight: 'bold' },
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
