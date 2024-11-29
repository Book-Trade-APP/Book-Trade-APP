import { View, Text, StyleSheet } from 'react-native';

export default function ShoppingCartScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>購物車</Text>
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