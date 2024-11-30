import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
export default function ShoppingCartScreen() {
  return (
    <View style={styles.container}>
      <View>

      </View>
      <View style={styles.cardContent}>
        <Text style={styles.price}>總金額 $</Text>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>結帳</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
  },
  cardContent: {
    backgroundColor: '#aaaaaa',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    marginHorizontal: 8,
    fontSize: 16,
  },
  checkoutButton: {
    marginTop: 12,
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  checkoutText: {
    color: 'white',
    fontSize: 16,
  },
});