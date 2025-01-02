import React, { useState, useCallback, useMemo } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { useNavigation, NavigationProp, useRoute, RouteProp, useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "@/api/api";
import { asyncPost, asyncGet } from "@/utils/fetch";
import { getUserId } from "@/utils/stroage";
import { Headers } from "@/app/components/NoneButtonHeader";
import { useHideTabBar } from "@/app/hook/HideTabBar";
import { ProfileStackParamList } from "@/app/navigation/type";
import { styles } from "../styles/orderStatus";

const STATUS_TITLES: Record<"待確認" | "待處理" | "待評價" | "已完成", string> = {
  "待確認": "待確認",
  "待處理": "待交易",
  "待評價": "待評價",
  "已完成": "已完成"
};

const ROLE_TABS = {
  BUYER: "buyer",
  SELLER: "seller"
} as const;

type RoleTab = typeof ROLE_TABS[keyof typeof ROLE_TABS];

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
  const [activeRole, setActiveRole] = useState<RoleTab>(ROLE_TABS.BUYER);
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
  
      // 建立請求體，根據角色使用不同的 id field
      const requestBody = {
        [activeRole === ROLE_TABS.BUYER ? 'buyer_id' : 'seller_id']: userId,
        [activeRole === ROLE_TABS.BUYER ? 'buyer_status' : 'seller_status']: status,
      };
  
      const response = await asyncPost(api.GetOrderByUserId, requestBody);
  
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
  }, [status, fetchProduct, activeRole]);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
      
      return () => {
        if (productCache.size > 100) {
          productCache.clear();
        }
      };
    }, [fetchOrders])
  );

  const handleOrderPress = useCallback((orderId: string, products: string[], quantity: number[], source: string) => {
    navigation.navigate("Home", {
      screen: "Order",
      params: { 
        orderId, 
        products, 
        quantity, 
        source,
        userRole: activeRole
      }
    });
  }, [navigation, activeRole]);

  const memoizedRenderItem = useCallback(({ item }: { item: any }) => {
    const source = status === "待確認" ? "confirm" : status === "待處理" ? "pending" : status === "待評價" ? "evaluate" : "completed";
    return (
      <OrderItem
        item={item}
        onPress={handleOrderPress}
        source={source}
      />
    );
  }, [status, handleOrderPress]);

  const renderRoleTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tab, activeRole === ROLE_TABS.BUYER && styles.activeTab]}
        onPress={() => setActiveRole(ROLE_TABS.BUYER)}
      >
        <Text style={[styles.tabText, activeRole === ROLE_TABS.BUYER && styles.activeTabText]}>
          我是買家
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeRole === ROLE_TABS.SELLER && styles.activeTab]}
        onPress={() => setActiveRole(ROLE_TABS.SELLER)}
      >
        <Text style={[styles.tabText, activeRole === ROLE_TABS.SELLER && styles.activeTabText]}>
          我是賣家
        </Text>
      </TouchableOpacity>
    </View>
  );

  const ListEmptyComponent = useMemo(() => (
    !loading && !error ? (
      <Text style={styles.footerText}>
        {`沒有${STATUS_TITLES[status]}的${activeRole === ROLE_TABS.BUYER ? '購買' : '銷售'}訂單`}
      </Text>
    ) : error ? (
      <Text>{error}</Text>
    ) : null
  ), [loading, error, status, activeRole]);

  useHideTabBar();

  return (
    <SafeAreaView style={styles.container}>
      <Headers 
        title={STATUS_TITLES[status]} 
        back={() => navigation.reset({ routes: [{ name: "Profile" }]})} 
      />
      {renderRoleTabs()}
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={memoizedRenderItem}
        ListEmptyComponent={ListEmptyComponent}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={5}
        onRefresh={fetchOrders}
        refreshing={loading}
      />
    </SafeAreaView>
  );
}