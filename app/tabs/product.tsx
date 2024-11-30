import { View, Text, StyleSheet } from 'react-native';

export default function ProductDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>商品詳細資料</Text>
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