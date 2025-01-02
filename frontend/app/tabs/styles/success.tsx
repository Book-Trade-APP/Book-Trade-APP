import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        alignItems: "center",
        paddingHorizontal: 20,
    },
    successIcon: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    successText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#2f95dc",
        marginBottom: 10,
    },
    subText: {
        fontSize: 16,
        color: "#555",
        textAlign: "center",
        marginBottom: 30,
    },
    button: {
        backgroundColor: "#2f95dc",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginVertical: 10,
        width: "80%",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    secondaryButton: {
        backgroundColor: "#fff",
        borderColor: "#2f95dc",
        borderWidth: 1,
    },
    secondaryButtonText: {
        color: "#2f95dc",
    },
});