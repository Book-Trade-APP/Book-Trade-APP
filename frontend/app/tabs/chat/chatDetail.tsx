import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Image, ListRenderItem } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '@/api/api';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ChatStackParamList } from '@/app/navigation/type';
import { useHideTabBar } from '@/app/hook/HideTabBar';
import { Message } from '@/app/interface/Message';
import { styles } from '../styles/chatDetail';

export default function ChatDetail() {
    const route = useRoute<RouteProp<ChatStackParamList, "ChatDetail">>();
    const { chat_id: initialChatId, userId, receiver_id, receiver_username, avatar, onMessageSent } = route.params;
    const [chatId, setChatId] = useState<string>(initialChatId as string);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const navigation = useNavigation<NavigationProp<ChatStackParamList>>();
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        if (initialChatId !== chatId) {
            setChatId(initialChatId as string);
        }
    }, [route.params.chat_id]);

    useEffect(() => {
        const initializeChat = async () => {
            if (!chatId) {
                const newChatId = await findOrCreateChat();
                if (newChatId) {
                    setChatId(newChatId);
                }
                return;
            }
            fetchMessages();
        };
        initializeChat();
    }, [chatId]);

    const findOrCreateChat = async (): Promise<string | null> => {
        try {
            const queryResponse = await fetch(
                `${api.GetChatIdByParticipantIds}/${userId},${receiver_id}`
            );

            if (queryResponse.ok) {
                const data = await queryResponse.json();
                return data.body as string;
            }

            const createResponse = await fetch(`${api.CreateChat}/${userId},${receiver_id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
            });

            if (!createResponse.ok) throw new Error(`HTTP error! status: ${createResponse.status}`);
            const createdChatId = await createResponse.json();
            return createdChatId;
        } catch (error) {
            console.error('Error in findOrCreateChat:', error);
            return null;
        }
    };

    const fetchMessages = async (): Promise<void> => {
        try {
            const response = await fetch(`${api.GetMessagesByChatId}${chatId}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    };

    const sendMessage = async (): Promise<void> => {
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
            const sentMessage = json.inserted_message as Message;

            setMessages((prevMessages) => [...prevMessages, sentMessage]);
            route.params.onMessageSent({
                chatId,
                lastMessage: sentMessage.content,
                lastMessageTime: sentMessage.timestamp
            });
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    const renderMessageItem: ListRenderItem<Message> = ({ item }) => {
        const isMine = item.sender_id === userId;
        const formatTime = (timestamp: string) => {
            const date = new Date(timestamp);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        return (
            <View style={[styles.messageItem, isMine ? styles.myMessage : styles.theirMessage]}>
                <Text style={[styles.messageContent, { textAlign: isMine ? 'right' : 'left' }]}>{item.content}</Text>
                <Text style={[styles.messageTime, { textAlign: isMine ? 'right' : 'left' }]}>
                    {formatTime(item.timestamp)}
                </Text>
            </View>
        );
    };

    useHideTabBar();
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={styles.backButton}
                >
                    <Ionicons name="chevron-back" size={28} color="#2c3e50" />
                </TouchableOpacity>
                {avatar ? (
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                ) : (
                    <Ionicons name="person-circle-outline" size={40} color="#ccc" style={styles.avatarPlaceholder} />
                )}
                <Text style={styles.receiver_username}>{receiver_username}</Text>
            </View>
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessageItem}
                keyExtractor={(_, index) => index.toString()}
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