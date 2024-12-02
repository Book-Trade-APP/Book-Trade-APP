import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, BackHandler } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useHideTabBar } from "../../hook/HideTabBar";
import { useRoute, useNavigation, RouteProp, NavigationProp } from "@react-navigation/native";
import { fake_products } from "../../data/fakeProudctList";
import { HomeStackParamList, MainTabParamList } from "../../navigation/type";
import React, { useEffect } from "react";
export default function ProductDetailScreen() {
  useHideTabBar();
  const route = useRoute<RouteProp<HomeStackParamList, "Product">>();
  const navigation = useNavigation<NavigationProp<MainTabParamList>>();
  const { productId, source } = route.params;
  const insets = useSafeAreaInsets();
  const product = fake_products.find((p) => p.id === productId);
  const handleGoBack = () => {
  if (source === 'Cart') {
      // 如果是從購物車來的，返回到購物車
      navigation.reset({
        index: 0,
        routes: [{ name: 'Cart' }]
      });
    } else {
      // 否則使用默認的返回邏輯
      navigation.goBack();
    }
  };
  if (!product) {
    return null; // 處理無效 ID
  }
  useEffect(() => {
    // 禁用返回按钮
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress', 
      () => true // 返回 true 表示阻止默認的返回行為
    );

    // 清理監聽器
    return () => backHandler.remove();
  }, []);
  return (
    <SafeAreaView style={[styles.container, {paddingBottom: insets.bottom}]}>
      <ScrollView>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={product.image} style={styles.productImage} />
        </View>

        {/* Product Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>${product.price}</Text>
          <Text style={styles.quantity}>剩餘數量：{product.quantity}件</Text>
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
          <Text style={styles.detailText}>ISBN：{product.ISBN}</Text>
        </View>

        {/* Product Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>商品簡介</Text>
          <Text style={styles.descriptionText}>{product.details}</Text>
        </View>
      </ScrollView>

      {/* Back Button */}
      <TouchableOpacity style={styles.floatingBackButton} onPress={() => handleGoBack()}>
        <Ionicons name="arrow-back-outline" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <TouchableOpacity style={styles.cartButton}>
          <Text style={styles.buttonText}>加入購物車</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buttonText}>直接購買</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  imageContainer: {
    width: '100%',
    alignItems: "center",
  },
  productImage: {
    flex: 1,
    width: '100%',
    height: 300,
    resizeMode: 'cover',
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
    marginBottom: 10,
  },
  quantity: {
    marginRight: 5,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 5,
    height: 25,
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
    marginBottom: 10,
  },
  descriptionContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginTop: 10,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomNavContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#eee",
    padding: 8,
  },
  cartButton: {
    flex: 1,
    backgroundColor: "#ffa500",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  buyButton: {
    flex: 1,
    backgroundColor: "#ff4500",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  floatingBackButton: {
    position: "absolute",
    top: 50,
    left: 16,
    backgroundColor: "#555",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
