/*
    Form: Text + TextInput
*/

import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";

type FormFieldProps = {
    label: string;
    placeholder?: string;
} & TextInputProps;

export const FormField: React.FC<FormFieldProps> = ({ label, placeholder, ...props }) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={[styles.input, props.style]} placeholder={placeholder} {...props} />
    </View>
  );

const styles = StyleSheet.create({
    field: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    label: {
        textAlign: "right",
        width: 99,
        fontSize: 16,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#C0C0C0',
        borderRadius: 5,
        padding: 10,
        height: 50,
        backgroundColor: '#FFFFFF',
    },
});