import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f5f5f5",
    },
    form: {
        padding: 15,
    },
    field: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    label: {
        width: 100,
        fontSize: 16,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#C0C0C0',
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#FFFFFF',
    },
    dropdown: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#C0C0C0',
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
    },
    textArea: {
        height: 80,
    },
    imageButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    imageText: {
        marginLeft: 6,
        color: '#007bff',
    },
    imageContainer: {
        alignItems: 'center', 
        marginVertical: 10,
    },
    image: {
        borderRadius: 10,
        marginBottom: 50,
        width: 350,
        height: 350,
    }
});