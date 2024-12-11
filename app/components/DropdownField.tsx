/*
    Dropdown: Text + Picker
*/

import { View, Text, StyleSheet } from "react-native";
import { Picker } from '@react-native-picker/picker';

type DropdownFieldProps = {
    label: string;
    selectedValue: string;
    onValueChange: (value: string) => void;
    items: string[];
};

export const DropdownField: React.FC<DropdownFieldProps> = ({
    label,
    selectedValue,
    onValueChange,
    items,
  }) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Picker
        selectedValue={selectedValue}
        style={styles.dropdown}
        onValueChange={(value) => onValueChange(value)}
      >
        <Picker.Item label="請選擇" value="" enabled={false} />
        {items.map((item, index) => (
          <Picker.Item key={index} label={item} value={item} />
        ))}
      </Picker>
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
      width: 100,
      fontSize: 16,
    },
    dropdown: {
      flex: 1,
      height: 55,
      borderWidth: 1,
      backgroundColor: '#FFFFFF',
    },
});