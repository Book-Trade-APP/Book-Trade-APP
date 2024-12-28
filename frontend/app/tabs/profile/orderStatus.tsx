import React, { useState, useCallback, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation, NavigationProp, useRoute, RouteProp, useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../../api/api";
import { asyncPost, asyncGet } from "../../../utils/fetch";
import { getUserId } from "../../../utils/stroage";
import { Headers } from "../../components/NoneButtonHeader";
import { useHideTabBar } from "../../hook/HideTabBar";
import { ProfileStackParamList } from "../../navigation/type";

const STATUS_TITLES: Record<"待處理" | "待評價" | "已完成", string> = {
  "待處理": "待交易",
  "待評價": "待評價",
  "已完成": "已完成"
};
const productCache = new Map();
const OrderItem = React.memo(({ item, onPress, source }: any) => {
  const { firstProduct } = item;
  
  if (!firstProduct) return null;

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => onPress(item._id, item.product_ids, item.quantities, source)}
    >
      <Image 
        source={{ uri: firstProduct.photouri }} 
        style={styles.itemImage}
      />
      <View style={styles.itemDetails}>
        <Text style={styles.productName} numberOfLines={2}>{firstProduct.name}</Text>
        <Text style={styles.productAuthor} numberOfLines={1}>{firstProduct.author}</Text>
        <View style={styles.divider} />
        <View style={styles.amountContainer}>
          <Text style={styles.orderAmount}>訂單金額：</Text>
          <Text style={styles.orderAmount$}>${item.total_amount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});
export default function OrderStatusScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<ProfileStackParamList, 'OrderStatus'>>();
  const status = route.params?.status;

  const fetchProduct = useCallback(async (productId: string) => {
    if (productCache.has(productId)) {
      return productCache.get(productId);
    }

    try {
      const res = await asyncGet(`${api.GetOneProduct}?product_id=${productId}`);
      if (res.body) {
        productCache.set(productId, res.body);
        return res.body;
      }
    } catch (error) {
      console.error(`Failed to fetch product ${productId}:`, error);
      return null;
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userId = await getUserId();
      if (!userId) throw new Error("User ID not found");

      const response = await asyncPost(api.GetOrderByUserId, {
        user_id: userId,
        status,
      });

      if (!response.data?.body || JSON.stringify(response.data.body) === "{}") {
        setOrders([]);
        return;
      }

      const ordersData = response.data.body;
      const detailedOrders = await Promise.all(
        ordersData.map(async (order: any) => ({
          ...order,
          firstProduct: await fetchProduct(order.product_ids[0])
        }))
      );

      setOrders(detailedOrders.filter(order => order.firstProduct));
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [status, fetchProduct]);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
      
      // 清理函數
      return () => {
        // 如果緩存太大，可以在這裡清理
        if (productCache.size > 100) {
          productCache.clear();
        }
      };
    }, [fetchOrders])
  );

  const handleOrderPress = useCallback((orderId: string, products: string[], quantity: number[], source: string) => {
    navigation.navigate("Home", {
      screen: "Order",
      params: { orderId, products, quantity, source }
    });
  }, [navigation]);

  const memoizedRenderItem = useCallback(({ item }: { item: any }) => {
    const source = status === "待處理" ? "pending" : status === "待評價" ? "evaluate" : "completed";
    return (
      <OrderItem
        item={item}
        onPress={handleOrderPress}
        source={source}
      />
    );
  }, [status, handleOrderPress]);

  const ListEmptyComponent = useMemo(() => (
    !loading && !error ? (
      <Text style={styles.footerText}>{`沒有${STATUS_TITLES[status]}的訂單`}</Text>
    ) : error ? (
      <Text>{error}</Text>
    ) : null
  ), [loading, error, status]);

  useHideTabBar();

  return (
    <SafeAreaView style={styles.container}>
      <Headers 
        title={STATUS_TITLES[status]} 
        back={() => navigation.reset({ routes: [{ name: "Profile" }]})} 
      />
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={memoizedRenderItem}
        ListEmptyComponent={ListEmptyComponent}
        // 添加性能優化
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={5}
        // 添加下拉刷新
        onRefresh={fetchOrders}
        refreshing={loading}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f9f9f9",
    },
    itemContainer: {
      flexDirection: "row",
      backgroundColor: "#ffffff",
      borderRadius: 10,
      padding: 15,
      marginHorizontal: 16,
      marginVertical: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    itemImage: {
      width: 99,
      height: 99,
      borderRadius: 8,
      marginRight: 15,
    },
    itemDetails: {
      flex: 1,
      justifyContent: "space-between",
    },
    productName: {
      fontSize: 16,
      fontWeight: "600",
      color: "#333",
    },
    productAuthor: {
      fontSize: 14,
      color: "#777",
      marginBottom: 8,
    },
    amountContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    orderAmount: {
      fontSize: 14,
      color: "#555",
    },
    orderAmount$: {
      fontSize: 14,
      fontWeight: "700",
      color: "#2f95dc",
    },
    divider: {
      height: 1,
      backgroundColor: "#ddd",
    },
    footerText: {
      textAlign: "center",
      color: "#888",
      marginVertical: 10,
      fontSize: 14,
    },
  });