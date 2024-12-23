import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHideTabBar } from "../../hook/HideTabBar";
import { Headers } from "../../components/NoneButtonHeader";
import { NavigationProp, RouteProp, useNavigation } from "@react-navigation/native";
import { CartStackParamList } from "../../navigation/type";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "../../interface/Product";
import { useEffect, useState } from "react";
import { asyncGet, asyncPost } from "../../../utils/fetch";
import { api } from "../../../api/api";
import { getUserId } from "../../../utils/stroage";

type CheckoutScreenRouteProp = RouteProp<CartStackParamList, "Checkout">;

export default function CheckoutScreen({ route }: { route: CheckoutScreenRouteProp }) {
  const CartNavigation = useNavigation<NavigationProp<CartStackParamList>>();
  useHideTabBar();

  const [showDatePickerFor, setShowDatePickerFor] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<{ [key: string]: string }>({}); 
  const [selectProducts, setSelectProducts] = useState<Product[]>([]);
  const [selectedPayment, setSelectedPayment] = useState("Cash");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { productId: selectedProductIds, quantity } = route.params;
  const totalAmount = selectProducts.reduce((total, product, index) => total + product.price * quantity[index], 0);
  const fetchSelectedProducts = async () => {
    setIsLoading(true);
    try {
      const products: Product[] = [];
      for (const id of selectedProductIds) {
        const response = await asyncGet(`${api.GetOneProduct}?product_id=${id}`);

        if (response.code === 200) {
          products.push(response.body);
        } else {
          console.error(`Failed to fetch product with ID ${id}`, response);
        }
      }
      setSelectProducts(products);
    } catch (error) {
      console.error("Error fetching selected products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSelectedProducts();
  }, []);

  const handleDateChange = (event: any, selectedDate?: Date, productId?: string) => {
    setShowDatePickerFor(null);
    if (selectedDate && productId) {
      const formattedDate = `${String(selectedDate.getDate()).padStart(2, "0")}/${String(
        selectedDate.getMonth() + 1
      ).padStart(2, "0")}/${selectedDate.getFullYear()}`;
      setSelectedDates((prev) => ({
        ...prev,
        [productId]: formattedDate,
      }));
    }
  };
  const deleteCartItem = async () => {
    try {
      const userId = await getUserId();
      // 使用 Promise.all 同步處理所有商品的請求
      const responses = await Promise.all(
        selectedProductIds.map((productId) =>
          asyncPost(api.UpdateCart, {
            user_id: userId,
            product_id: productId,
            quantity: 0,
          })
        )
      );
  
      // 檢查所有請求的結果
      const failedResponses = responses.filter((response) => response.status !== 200);
      if (failedResponses.length > 0) {
        console.error("以下商品的數量更新失敗：", failedResponses);
      }
    } catch (error) {
      console.error("更新購物車數量時發生錯誤：", error);
    }
  };
  const getProductsInformation = async (product_id: string) => {
    try {
      const response = await asyncGet(`${api.GetOneProduct}?product_id=${product_id}`);
      if (response.code === 200) {
        return response.body;
      } else {
        console.error(`Failed to fetch product information for product ID ${product_id}`, response);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching product information for product ID ${product_id}`, error);
      return null;
    }
  };
  const updateProductsQuantity = async (product_id: string, minus_quantity: number) => {
    try {
      const product = await getProductsInformation(product_id);
      if (product) {
        const updatedQuantity = product.quantity - minus_quantity;
        if (updatedQuantity < 0) {
          console.warn(`Product ID ${product_id} quantity cannot be negative. Skipping update.`);
          return;
        }
        const response = await asyncPost(api.UpdateProduct, {
          ISBN: product.ISBN,
          _id: product._id,
          author: product.author,
          category: product.category,
          condiction: product.condiction,
          description: product.description,
          language: product.language,
          name: product.name,
          photouri: product.photouri,
          price: product.price,
          publishDate: product.publishDate,
          publisher: product.publisher,
          quantity: updatedQuantity,
        });
        if (response.status !== 200) {
          console.error(`Failed to update product quantity for product ID ${product_id}`, response);
        }
      }
    } catch (error) {
      console.error(`Error updating product quantity for product ID ${product_id}`, error);
    }
  };
  const handleSendCheckout = async () => {
    try {
      const response = await asyncPost(api.CreateOrder, {
        user_id: await getUserId(),
        product_ids: selectedProductIds,
        quantities: quantity,
        payment_method: selectedPayment,
      });
  
      if (response.status === 200) {
        // 更新每個商品的數量
        await Promise.all(
          selectedProductIds.map((productId, index) =>
            updateProductsQuantity(productId, quantity[index])
          )
        );
  
        // 刪除購物車中的商品
        await deleteCartItem();
  
        // 導向成功頁面
        CartNavigation.navigate("Success");
      } else {
        console.log("Failed to create orders: ", response);
      }
    } catch (error) {
      console.log("Failed to process checkout: ", error);
    }
  };

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
            <TextInput style={styles.detailInput} placeholder="新增備註" />
          </View>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.labelContainer}>
            <Text style={styles.detailLabel}>約定地點</Text>
            <TextInput style={styles.detailInput} placeholder="請輸入約定地點" />
          </View>
        </View>
        <View style={styles.detailRow}>
          <TouchableOpacity
            style={styles.labelContainer}
            onPress={() => setShowDatePickerFor(item._id)}
          >
            <Text style={styles.detailLabel}>約定時間</Text>
            <Text style={styles.detailInput}>
              {selectedDates[item._id] || "請選擇約定時間"}
            </Text>
          </TouchableOpacity>
          {showDatePickerFor === item._id && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="spinner"
              onChange={(event, selectedDate) => handleDateChange(event, selectedDate, item._id)}
            />
          )}
        </View>
      </View>
      {/* 顯示數量在商品容器右下角 */}
      <Text style={styles.quantityLabel}>{`x${quantity[index]}`}</Text>
    </View>
  );

  const renderPaymentOption = (
    iconName: "cash-outline" | "card-outline",
    label: string,
    value: string
  ) => (
    <TouchableOpacity //disabled //關閉信用卡選項
      style={[
        styles.paymentOption,
        selectedPayment === value && styles.selectedPaymentOption,
      ]}
      onPress={() => setSelectedPayment(value)}
    >
      <Ionicons name={iconName} size={24} />
      <Text style={styles.paymentLabel}>{label}</Text>
      {selectedPayment === value && <Ionicons name="checkmark" size={24} color="green" />}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>正在加載...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Headers title="結帳" back={() => CartNavigation.goBack()} />
      <FlatList
        data={selectProducts}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>伺服器發生錯誤</Text>}
        ListFooterComponent={
          <View style={styles.paymentContainer}>
            <Text style={styles.sectionTitle}>付款方式</Text>
            {renderPaymentOption("cash-outline", "現金", "Cash")}
            {renderPaymentOption("card-outline", "信用卡", "Credit Card")}
          </View>
        }
      />
      <View style={styles.footerContainer}>
        <Text style={styles.totalAmount}>總金額: ${totalAmount}</Text>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleSendCheckout}>
          <Text style={styles.checkoutButtonText}>結帳</Text>
        </TouchableOpacity>
      </View>
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
        textAlign: 'right',
        height: 30,
        marginLeft: 10,
    },
    labelContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center", // 確保垂直置中
    },
    detailLabel: {
        fontSize: 14,
        color: "#222",
        flex: 1, // 確保占用剩餘空間
    },
    emptyText: {
        textAlign: "center",
        marginVertical: 20,
        fontSize: 16,
        color: "#999",
    },
    paymentContainer: {
        backgroundColor: "#ddd",
        borderRadius: 10,
        marginVertical: 10,
        marginHorizontal: 16,
        padding: 10,
    },
    paymentOption: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10,
        marginBottom: 10,
    },
    selectedPaymentOption: {
        borderColor: "green",
        backgroundColor: "#eafeea",
    },
    paymentLabel: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
    },
    cashContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    footerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#ddd",
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: "bold",
    },
    checkoutButton: {
        backgroundColor: "#4CAF50",
        paddingHorizontal: 20,
        paddingVertical: 10,
    borderRadius: 8,
      },
    checkoutButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
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
});