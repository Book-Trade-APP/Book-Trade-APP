import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 12,
        marginHorizontal: 16,
        marginVertical: 6,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    itemImage: {
        width: 100,
        height: 100,
        marginRight: 12,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    itemInfo: {
        flex: 1,
        paddingVertical: 4,
        justifyContent: 'space-between',
        height: 80,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        lineHeight: 22,
    },
    author: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    priceContainer: {
        minWidth: 70,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingLeft: 8,
    },
    priceText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FF4757',
        textAlign: 'right',
    },
    footerText: {
        textAlign: 'center',
        color: '#888',
        fontSize: 14,
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 8,
    }
});