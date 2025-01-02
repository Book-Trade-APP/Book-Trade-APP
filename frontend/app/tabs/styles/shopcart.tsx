import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 24,
        fontWeight: '600',
        paddingLeft: 16,
        paddingTop: 16,
        marginBottom: 16,
        color: '#333',
    },
    itemContainer: {
        flexDirection: 'row',
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
    checkbox: {
        marginRight: 8,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    itemImage: {
        width: 60,
        height: 60,
        marginRight: 12,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    itemInfo: {
        flex: 1,
    },
    infoTopContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    textContainer: {
        flex: 1,
        marginRight: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    author: {
        fontSize: 14,
        color: '#666',
    },
    priceAndQuantityContainer: {
        alignItems: 'flex-end',
    },
    priceText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FF4757',
        marginBottom: 8,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
    },
    quantityButton: {
        padding: 6,
        borderRadius: 6,
        backgroundColor: '#f0f0f0',
        marginHorizontal: 8,
    },
    quantityButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    quantityText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        minWidth: 30,
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    checkoutButton: {
        backgroundColor: '#ddd',
        padding: 12,
        borderRadius: 8,
        minWidth: 120,
    },
    activeCheckoutButton: {
        backgroundColor: '#2f95dc',
    },
    checkoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    checkboxText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginLeft: 4,
    },
    selectAllContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerText: {
        textAlign: 'center',
        color: '#888',
        fontSize: 14,
        fontWeight: '500',
        marginVertical: 12,
    },
});