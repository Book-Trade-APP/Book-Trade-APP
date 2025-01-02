import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    logoContainer: {
        backgroundColor: '#2f95dc'
    },
    logoText: {
        textAlign: 'center',
        padding: 20,
        fontSize: 18,
        color: '#fff',
        fontWeight: '900'
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
            backgroundColor: '#f0f0f0',
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 16,
    },
    profileInfo: {
        marginLeft: 8,
    },
    userId: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    rating: {
        fontSize: 14,
        color: '#777',
    },
    headerIcons: {
        flexDirection: 'row',
        marginRight: 10,
    },
    icon: {
        marginLeft: 16,
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    buttonWrapper: {
        alignItems: 'center',
    },
    buttonText: {
        marginTop: 8,
        fontSize: 12,
    },
    optionsContainer: {
        marginTop: 16,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    optionIcon: {
        marginRight: 16,
    },
    optionText: {
        fontSize: 16,
    },
    footerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    footerText: {
        marginLeft: 8,
        fontSize: 14,
        color: 'red',
    },
});