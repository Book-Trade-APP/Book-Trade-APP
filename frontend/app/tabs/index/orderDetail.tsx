import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHideTabBar } from "../../hook/HideTabBar";
import { Headers } from "../../components/NoneButtonHeader";
import { NavigationProp, RouteProp, useNavigation } from "@react-navigation/native";
import { HomeStackParamList } from "../../navigation/type";
import { useEffect, useState } from "react";
import { asyncGet } from "../../../utils/fetch";
import { api } from "../../../api/api";
import { Product } from "../../interface/Product";
import React from "react";
import formatDate from "../../../utils/date";

export default function OrderDetailScreen({ route }: { route: RouteProp<HomeStackParamList, "Order"> }) {
  const navigation = useNavigation<NavigationProp<any>>();
  useHideTabBar();

  const [dateCreated, setDateCreated] = useState<string>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { orderId, products: productIds, quantity } = route.params;

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const fetchedProducts: Product[] = [];
      for (const id of productIds) {
        const response = await asyncGet(`${api.GetOneProduct}?product_id=${id}`);
        if (response.code === 200) {
          fetchedProducts.push(response.body);
        } else {
          console.error(`Failed to fetch product with ID ${id}`, response);
        }
      }
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchOrdersCreateDate = async () => {
    try {
      const response = await asyncGet(`${api.GetOrderById}?id=${orderId}`)
      setDateCreated(response.body.created_at);
    } catch (error) {
      console.log("failed to fetch orders");
    }
  }
  useEffect(() => {
    fetchProducts();
    fetchOrdersCreateDate();
  }, [route.params]);
  const renderItem = ({ item, index }: { item: Product; index: number }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image style={styles.itemImage} source={{ uri: item.photouri }} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={styles.itemAuthor}>{item.author}</Text>
          <Text style={styles.itemPrice}>{`$${item.price}`}</Text>
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <View style={styles.labelContainer}>
            <Text style={styles.detailLabel}>備註</Text>
            <Text style={styles.detailInput}>這是後面會傳進來的備註</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.labelContainer}>
            <Text style={styles.detailLabel}>約定地點</Text>
            <Text style={styles.detailInput}>說好的地點</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>約定時間</Text>
          <Text style={styles.detailInput}>{"2024/1/3"}</Text>
        </View>
      </View>
      <Text style={styles.quantityLabel}>{`x${quantity[index]}`}</Text>
    </View>
  );
  const handleGoBack = () => {
    switch(route.params.source){
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
  }
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>正在加載...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Headers title={`訂單詳情`} back={handleGoBack} />
      <FlatList
        data={products}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
        ListFooterComponent={
        <>
          <Text style={styles.footerText}>{`訂單編號:${orderId}`}</Text>
          <Text style={styles.footerText}>{`成立時間:${formatDate(dateCreated as string)}`}</Text>
        </>
      }
        ListEmptyComponent={<Text style={styles.emptyText}>無法載入產品資訊</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ddd",
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 16,
    padding: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  itemImage: {
    width: 75,
    height: 75,
    marginHorizontal: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  itemAuthor: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  detailInput: {
    flex: 1,
    padding: 5,
    textAlign: "right",
    height: 30,
    marginLeft: 10,
  },
  labelContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: "#222",
    flex: 1,
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
    color: "#999",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#555",
  },
  quantityLabel: {
    position: "absolute",
    top: 10,
    right: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  footerText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 10,
    fontSize: 14,
  },
});
