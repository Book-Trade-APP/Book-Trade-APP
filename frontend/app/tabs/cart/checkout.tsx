import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHideTabBar } from "../../hook/HideTabBar";
import { Headers } from "../../components/NoneButtonHeader";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { CartStackParamList } from "../../navigation/type";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "../../interface/Product";
import { useEffect, useState } from "react";
import { asyncGet } from "../../../utils/fetch";
import { api } from "../../../api/api";

type CheckoutScreenRouteProp = RouteProp<CartStackParamList, "Checkout">;

export default function CheckoutScreen({ route }: { route: CheckoutScreenRouteProp }) {
  const navigation = useNavigation();
  useHideTabBar();

  const [showDatePickerFor, setShowDatePickerFor] = useState<string | null>(null); // 改为 string | null
  const [selectedDates, setSelectedDates] = useState<{ [key: string]: string }>({}); // 键类型改为 string
  const [selectProducts, setSelectProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { productId: selectedProductIds } = route.params;

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

  const totalAmount = selectProducts.reduce((total, product) => total + product.price, 0);
  const [selectedPayment, setSelectedPayment] = useState("cash");

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

  const renderItem = ({ item }: { item: Product }) => (
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
            onPress={() => setShowDatePickerFor(item._id)} // _id 类型为 string
          >
            <Text style={styles.detailLabel}>約定時間</Text>
            <Text style={styles.detailInput}>
              {selectedDates[item._id] || "請選擇約定時間"} {/* 使用 string 作为键 */}
            </Text>
          </TouchableOpacity>
          {showDatePickerFor === item._id && ( // 比较 string 类型
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="spinner"
              onChange={(event, selectedDate) => handleDateChange(event, selectedDate, item._id)}
            />
          )}
        </View>
      </View>
    </View>
  );

  const renderPaymentOption = (
    iconName: "cash-outline" | "card-outline",
    label: string,
    value: string
  ) => (
    <TouchableOpacity disabled //關閉信用卡選項
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
        <Text style={styles.loadingText}>正在加载...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Headers title="結帳" back={() => navigation.goBack()} />
      <FlatList
        data={selectProducts}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>伺服器發生錯誤</Text>}
        ListFooterComponent={
          <View style={styles.paymentContainer}>
            <Text style={styles.sectionTitle}>付款方式</Text>
            {renderPaymentOption("cash-outline", "現金", "cash")}
            {renderPaymentOption("card-outline", "信用卡", "creditCard")}
          </View>
        }
      />
      <View style={styles.footerContainer}>
        <Text style={styles.totalAmount}>總金額: ${totalAmount}</Text>
        <TouchableOpacity style={styles.checkoutButton} onPress={() => Alert.alert("結帳成功")}>
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
});