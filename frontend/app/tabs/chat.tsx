import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { api } from '../../api/api';

export default function ChatScreen({ navigation }) {
    const [chats, setChats] = useState([]);
    const userId = "676e4d0a258fc1ff9af741c4"; // 測試用有效用戶 ID

    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            const response = await fetch(`${api.GetChatsByUserId}${userId}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setChats(data);
        } catch (error) {
            console.error("Failed to fetch chats", error);
        }
    };

    const renderChatItem = ({ item }) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() =>
                navigation.navigate('ChatDetail', {
                    chatId: item.chat_id,
                    username: item.username,
                    avatar: item.avatar,
                })
            }
        >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.chatInfo}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.lastMessage}>{item.last_message}</Text>
            </View>
            <Text style={styles.chatTime}>{new Date(item.last_message_time).toLocaleDateString()}</Text>
        </TouchableOpacity>
    );

    if (chats.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.emptyMessage}>尚無聊天記錄</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={chats}
                renderItem={renderChatItem}
                keyExtractor={(item, index) => item.chat_id || index.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 10 },
    chatItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
    chatInfo: { flex: 1 },
    username: { fontSize: 16, fontWeight: 'bold' },
    lastMessage: { fontSize: 14, color: '#666' },
    chatTime: { fontSize: 12, color: '#999' },
    emptyMessage: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#888' },
});
