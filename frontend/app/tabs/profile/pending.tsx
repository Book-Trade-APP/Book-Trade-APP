import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../../api/api";
import { asyncPost, asyncGet } from "../../../utils/fetch";
import { getUserId } from "../../../utils/stroage";
import { LoadingModal } from "../../components/LoadingModal";
import { Headers } from "../../components/NoneButtonHeader";
import { useHideTabBar } from "../../hook/HideTabBar";

export default function PendingScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProp<any>>();
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const userId = await getUserId();
        const response = await asyncPost(api.GetOrderByUserId, {
          user_id: userId,
          status: "待處理",
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
    fetchOrders();
  }, []);

  const renderItem = ({ item }: { item: any }) => {
    const { firstProduct } = item;
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
              source: "pending",
            }
          })
        }
      >
        <Image source={{ uri: firstProduct.photouri }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.productName}>{firstProduct.name}</Text>
          <Text style={styles.productAuthor}>{firstProduct.author}</Text>
          <Text style={styles.orderAmount}>訂單金額：</Text>
          <Text style={styles.orderAmount$}>${item.total_amount}</Text>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.completeButton}>
            <Text style={styles.completeButtonText}>完成訂單</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };
  
  useHideTabBar();

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Headers title="待交易" back={() => navigation.reset({ routes: [{ name: "Profile" }]})} />
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListFooterComponent={
            orders.length === 0 && !loading ? (
              <Text style={styles.footerText}>沒有待處理的訂單</Text>
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
    marginBottom: 4,
  },
  productAuthor: {
    fontSize: 14,
    color: "#777",
    marginBottom: 8,
  },
  orderAmount: {
    fontSize: 14,
    color: "#555",
    position: "absolute",
    bottom: 15,
  },
  orderAmount$: {
    fontSize: 14,
    color: "#555",
    position: "absolute",
    bottom: 14,
    left: 70,
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 8,
  },
  completeButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: "flex-end",
  },
  completeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  footerText: {
    textAlign: "center",
    color: "#888",
    marginVertical: 10,
    fontSize: 14,
  },
});