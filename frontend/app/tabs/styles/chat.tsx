import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#fff'
    },
    header: {
        fontSize: 24,
        fontWeight: '600',
        paddingLeft: 16,
        paddingTop: 16,
        marginBottom: 16,
        color: '#333',
    },
    chatItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginHorizontal: 10, 
        marginBottom: 15 
    },
    avatar: { 
        width: 50, 
        height: 50, 
        borderRadius: 25, 
        marginRight: 10 
    },
    avatarPlaceholder: { 
        marginRight: 10 
    },
    chatInfo: { 
        flex: 1 
    },
    username: { 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    lastMessage: { 
        fontSize: 14, 
        color: '#666' 
    },
    chatTime: { 
        fontSize: 12, 
        color: '#999' 
    },
    emptyMessage: { 
        textAlign: 'center',
        marginTop: 20, 
        fontSize: 16, 
        color: '#888' 
    },
});