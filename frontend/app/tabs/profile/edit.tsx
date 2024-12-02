import { View, Text, StyleSheet } from 'react-native';

export default function EditScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>修改商品</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});