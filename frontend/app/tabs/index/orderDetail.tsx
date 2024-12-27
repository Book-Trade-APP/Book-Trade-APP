import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHideTabBar } from "../../hook/HideTabBar";
import { Headers } from "../../components/NoneButtonHeader";
import { NavigationProp, RouteProp, useNavigation } from "@react-navigation/native";
import { HomeStackParamList } from "../../navigation/type";
import { asyncGet } from "../../../utils/fetch";
import { api } from "../../../api/api";
import { Product } from "../../interface/Product";
import { LoadingModal } from "../../components/LoadingModal";
import formatDate from "../../../utils/date";
import { OrderDetail } from "../../interface/OrderDetail";

export default function OrderDetailScreen({ route }: { route: RouteProp<HomeStackParamList, "Order"> }) {
  const navigation = useNavigation<NavigationProp<any>>();
  useHideTabBar();

  const [orderDetail, setOrderDetail] = useState<OrderDetail>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { orderId, products: productIds, quantity, source } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [orderResponse, productsResponse] = await Promise.all([
          asyncGet(`${api.GetOrderById}?id=${orderId}`),
          Promise.all(productIds.map(id => 
            asyncGet(`${api.GetOneProduct}?product_id=${id}`)
          ))
        ]);

        if (orderResponse.code === 200) {
          setOrderDetail(orderResponse.body);
        }

        const validProducts = productsResponse
          .filter(response => response.code === 200)
          .map(response => response.body);
        setProducts(validProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [orderId, productIds]);

  const renderProducts = () => (
    products.map((item, index) => (
      <View key={item._id} style={styles.card}>
        <View style={styles.row}>
          <Image style={styles.itemImage} source={{ uri: item.photouri }} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemAuthor}>{item.author}</Text>
            <Text style={styles.itemPrice}>${item.price}</Text>
          </View>
        </View>
        <Text style={styles.quantityLabel}>x{quantity[index]}</Text>
      </View>
    ))
  );

  const handleGoBack = () => {
    switch(source) {
      case "pending":
        navigation.navigate('Profile', { screen: 'Pending' });
        break;
      case "evaluate":
        navigation.navigate('Profile', { screen: 'Evaluate' });
        break;
      case "completed":
        navigation.navigate('Profile', { screen: 'Completed' });
        break;
    }
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Headers title="訂單詳情" back={handleGoBack} />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.productsContainer}>
            {renderProducts()}
          </View>
          <View style={styles.totalContainer}>
            <View style={styles.divider} />
            <Text style={styles.totalAmount}>總金額：${orderDetail?.total_amount}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>詳細資料</Text>
            <View style={styles.labelContainer}>
              <Text style={styles.detailLabel}>備註</Text>
              <Text style={styles.detailValue}>{orderDetail?.note || "無任何備註"}</Text>
            </View>
            <View style={styles.labelContainer}>
              <Text style={styles.detailLabel}>約定地點</Text>
              <Text style={styles.detailValue}>{orderDetail?.location}</Text>
            </View>
            <View style={styles.labelContainer}>
              <Text style={styles.detailLabel}>約定時間</Text>
              <Text style={styles.detailValue}>{orderDetail?.agreed_time}</Text>
            </View>
          </View>
          <View style={styles.orderInfo}>
            <Text style={styles.footerText}>訂單編號: {orderId}</Text>
            <Text style={styles.footerText}>成立時間: {orderDetail?.created_at ? formatDate(orderDetail.created_at) : ''}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
      <LoadingModal isLoading={isLoading} message="正在載入訂單..." />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  productsContainer: {
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  itemAuthor: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2f95dc",
    marginTop: 4,
  },
  quantityLabel: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 14,
  },
  totalContainer: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  divider: {
    height: 0.5,
    backgroundColor: "#999",
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "right",
  },
  detailsContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginVertical: 8,
    padding: 12,
  },
  detailLabel: {
    flex: 1,
    fontSize: 16,
  },
  detailValue: {
    width: 150,
    fontSize: 16,
    textAlign: "right",
    color: "#666",
  },
  orderInfo: {
    marginBottom: 16,
  },
  footerText: {
    textAlign: "center",
    color: "#666",
    marginTop: 8,
    fontSize: 14,
  },
});