import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        padding: 16,
    },
    productsContainer: {
        marginBottom: 8,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 16,
    },
    itemInfo: {
        flex: 1,
    },
    itemTitle: {
        maxWidth: 200,
        fontSize: 16,
        fontWeight: "600",
    },
    itemAuthor: {
        maxWidth: 200,
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: "600",
        color: "#2f95dc",
        marginTop: 4,
    },
    quantityLabel: {
        position: "absolute",
        top: 16,
        right: 16,
        backgroundColor: "#f0f0f0",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        fontSize: 14,
    },
    totalContainer: {
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    divider: {
        height: 0.5,
        backgroundColor: "#999",
        marginBottom: 8,
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: "600",
        textAlign: "right",
    },
    detailsContainer: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 16,
    },
    labelContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
        marginVertical: 8,
        padding: 12,
    },
    detailLabel: {
        flex: 1,
        fontSize: 16,
        width: 300,
    },
    detailValue: {
        width: 220,
        fontSize: 16,
        textAlign: "right",
        color: "#666",
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 16,
        gap: 16,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        gap: 8,
    },
    completeButton: {
        backgroundColor: '#4CAF50',
    },
    deleteButton: {
        backgroundColor: '#FF5252',
    },
    evaluateButton: {
        backgroundColor: '#EB6C42',
    },
    completedButton: {
        borderWidth: 3,
        borderColor: "#A7A7A7",
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonCompletedText: {
        color: '#A7A7A7',
        fontSize: 16,
        fontWeight: '600',
    },
    orderInfo: {
        marginBottom: 16,
    },
    footerText: {
        textAlign: "center",
        color: "#666",
        marginTop: 8,
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        width: '80%',
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 20,
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
    },
    star: {
        marginHorizontal: 4,
    },
    ratingText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#B5B5B5',
    },
    submitButton: {
        backgroundColor: '#EB6C42',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});