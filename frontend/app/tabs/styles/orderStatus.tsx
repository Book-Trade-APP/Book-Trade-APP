import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginVertical: 8,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#2f95dc',
    },
    tabText: {
        fontSize: 16,
        color: '#666',
    },
    activeTabText: {
        color: '#2f95dc',
        fontWeight: 'bold',
    },
    itemContainer: {
        flexDirection: "row",
        backgroundColor: "#ffffff",
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    itemImage: {
        width: 99,
        height: 99,
        borderRadius: 8,
        marginRight: 15,
    },
    itemDetails: {
        flex: 1,
        justifyContent: "space-between",
    },
    productName: {
        maxWidth: 220,
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    productAuthor: {
        maxWidth: 220,
        fontSize: 14,
        color: "#777",
        marginBottom: 8,
    },
    amountContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    orderAmount: {
        fontSize: 14,
        color: "#555",
    },
    orderAmount$: {
        fontSize: 14,
        fontWeight: "700",
        color: "#2f95dc",
    },
    divider: {
        height: 1,
        backgroundColor: "#ddd",
    },
    footerText: {
        textAlign: "center",
        color: "#888",
        marginVertical: 10,
        fontSize: 14,
    },
});