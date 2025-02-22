import { View, Text, Image, TouchableOpacity, ScrollView, BackHandler, ToastAndroid, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHideTabBar } from "@/app/hook/HideTabBar";
import { useRoute, useNavigation, RouteProp, NavigationProp } from "@react-navigation/native";
import { HomeStackParamList, MainTabParamList } from "@/app/navigation/type";
import { api } from "@/api/api";
import { asyncGet, asyncPost } from "@/utils/fetch";
import { Product } from "@/app/interface/Product";
import { getUserId } from "@/utils/stroage";
import { styles } from "../styles/productDetail";

export default function ProductDetailScreen() {
  const route = useRoute<RouteProp<HomeStackParamList, "Product">>();
  const MainTabNavigation = useNavigation<NavigationProp<MainTabParamList>>();
  const { productId, source } = route.params;
  const tabBarHide = useHideTabBar();
  const [isFavorite, setIsFavorite] = useState(false);
  const [product, setProduct] = useState<Product>();
  const [quantity, setQuantity] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [sellerId, setSellerId] = useState<string>();
  const [sellerUserName, setSellerUserName] = useState<string>("");
  const [sellerHeadShot, setSellerHeadShot] = useState<string>("");
  const [sellerEvaluate, setSellerEvaluate] = useState<string>("");
  const [sellerTransaction, setSellerTransaction] = useState<number>();
  useEffect(() => {
    const initializeUserId = async () => {
      const id = await getUserId();
      setUserId(id);
    };
    initializeUserId();
    fetchProduct();

    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (userId) {
      handleFindThisProductIsFavorite();
    }
  }, [userId, productId]);

  useEffect(() => {
    if (sellerId) {
      fetchSellerInfo();
    }
  }, [sellerId]);

  const fetchProduct = async () => {
    try {
      const response = await asyncGet(`${api.GetOneProduct}?product_id=${productId}`);
      if (response.code === 200) {
        const productData = response.body;
        setProduct(productData);
        setQuantity(productData.quantity || 1);
        setSellerId(productData.seller_id);
      } else {
        console.log("Failed to fetch product:", response);
      }
    } catch (error) {
      console.log("Failed to fetch product", error);
    }
  };

  const fetchSellerInfo = async () => {
    try {
      const response = await asyncGet(`${api.find}?_id=${sellerId}`);
      if (response.code === 200) {
        const sellerData = response.body;
        setSellerUserName(sellerData.username);
        setSellerHeadShot(sellerData.headshot);
        setSellerEvaluate(sellerData.evaluate);
        setSellerTransaction(sellerData.transaction_number);
      } else {
        console.log("Failed to fetch seller information:", response);
      }
    } catch (error) {
      console.error("Error fetching seller information:", error);
    }
  };

  const handleFindThisProductIsFavorite = async () => {
    try {
      if (!userId) {
        console.error("User ID is null or undefined.");
        return;
      }
      const response = await asyncPost(api.GetFavoriteList, { user_id: userId });
      if (response.status === 200) {
        const favoriteList: string[] = response.data.body;
        const isFavorited = favoriteList.includes(productId);
        setIsFavorite(isFavorited);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log("Error checking favorite status:", error);
    }
  };

  const handleAddToFavorite = async () => {
    if (isFavorite) {
      await handleRemoveFromFavorite();
    } else {
      try {
        const response = await asyncPost(api.AddToFavorite, { user_id: userId, product_id: productId });
        if (response.status === 200) {
          ToastAndroid.show("商品已加入收藏", ToastAndroid.SHORT);
          setIsFavorite(true);
        } else {
          console.log("添加收藏失败:", response);
        }
      } catch (error) {
        console.log("API 调用失败:", error);
      }
    }
  };

  const handleRemoveFromFavorite = async () => {
    try {
      const response = await asyncPost(api.DeleteFromFavorites, { user_id: userId, product_id: productId });
      if (response.status === 200) {
        ToastAndroid.show("商品已取消收藏", ToastAndroid.SHORT);
        setIsFavorite(false);
      } else {
        console.log("移除收藏失败:", response);
      }
    } catch (error) {
      console.log("API 调用失败:", error);
    }
  };

  const handleAddToCart = async () => {
    if (quantity <= 0) {
      Alert.alert("提示", "商品數量不足，無法添加至購物車");
      return;
    }
    if (sellerId === userId) {
      Alert.alert("提示", "您無法將自己的商品加入購物車");
      return;
    }
    try {
      const response = await asyncPost(api.AddToCart, { user_id: userId, product_id: productId, quantity: 1 });
      if (response.status === 200) {
        ToastAndroid.show("已新增至購物車", ToastAndroid.SHORT);
      } else if (response.status === 400) {
        ToastAndroid.show("已經加入到購物車了", ToastAndroid.SHORT);
      } else {
        console.log(response);
        ToastAndroid.show("新增失败", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log("Error adding to cart:", error);
    }
  };

  const handleBuy = async () => {
    if (quantity <= 0) {
      Alert.alert("提示", "商品數量不足，無法購買");
      return;
    }
    if (sellerId === userId) {
      Alert.alert("提示", "您無法購買自己的商品");
      return;
    }
    try {
      const response = await asyncPost(api.AddToCart, { user_id: userId, product_id: productId, quantity: 1 });
      if (response.status === 200 || response.status === 400) {
        MainTabNavigation.reset({ routes: [{ name: "Cart" }] });
      } else {
        console.error("Error buying product:", response);
      }
    } catch (error) {
      console.error("Error during purchase:", error);
    }
  };
  const handleChat = () => {
    if (!userId || !sellerId) return;
    if (userId === sellerId) {
      Alert.alert("提示", "您無法與自己對話");
      return;
    }
    MainTabNavigation.navigate('Chat', {
      screen: 'ChatDetail',
      params: {
        userId: userId,
        receiver_id: sellerId,
        receiver_username: sellerUserName,
        avatar: sellerHeadShot,
      }
    });
  };
  const handleGoBack = () => {
    if (source === "Cart") {
      MainTabNavigation.reset({ routes: [{ name: "Cart" }] });
    } else if (source === "Favorite") {
      MainTabNavigation.reset({ routes: [{ name: "Profile", params: { screen: "Favorite" } }] });
    } else {
      MainTabNavigation.goBack();
    }
  };

  if (!product) {
    return null;
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.photouri }} style={styles.productImage} />
        </View>
        <View style={styles.detailsContainer}>
          <View>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>{`$${product.price}`}</Text>
            <Text style={styles.quantity}>{`剩餘數量：${product.quantity}`}</Text>
          </View>
          <TouchableOpacity onPress={handleAddToFavorite}>
            <Ionicons
              style={styles.bookmarks}
              name={isFavorite ? "bookmark-sharp" : "bookmark-outline"}
              color={isFavorite ? "#FFC300" : "black"}
              size={24}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.ratingContainer}>
          {
          sellerHeadShot
          ?
          <Image style={styles.sellerImage} source={{ uri: sellerHeadShot }} />
          :
          <Ionicons name="person-circle-outline" size={48} />
          }
          <View style={styles.userInfoContainer}>
            <Text style={styles.reviewText}>{sellerUserName}</Text>
            <View style={{flexDirection: "row"}}>
              <Ionicons style={{marginTop: 2}} name="star" size={20} color="#FFD700" />
              {sellerTransaction === 0 
              ?
              <Text style={styles.ratingText}>暫無評價</Text>
              :
              <Text style={styles.ratingText}>{`${Number(sellerEvaluate).toFixed(1)} (${sellerTransaction})`}</Text>
              }
            </View>
          </View>
          <TouchableOpacity onPress={handleChat}>
            <Ionicons style={styles.chatIcon}name="chatbubble-ellipses-outline" size={28} />
          </TouchableOpacity>
        </View>
        <View style={styles.productInfoContainer}>
          <Text style={styles.productInfoTitle}>商品資訊</Text>
          <View style={styles.textContainer}>
            <Text style={styles.detailText}>作者：</Text>
            <Text style={[styles.detailText, styles.textWithWidth]}>{product.author}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.detailText}>出版社：</Text>
            <Text style={[styles.detailText, styles.textWithWidth]}>{product.publisher}</Text>
          </View>
          <Text style={styles.detailText}>{`出版日期：${product.publishDate}`}</Text>
          <Text style={styles.detailText}>{`ISBN：${product.ISBN}`}</Text>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>商品簡介</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.floatingBackButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back-outline" size={28} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.floatingCartButton} onPress={() => MainTabNavigation.reset({ routes: [{ name: "Cart" }] })}>
        <Ionicons name="cart-outline" size={28} color="#fff" />
      </TouchableOpacity>
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
