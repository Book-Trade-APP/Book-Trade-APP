import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../api/api';
import { getUserId } from '../../utils/stroage';
import { Ionicons } from '@expo/vector-icons';
import { Message } from '../interface/Message';

export default function ChatScreen({ navigation }: { navigation: any }) {
    const [userId, setUserId] = useState<string>('');
    const [chats, setChats] = useState<Message[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            const userId = await getUserId();
            setUserId(userId as string);

            const response = await fetch(`${api.GetChatsByUserId}${userId}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setChats(data);
        } catch (error) {
            console.error("Failed to fetch chats", error);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchChats();
        setRefreshing(false);
    };

    const handleMessageSent = ({ chatId, lastMessage, lastMessageTime }: { chatId: string, lastMessage: string, lastMessageTime: string}) => {
        setChats((prevChats) =>
            prevChats.map((chat) =>
                chat.chat_id === chatId
                    ? { ...chat, last_message: lastMessage, last_message_time: lastMessageTime }
                    : chat
            )
        );
    };

    const renderChatItem = ({ item }: { item: Message }) => (
        <TouchableOpacity
            style={styles.chatItem}
            onPress={() =>
                navigation.navigate('ChatDetail', {
                    chat_id: item.chat_id,
                    userId: userId,
                    receiver_id: item.receiver_id,
                    receiver_username: item.username,
                    avatar: item.avatar,
                    onMessageSent: handleMessageSent,
                })
            }
        >
            {item.avatar ? (
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
            ) : (
                <Ionicons name="person-circle-outline" size={50} color="#ccc" style={styles.avatarPlaceholder} />
            )}
            <View style={styles.chatInfo}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.lastMessage}>{item.last_message}</Text>
            </View>
            <Text style={styles.chatTime}>{new Date(item.last_message_time).toLocaleDateString()}</Text>
        </TouchableOpacity>
    );


    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>聊天</Text>
            <FlatList
                data={chats}
                renderItem={renderChatItem}
                keyExtractor={(item, index) => item.chat_id || index.toString()}
                ListEmptyComponent={
                    <Text style={styles.emptyMessage}>尚無聊天記錄</Text>
                }
                refreshing={refreshing}
                onRefresh={handleRefresh}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        fontSize: 24,
        fontWeight: '600',
        paddingLeft: 16,
        paddingTop: 16,
        marginBottom: 16,
        color: '#333',
    },
    chatItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, marginBottom: 15 },
    avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
    avatarPlaceholder: { marginRight: 10 },
    chatInfo: { flex: 1 },
    username: { fontSize: 16, fontWeight: 'bold' },
    lastMessage: { fontSize: 14, color: '#666' },
    chatTime: { fontSize: 12, color: '#999' },
    emptyMessage: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#888' },
});
