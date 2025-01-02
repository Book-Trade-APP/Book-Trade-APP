import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 23,
        marginRight: 12,
    },
    avatarPlaceholder: {
        marginRight: 12,
    },
    receiver_username: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
    },
    messageList: {
        flex: 1,
        padding: 16,
    },
    messageItem: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginBottom: 12,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#007AFF',
    },
    theirMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#888888',
    },
    messageContent: {
        fontSize: 16,
        lineHeight: 22,
        color: '#ffffff',
    },
    messageTime: {
        fontSize: 12,
        marginTop: 6,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#E9ECEF',
    },
    input: {
        flex: 1,
        minHeight: 40,
        maxHeight: 100,
        backgroundColor: '#F8F9FA',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 12,
        fontSize: 16,
    },
    sendButton: {
        backgroundColor: '#007AFF',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    sendButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});