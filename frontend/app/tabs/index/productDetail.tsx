import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, BackHandler, ToastAndroid } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView} from "react-native-safe-area-context";
import { useHideTabBar } from "../../hook/HideTabBar";
import { useRoute, useNavigation, RouteProp, NavigationProp } from "@react-navigation/native";
import { HomeStackParamList, MainTabParamList } from "../../navigation/type";
import React, { useEffect, useState } from "react";
import { api } from "../../../api/api";
import { asyncGet, asyncPost } from "../../../utils/fetch";
import { Product } from "../../interface/Product";
import { getUserId } from "../../../utils/stroage";
export default function ProductDetailScreen() {
  const tabBarHidden = useHideTabBar(); // 確保此 Hook 在組件頂層調用
  const route = useRoute<RouteProp<HomeStackParamList, "Product">>();
  const navigation = useNavigation<NavigationProp<MainTabParamList>>();
  const [isFavorite, setIsFavorite] = useState(false);
  const [product, setProduct] = useState<Product>();
  const { productId, source } = route.params;
  const [userId, setUserId] = useState<string | null>(null); 
  useEffect(() => {
    const initializeUserId = async () => {
      const id = await getUserId();
      setUserId(id);
    };
    initializeUserId(); // 读取 userId
    fetchProduct(); // 获取商品详情
  
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => backHandler.remove();
  }, []);
  
  useEffect(() => {
    if (userId) {
      handleFindThisProductIsFavorite(); // 检查收藏状态
    }
  }, [userId, productId]); // 监听 userId 和 productId 的变化

  const fetchProduct = async () => {
    try {
      const response = await asyncGet(`${api.GetOneProduct}?product_id=${productId}`);
      if (response.code === 200) {
        setProduct(response.body);
      } else {
        console.log("Failed to fetch", response);
      }
    } catch (error) {
      console.log("API 調用失敗", error);
    }
  };
  const handleRemoveFromFavorite = async () => {
    try {
      const response = await asyncPost(api.DeleteFromFavorites, {
        "user_id": userId,
        "product_id": productId,
      });
  
      if (response.status === 200) {
        ToastAndroid.show("商品已取消收藏", ToastAndroid.SHORT);
        setIsFavorite(false); // 更新收藏狀態
      } else {
        console.log("移除收藏失敗", response);
      }
    } catch (error) {
      console.log("API 調用失敗", error);
    }
  };

  const handleAddToFavorite = async () => {
    if (isFavorite) {
      // 已收藏時調用移除收藏邏輯
      await handleRemoveFromFavorite();
    } else {
      // 未收藏時調用添加收藏邏輯
      try {
        const response = await asyncPost(api.AddToFavorite, {
          "user_id": userId,
          "product_id": productId,
        });
        if (response.status === 200) {
          ToastAndroid.show("商品已加入收藏", ToastAndroid.SHORT);
          setIsFavorite(true); // 更新收藏狀態
        } else {
          console.log("添加收藏失敗", response);
        }
      } catch (error) {
        console.log("API 調用失敗", error);
      }
    }
  };
  const handleFindThisProductIsFavorite = async () => {
    try {
      if (!userId) return;
      const response = await asyncPost(api.GetFavoriteList, {
        user_id: userId,
      });
      if (response.status === 200) {
        const favoriteList: string[] = response.data.body;
        const isFavorited = favoriteList.includes(productId);
        setIsFavorite(isFavorited); 
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleGoBack = () => {
    if (source === "Cart") {
      navigation.reset({
        routes: [{ name: "Cart" }],
      });
    } else if (source === "Favorite") {
      navigation.reset({
        routes: [{ name: "Profile", params: { screen: "Favorite" } }],
      });
    } else {
      navigation.goBack();
    }
  };

  const handleAddToCart = async() => {
    const response = await asyncPost(api.AddToCart, {
      "user_id": userId,
      "product_id": productId,
      "quantity": 1,
    })
    //console.log(userId, productId)
    if (response.status === 200){
      ToastAndroid.show("已新增至購物車", ToastAndroid.SHORT);
    } else if (response.status === 400){
      ToastAndroid.show("已經加入到購物車了", ToastAndroid.SHORT);
    } else {
      console.log(response)
      ToastAndroid.show("新增失敗", ToastAndroid.SHORT);
    }
  };
  const handleBuy = async () => {
    await asyncPost(api.AddToCart, {
      "user_id": userId,
      "product_id": productId
    })
    navigation.reset({ routes: [{ name: "Cart" }] });
  };

  if (!product) {
    return null; // 處理無效 ID
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{uri: product.photouri}} style={styles.productImage} />
        </View>

        {/* Product Details */}
        <View style={styles.detailsContainer}>
          <View>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>${product.price}</Text>
          </View>
          <TouchableOpacity onPress={handleAddToFavorite}>
            <Ionicons style={styles.bookmarks} name={isFavorite ? "bookmark-sharp" : "bookmark-outline"} color={isFavorite ? "#FFC300" : "black"} size={24} />
          </TouchableOpacity>
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
          <Text style={styles.detailText}>出版社：{product.publisher}</Text>
          <Text style={styles.detailText}>出版日期：{product.publishDate}</Text>
          <Text style={styles.detailText}>ISBN：{product.ISBN}</Text>
        </View>

        {/* Product Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>商品簡介</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>
        </View>
      </ScrollView>

      {/* Back Button */}
      <TouchableOpacity style={styles.floatingBackButton} onPress={() => handleGoBack()}>
        <Ionicons name="arrow-back-outline" size={28} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.floatingCartButton} onPress={() => navigation.reset({routes: [{ name: 'Cart' }]})}>
        <Ionicons name="cart-outline" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
          <Text style={styles.buttonText}>加入購物車</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyButton} onPress={handleBuy}>
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
    height: 400,
    resizeMode: 'cover',
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    paddingVertical: 10,
    marginBottom: 10,
  },
  bookmarks: {
    marginTop: 4,
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
  floatingCartButton: {
    position: "absolute",
    top: 50,
    right: 16,
    backgroundColor: "#555",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
