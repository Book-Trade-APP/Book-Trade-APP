import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHideTabBar } from "../../hook/HideTabBar";
import { useRoute, RouteProp } from "@react-navigation/native";
import { fake_products } from "../../data/fakeProudctList";
import { HomeStackParamList } from "../../navigation/type";
import { useNavigation } from "@react-navigation/native";
export default function ProductDetailScreen() {
  useHideTabBar();
  const route = useRoute<RouteProp<HomeStackParamList, "Product">>();
  const navigation = useNavigation();
  const { productId } = route.params;
  const product = fake_products.find(p => p.id === productId);
  if (!product) {
    return; // 處理無效 ID
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={28} />
        </TouchableOpacity>
      </View>

      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image source={product.image} style={styles.productImage} />
      </View>

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </View>

      {/* Rating and Reviews */}
      <View style={styles.ratingContainer}>
        <Ionicons name="person-circle-outline" size={28} />
        <Text style={styles.reviewText}>132497</Text>
        <Ionicons name="star" size={20} color="#FFD700" />
        <Text style={styles.ratingText}>5.0</Text>
      </View>

      {/* Additional Product Info */}
      <View style={styles.productInfoContainer}>
        <Text style={styles.productInfoTitle}>商品資訊</Text>
        <Text style={styles.detailText}>作者：{product.author}</Text>
        <Text style={styles.detailText}>出版社：{product.publishes}</Text>
        <Text style={styles.detailText}>出版日期：{product.date}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  imageContainer: {
    alignItems: "center",
  },
  productImage: {
    width: 400,
    height: 400,
  },
  detailsContainer: {
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    paddingVertical: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  price: {
    color: "red",
    fontSize: 24,
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    height: "10%",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  reviewText: {
    marginLeft: 8,
    marginRight: 5,
    fontSize: 14,
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 5,
  },
  productInfoContainer: {
    backgroundColor: "#fff",
    padding: 16,
  },
  productInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
});