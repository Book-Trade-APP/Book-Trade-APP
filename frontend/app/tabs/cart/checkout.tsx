import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput, Alert, Modal } from "react-native";
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
import React from "react";
import { LoadingModal } from "../../components/LoadingModal";

interface GroupedProducts {
  sellerId: string;
  sellerUsername: string;
  products: Product[];
  quantities: number[];
  note: string;
  location: string;
  agreedTime: string;
}

export default function CheckoutScreen({ route }: { route: RouteProp<CartStackParamList, "Checkout"> }) {
  const CartNavigation = useNavigation<NavigationProp<CartStackParamList>>();
  useHideTabBar();
  
  const { productId: selectedProductIds, quantity } = route.params;
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [groupedProducts, setGroupedProducts] = useState<GroupedProducts[]>([]);
  const [selectedPayment, setSelectedPayment] = useState("Cash");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const [currentEditingSeller, setCurrentEditingSeller] = useState<string | null>(null);
  const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [tempInput, setTempInput] = useState("");

  const totalAmount = groupedProducts.reduce((total, group) => {
    return total + group.products.reduce((groupTotal, product, index) => {
      return groupTotal + product.price * group.quantities[index];
    }, 0);
  }, 0);
  const fetchUserId = async () => {
    const user_id = await getUserId();
    setUserId(user_id as string);
  }
  const fetchSelectedProducts = async () => {
    setIsLoading(true);
    try {
      const productsMap = new Map<string, GroupedProducts>();
      
      for (let i = 0; i < selectedProductIds.length; i++) {
        const id = selectedProductIds[i];
        const response = await asyncGet(`${api.GetOneProduct}?product_id=${id}`);
        
        if (response.code === 200) {
          const product = response.body;
          const sellerResponse = await asyncGet(`${api.find}?_id=${product.seller_id}`);
          const sellerUsername = sellerResponse.code === 200 ? sellerResponse.body.username : "Unknown Seller";
          
          if (!productsMap.has(product.seller_id)) {
            productsMap.set(product.seller_id, {
              sellerId: product.seller_id,
              sellerUsername: sellerUsername,
              products: [],
              quantities: [],
              note: "",
              location: "",
              agreedTime: ""
            });
          }
          
          const group = productsMap.get(product.seller_id)!;
          group.products.push(product);
          group.quantities.push(quantity[i]);
        }
      }
      
      setGroupedProducts(Array.from(productsMap.values()));
    } catch (error) {
      console.error("Error fetching selected products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserId();
    fetchSelectedProducts();
  }, []);

  const handleDateChange = (event: any, selectedDateValue?: Date) => {
    setShowDatePicker(false);
    if (event.type === "dismissed") {
      return;
    }
    if (selectedDateValue) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      if (selectedDateValue >= today) {
        const formattedDate = `${String(selectedDateValue.getFullYear())}-${String(
          selectedDateValue.getMonth() + 1
        ).padStart(2, "0")}-${String(selectedDateValue.getDate()).padStart(2, "0")}`;
        setSelectedDate(formattedDate);
        setShowTimePicker(true);
      } else {
        Alert.alert("錯誤", "請選擇今天或之後的日期");
      }
    }
  };

  const handleTimeChange = (event: any, selectedTimeValue?: Date) => {
    setShowTimePicker(false);
    if (event.type === "dismissed") {
      return;
    }
    if (selectedTimeValue) {
      const formattedTime = `${String(selectedTimeValue.getHours()).padStart(2, "0")}:${String(
        selectedTimeValue.getMinutes()
      ).padStart(2, "0")}`;
      setSelectedTime(formattedTime);
  
      const combinedDateTime = `${selectedDate} ${formattedTime}`;
      
      setGroupedProducts(prev => prev.map(group => {
        if (group.sellerId === currentEditingSeller) {
          return { ...group, agreedTime: combinedDateTime };
        }
        return group;
      }));
    }
  };
  const updateProductQuantities = async (productIds: string[], quantities: number[]) => {
    const batchSize = 5;
    
    for (let i = 0; i < productIds.length; i += batchSize) {
      const batchIds = productIds.slice(i, i + batchSize);
      const batchQuantities = quantities.slice(i, i + batchSize);
      
      const batchPromises = batchIds.map(async (productId, index) => {
        // 取得商品資訊
        const response = await asyncGet(`${api.GetOneProduct}?product_id=${productId}`);
        if (response.code === 200) {
          const product = response.body;
          // 更新數量
          product.quantity = product.quantity - batchQuantities[index];
          // // 更新商品
          return asyncPost(api.UpdateProduct, product);
        }
        return null;
      });
   
      const results = await Promise.all(batchPromises);
      const failed = results.filter(r => !r || r.status !== 200);
      if (failed.length > 0) {
        console.error('部分商品庫存更新失敗');
      }
    }
   };

  const handleSendCheckout = async () => {
    setIsLoading(true);
    try {
      // 驗證訂單
      const orders = groupedProducts.map(group => ({
        user_id: userId,
        product_ids: group.products.map(p => p._id),
        quantities: group.quantities,
        payment_method: selectedPayment,
        note: group.note,
        agreed_time: group.agreedTime,
        location: group.location,
        total_amount: group.products.reduce((total, product, index) => 
          total + product.price * group.quantities[index], 0),
      }));
  
      if (orders.some(order => !order.location || !order.agreed_time)) {
        Alert.alert("提醒", "請填寫所有訂單的約定時間和地點");
        return;
      }
  
      // 序列化執行關鍵操作
      for (const order of orders) {
        const orderResult = await asyncPost(api.CreateOrder, order);
        if (orderResult.status !== 200) {
          throw new Error("訂單創建失敗");
        }
        
        // 更新該訂單相關的商品庫存
        await updateProductQuantities(order.product_ids, order.quantities);
        
        // 清空該訂單商品的購物車
        for (const productId of order.product_ids) {
          await asyncPost(api.UpdateCart, {
            user_id: userId,
            product_id: productId,
            quantity: 0
          });
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }
  
      CartNavigation.navigate("Success");
    } catch (error) {
      console.error("結帳失敗:", error);
      Alert.alert("錯誤", "結帳過程中發生錯誤，請稍後再試。如果問題持續發生，請聯繫客服。");
    } finally {
      setIsLoading(false);
    }
  };

  const renderPaymentOption = (
    iconName: "cash-outline" | "card-outline",
    label: string,
    value: string
  ) => (
    <TouchableOpacity
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

  const InputModal = React.memo(({ 
    visible, 
    onClose, 
    title, 
    placeholder, 
    onConfirm,
    initialValue = ""
  }: { 
    visible: boolean;
    onClose: () => void;
    title: string;
    placeholder: string;
    onConfirm: (value: string) => void;
    initialValue?: string;
  }) => {
    const [localInput, setLocalInput] = useState(initialValue);
  
    useEffect(() => {
      if (visible) {
        setLocalInput(initialValue);
      }
    }, [visible, initialValue]);
  
    const handleConfirm = () => {
      onConfirm(localInput);
      onClose();
    };
  
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TextInput
              style={styles.modalInput}
              placeholder={placeholder}
              value={localInput}
              onChangeText={setLocalInput}
              multiline={true}
              numberOfLines={4}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={onClose}
              >
                <Text style={styles.buttonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirm}
              >
                <Text style={[styles.buttonText, styles.confirmButtonText]}>確認</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  });

  const renderProductGroup = ({ item }: { item: GroupedProducts }) => (
    <View style={styles.groupContainer}>
      <Text style={styles.sellerUsername}>{item.sellerUsername}</Text>
      {item.products.map((product, index) => (
        <View key={product._id} style={styles.card}>
          <View style={styles.row}>
            <Image style={styles.itemImage} source={{ uri: product.photouri }} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>{product.name}</Text>
              <Text style={styles.itemAuthor}>{product.author}</Text>
              <Text style={styles.itemPrice}>${product.price}</Text>
            </View>
          </View>
          <Text style={styles.quantityLabel}>x{item.quantities[index]}</Text>
        </View>
      ))}

      {/* Details section for each seller */}
      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>詳細資料</Text>
        <TouchableOpacity 
          style={styles.labelContainer}
          onPress={() => {
            setCurrentEditingSeller(item.sellerId);
            setTempInput(item.note);
            setIsNoteModalVisible(true);
          }}
        >
          <Text style={styles.detailLabel}>備註</Text>
          <Text style={styles.detailValue}>
            {item.note || "新增備註"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.labelContainer}
          onPress={() => {
            setCurrentEditingSeller(item.sellerId);
            setTempInput(item.location);
            setIsLocationModalVisible(true);
          }}
        >
          <Text style={styles.detailLabel}>約定地點</Text>
          <Text style={styles.detailValue}>
            {item.location || "請輸入約定地點"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.labelContainer}
          onPress={() => {
            setCurrentEditingSeller(item.sellerId);
            setShowDatePicker(true);
          }}
        >
          <Text style={styles.detailLabel}>約定時間</Text>
          <Text style={styles.detailValue}>
            {item.agreedTime || "請選擇約定時間"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const ListFooterComponent = () => (
    <View style={styles.paymentContainer}>
      <Text style={styles.sectionTitle}>付款方式</Text>
      {renderPaymentOption("cash-outline", "現金", "Cash")}
      {renderPaymentOption("card-outline", "信用卡", "Credit Card")}
    </View>
  );

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Headers title="結帳" back={() => CartNavigation.goBack()} />
        <FlatList
          data={groupedProducts}
          keyExtractor={(item) => item.sellerId}
          renderItem={renderProductGroup}
          ListEmptyComponent={<Text style={styles.emptyText}>伺服器發生錯誤</Text>}
          ListFooterComponent={ListFooterComponent}
          contentContainerStyle={styles.listContent}
        />
        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="calendar"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            display="spinner"
            onChange={handleTimeChange}
          />
        )}
        <InputModal
          visible={isNoteModalVisible}
          onClose={() => setIsNoteModalVisible(false)}
          title="新增備註"
          placeholder="請輸入備註內容"
          onConfirm={(value) => {
            setGroupedProducts(prev => prev.map(group => {
              if (group.sellerId === currentEditingSeller) {
                return { ...group, note: value };
              }
              return group;
            }));
            setIsNoteModalVisible(false);
          }}
          initialValue={tempInput}
        />
        <InputModal
          visible={isLocationModalVisible}
          onClose={() => setIsLocationModalVisible(false)}
          title="約定地點"
          placeholder="請輸入約定地點"
          onConfirm={(value) => {
            setGroupedProducts(prev => prev.map(group => {
              if (group.sellerId === currentEditingSeller) {
                return { ...group, location: value };
              }
              return group;
            }));
            setIsLocationModalVisible(false);
          }}
          initialValue={tempInput}
        />
        <View style={styles.footerContainer}>
          <Text style={styles.totalAmount}>總金額: ${totalAmount}</Text>
          <TouchableOpacity 
            style={styles.checkoutButton} 
            onPress={handleSendCheckout}
          >
            <Text style={styles.checkoutButtonText}>結帳</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <LoadingModal isLoading={isLoading} message="正在生成訂單"/>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
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
  detailsContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  paymentContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  detailInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
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
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
  },
  selectedPaymentOption: {
    borderColor: "#2f95dc",
    backgroundColor: "#f0f9ff",
  },
  paymentLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "600",
  },
  checkoutButton: {
    backgroundColor: "#2f95dc",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  confirmButton: {
    backgroundColor: '#2f95dc',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: 'white',
  },
  groupContainer: {
    marginBottom: 16,
  },
  sellerUsername: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  }
});