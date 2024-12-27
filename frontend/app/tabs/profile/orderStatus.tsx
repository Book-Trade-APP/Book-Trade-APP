import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation, NavigationProp, useRoute, RouteProp, useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../../api/api";
import { asyncPost, asyncGet } from "../../../utils/fetch";
import { getUserId } from "../../../utils/stroage";
import { LoadingModal } from "../../components/LoadingModal";
import { Headers } from "../../components/NoneButtonHeader";
import { useHideTabBar } from "../../hook/HideTabBar";
import { ProfileStackParamList } from "../../navigation/type";

const statusTitles: Record<"待處理" | "待評價" | "已完成", string> = {
  "待處理": "待交易",
  "待評價": "待評價",
  "已完成": "已完成"
};

export default function OrderStatusScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<ProfileStackParamList, 'OrderStatus'>>();
  const status = route.params?.status;
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const userId = await getUserId();
      const response = await asyncPost(api.GetOrderByUserId, {
        user_id: userId,
        status,
      });

      if (response.data.body) {
        const ordersData = response.data.body;
        const detailedOrders = await Promise.all(
          ordersData.map(async (order: any) => {
            const firstProductId = order.product_ids[0];
            let firstProduct = null;

            if (firstProductId) {
              try {
                const res = await asyncGet(`${api.GetOneProduct}?product_id=${firstProductId}`);
                firstProduct = res.body || null;
              } catch (error) {
                console.error(`Failed to fetch product ${firstProductId}:`, error);
              }
            }

            return {
              ...order,
              firstProduct,
            };
          })
        );

        setOrders(detailedOrders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchOrders();
    }, [status])
  );

  const renderItem = ({ item }: { item: any }) => {
    const { firstProduct } = item;
    const source = status === "待處理" ? "pending" : status === "待評價" ? "evaluate" : "completed";
    
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() =>
          navigation.navigate("Home", {
            screen: "Order",
            params: {
              orderId: item._id,
              products: item.product_ids,
              quantity: item.quantities,
              source,
            }
          })
        }
      >
        <Image source={{ uri: firstProduct.photouri }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.productName}>{firstProduct.name}</Text>
          <Text style={styles.productAuthor}>{firstProduct.author}</Text>
          <View style={styles.divider} />
          <View style={styles.amountContainer}>
            <Text style={styles.orderAmount}>訂單金額：</Text>
            <Text style={styles.orderAmount$}>${item.total_amount}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  useHideTabBar();

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Headers title={statusTitles[status]} back={() => navigation.reset({ routes: [{ name: "Profile" }]})} />
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListFooterComponent={
            orders.length === 0 && !loading ? (
              <Text style={styles.footerText}>{`沒有${statusTitles[status]}的訂單`}</Text>
            ) : null
          }
        />
      </SafeAreaView>
      <LoadingModal isLoading={loading} message="正在載入訂單..." />
    </>
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