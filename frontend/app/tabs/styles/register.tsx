import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgb(255, 255, 255)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        borderRadius: 24,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        width: '85%',
        elevation: 5,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        marginBottom: 40,
    },
    logoText: {
        fontSize: 24,
        fontWeight: "bold",
    },
    input: {
        width: 200,
        height: 50,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 10,
    },
    errorText: {
        width: 200,
        textAlign: 'center',
        color: 'red',
        marginBottom: 12,
    },
    registerButton: {
        backgroundColor: "#2f95dc",
        width: 200,
        height: 50,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
    },
    registerButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    button: {
        justifyContent: 'center',
    },
    login: {
        color: '#2f95dc',
        marginTop: 10,
    },
    loginContainer: {
        alignItems: 'center',
    }
});