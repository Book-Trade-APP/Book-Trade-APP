import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    imageContainer: {
        width: '100%',
        alignItems: "center",
    },
    productImage: {
        flex: 1,
        width: '100%',
        height: 400,
        resizeMode: 'cover',
    },
    detailsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        backgroundColor: "#fff",
        paddingVertical: 10,
        marginBottom: 10,
    },
    bookmarks: {
        marginTop: 4,
    },
    chatIcon: {
        marginRight: 6,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        maxWidth: 350,
    },
    price: {
        color: "red",
        fontSize: 24,
        marginRight: 8,
        marginBottom: 10,
    },
    quantity: {
        color: "#888"
    },
    textContainer: {
        flexDirection: "row",
    },
    detailText: {
        fontSize: 14,
        marginBottom: 5,
    },
    textWithWidth: {
        maxWidth: 340,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#fff",
        marginBottom: 10,
    },
    sellerImage: {
        width: 48, 
        height: 48, 
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    userInfoContainer: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    userInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: 8,
    },
    reviewText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    ratingText: {
        fontSize: 15,
        marginLeft: 4,
        color: '#888',
        fontWeight: '500',
    },
    productInfoContainer: {
        backgroundColor: "#fff",
        padding: 16,
    },
    productInfoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    descriptionContainer: {
        backgroundColor: "#fff",
        padding: 16,
        marginTop: 10,
    },
    descriptionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 14,
        lineHeight: 20,
    },
    bottomNavContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#eee",
        padding: 8,
    },
    cartButton: {
        flex: 1,
        backgroundColor: "#ffa500",
        alignItems: "center",
        padding: 10,
        borderRadius: 5,
        marginRight: 5,
    },
    buyButton: {
        flex: 1,
        backgroundColor: "#ff4500",
        alignItems: "center",
        padding: 10,
        borderRadius: 5,
        marginLeft: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    floatingBackButton: {
        position: "absolute",
        top: 50,
        left: 16,
        backgroundColor: "#555",
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    floatingCartButton: {
        position: "absolute",
        top: 50,
        right: 16,
        backgroundColor: "#555",
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
});