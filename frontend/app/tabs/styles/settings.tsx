import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
    },
    saveText: {
        color: "#007bff",
        fontSize: 16,
    },
    profileSection: {
        alignItems: "center",
        backgroundColor: "#fff",
        paddingVertical: 20,
        marginTop: 10,
    },
    avatarButton: {
        alignItems: "center",
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 10,
        backgroundColor: "#f0f0f0",
    },
    editText: {
        marginTop: 8,
        fontSize: 14,
        color: "#007bff",
    },
    infoList: {
        marginTop: 16,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    infoLabel: {
        fontSize: 16,
    },
    infoAction: {
        color: "#007bff",
        fontSize: 14,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 320,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 12,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    modalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    errorText: {
        width: 200,
        textAlign: 'center',
        color: 'red',
        marginBottom: 12,
    },
    pickerContainer: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 20,
        overflow: 'hidden',
    },
    picker: {
        width: '100%',
        height: 55,
    },
    modalTextInput: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 20,
    },
    modalButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: '100%',
        gap: 10,
    },
    modalButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 10,
        flex: 1,
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});