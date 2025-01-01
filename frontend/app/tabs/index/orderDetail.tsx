import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useHideTabBar } from "../../hook/HideTabBar";
import { Headers } from "../../components/NoneButtonHeader";
import { NavigationProp, RouteProp, useNavigation } from "@react-navigation/native";
import { HomeStackParamList } from "../../navigation/type";
import { asyncDelete, asyncGet, asyncPost } from "../../../utils/fetch";
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
  const [sellerRating, setSellerRating] = useState<number>(0);
  const [buyerRating, setBuyerRating] = useState<number>(0);
  const [isSellerRatingModalVisible, setIsSellerRatingModalVisible] = useState(false);
  const [isBuyerRatingModalVisible, setIsBuyerRatingModalVisible] = useState(false);
  const [buyer, setBuyer] = useState<string>("");
  const [seller, setSeller] = useState<string>("");
  const [sellerUsername, setSellerUsername] = useState<string>("");
  const [buyerUsername, setBuyerUsername] = useState<string>("");
  
  const { orderId, products: productIds, quantity, source, userRole } = route.params;

  const SendNotification = async (userId: string, title: string, message: string) => {
    try {
      await asyncPost(api.UserSendNotification, {
        "user_id": userId,
        "title": title,
        "message": message
      });
    } catch (error) {
      console.log('Failed to send notification');
    }
  };

  const handleSellerRating = async () => {
    try {
      const response = await asyncPost(api.evaluate, {
        'user_id': seller,
        'evaluate': sellerRating,
      });
      if (response.status === 200) {
        setIsSellerRatingModalVisible(false);
        await BuyerStatusToCompleted();
        await SendNotification(seller, "收到新評價", `您收到了來自${buyerUsername}的${sellerRating}星評價`);
      }
    } catch (error) {
      console.log("Failed to send seller rating");
    }
  };

  const handleBuyerRating = async () => {
    try {
      const response = await asyncPost(api.evaluate, {
        'user_id': buyer,
        'evaluate': buyerRating,
      });
      if (response.status === 200) {
        setIsBuyerRatingModalVisible(false);
        await SellerStatusToCompleted();
        await SendNotification(buyer, "新評價", `您收到了來自${sellerUsername}的${buyerRating}星評價`);
      }
    } catch (error) {
      console.log("Failed to send buyer rating");
    }
  };

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
        setBuyer(orderResponse.body.buyer_id);
        setOrderDetail(orderResponse.body);
      }

      const validProducts = productsResponse
        .filter(response => response.code === 200)
        .map(response => response.body);
      setProducts(validProducts);
      setSeller(validProducts[0]?.seller_id);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetUsernames = async () => {
    try {
      if (seller) {
        const sellerResponse = await asyncGet(`${api.find}?_id=${seller}`);
        setSellerUsername(sellerResponse.body.username);
      }
      if (buyer) {
        const buyerResponse = await asyncGet(`${api.find}?_id=${buyer}`);
        setBuyerUsername(buyerResponse.body.username);
      }
    } catch (error) {
      console.log("Failed to find usernames");
    }
  };

  useEffect(() => {
    fetchData();
  }, [orderId, productIds]);

  useEffect(() => {
    if (seller || buyer) {
      handleGetUsernames();
    }
  }, [seller, buyer]);
  const checkOrderStatus = async (userRole: string) => {
    try {
      const response = await asyncGet(`${api.GetOrderById}?id=${orderId}`);
      return userRole === "seller" ? response.body.seller_status : response.body.buyer_status;
    } catch (error) {
      console.log("Failed to check order status");
      throw error;
    }
  };
  const updateOrderStatus = async (buyerStatus: string, sellerStatus: string) => {
    try {
      const response = await asyncPost(api.OrderStatusUpdate, {
        order_id: orderId,
        buyer_status: buyerStatus,
        seller_status: sellerStatus,
      });
      if (response.status === 200) {
        handleGoBack();
      }
    } catch (error) {
      console.log("Failed to update order status");
      throw error;
    }
  };
  const SellerStatusToCompleted = async () => {
    try {
      const buyerStatus = await checkOrderStatus("buyer");
      if (buyerStatus !== "已完成") {
        await updateOrderStatus("待評價", "已完成");
      } else {
        await updateOrderStatus("已完成", "已完成");
      }
    } catch (error) {
      console.log("Failed to change seller status to completed");
    }
  };
  
  const BuyerStatusToCompleted = async () => {
    try {
      const sellerStatus = await checkOrderStatus("seller");
      if (sellerStatus !== "已完成") {
        await updateOrderStatus("已完成", "待評價");
      } else {
        await updateOrderStatus("已完成", "已完成");
      }
    } catch (error) {
      console.log("Failed to change buyer status to completed");
    }
  };

  const handleStatusToPending = async () => {
    try {
      await updateOrderStatus("待處理", "待處理");
    } catch (error) {
      console.log("Failed to change order status to pending");
    }
  };

  const handleStatusToEvaluate = async () => {
    try {
      await updateOrderStatus("待評價", "待評價");
    } catch (error) {
      console.log("Failed to change order status to evaluate");
    }
  };

  const handleDeleteOrder = async () => {
    try {
      const response = await asyncDelete(`${api.DeleteOrder}?id=${orderId}`);
      if (response.status === 200) {
        handleGoBack();
      }
    } catch (error) {
      console.log("Failed to delete order");
    }
  };

  const confirmOrder = async () => {
    await handleStatusToPending();
    await SendNotification(buyer, "訂單已確認", `您的訂單${orderId}已被確認`);
  };

  const refuseOrder = async () => {
    await handleDeleteOrder();
    await SendNotification(buyer, "訂單已取消", `您的訂單${orderId}已被取消`);
  };

  const completeOrder = async () => {
    await handleStatusToEvaluate();
    await SendNotification(seller, "訂單已完成", `您的訂單${orderId}已完成`);
  };

  const cancelOrder = async () => {
    await handleDeleteOrder();
    await SendNotification(seller, "訂單已取消", `您的訂單${orderId}已被取消`);
  };

  const handleGoBack = () => {
    switch(source) {
      case "confirm":
        navigation.navigate('Profile', { screen: 'Confirm' });
        break;
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

  const ProductItem: React.FC<{item: Product, quantity: number}> = React.memo(({ item, quantity }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image 
          style={styles.itemImage} 
          source={{ uri: item.photouri }}
        />
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.itemAuthor} numberOfLines={1}>{item.author}</Text>
          <Text style={styles.itemPrice}>${item.price}</Text>
        </View>
      </View>
      <Text style={styles.quantityLabel}>x{quantity}</Text>
    </View>
  ));

  const renderProducts = useCallback(() => (
    products.map((item, index) => (
      <ProductItem 
        key={item._id} 
        item={item} 
        quantity={quantity[index]} 
      />
    ))
  ), [products, quantity]);

  const RatingModal = ({ 
    isVisible, 
    onClose, 
    onSubmit, 
    rating, 
    setRating, 
    username,
    userType
  }: {
    isVisible: boolean, 
    onClose: () => void, 
    onSubmit: () => Promise<void>, 
    rating: number, 
    setRating: (rating: number) => void, 
    username: string, 
    userType: "買家" | "賣家"}) => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{username}</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
              >
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={40}
                  color="#FFD700"
                  style={styles.star}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.ratingText}>
            {rating === 0 ? `為${userType}評分` : `${rating} 顆星`}
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={() => {
                onClose();
                setRating(0);
              }}
            >
              <Text style={styles.modalButtonText}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.submitButton]} 
              onPress={onSubmit}
              disabled={rating === 0}
            >
              <Text style={styles.modalButtonText}>確認</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const handleStatusToShowButton = () => {
    if (userRole === "seller") {
      switch (source) {
        case "confirm":
          return (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.completeButton]} 
                onPress={confirmOrder}
              >
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
                <Text style={styles.buttonText}>確認訂單</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]} 
                onPress={refuseOrder}
              >
                <Ionicons name="trash" size={24} color="#fff" />
                <Text style={styles.buttonText}>拒絕訂單</Text>
              </TouchableOpacity>
            </View>
          );
        case "evaluate":
          return (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.evaluateButton]} 
                onPress={() => setIsBuyerRatingModalVisible(true)}
              >
                <Ionicons name="star" size={24} color="#fff" />
                <Text style={styles.buttonText}>評價買家</Text>
              </TouchableOpacity>
            </View>
          );
      }
    } else if (userRole === "buyer") {
      switch (source) {
        case "pending":
          return (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.completeButton]} 
                onPress={completeOrder}
              >
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
                <Text style={styles.buttonText}>完成</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]} 
                onPress={cancelOrder}
              >
                <Ionicons name="trash" size={24} color="#fff" />
                <Text style={styles.buttonText}>取消</Text>
              </TouchableOpacity>
            </View>
          );
        case "evaluate":
          return (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.evaluateButton]} 
                onPress={() => setIsSellerRatingModalVisible(true)}
              >
                <Ionicons name="star" size={24} color="#fff" />
                <Text style={styles.buttonText}>評價賣家</Text>
              </TouchableOpacity>
            </View>
          );
      }
    }

    if (source === "completed") {
      return (
        <View style={styles.actionButtons}>
          <View style={[styles.actionButton, styles.completedButton]}>
            <Text style={styles.buttonCompletedText}>訂單已完成</Text>
          </View>
        </View>
      );
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
              {userRole === "seller"
              ?
              <>
                <Text style={styles.detailLabel}>買家</Text>
                <Text style={styles.detailValue}>{buyerUsername}</Text>
              </>
              :
              <>
                <Text style={styles.detailLabel}>賣家</Text>
                <Text style={styles.detailValue}>{sellerUsername}</Text>
              </>
              }
            </View>
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
          {handleStatusToShowButton()}
          <View style={styles.orderInfo}>
            <Text style={styles.footerText}>訂單編號: {orderId}</Text>
            <Text style={styles.footerText}>成立時間: {orderDetail?.created_at ? formatDate(orderDetail.created_at) : ''}</Text>
          </View>
        </ScrollView>
        <RatingModal 
          isVisible={isSellerRatingModalVisible}
          onClose={() => setIsSellerRatingModalVisible(false)}
          onSubmit={handleSellerRating}
          rating={sellerRating}
          setRating={setSellerRating}
          username={sellerUsername}
          userType="賣家"
        />
        <RatingModal 
          isVisible={isBuyerRatingModalVisible}
          onClose={() => setIsBuyerRatingModalVisible(false)}
          onSubmit={handleBuyerRating}
          rating={buyerRating}
          setRating={setBuyerRating}
          username={buyerUsername}
          userType="買家"
        />
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
    maxWidth: 200,
    fontSize: 16,
    fontWeight: "600",
  },
  itemAuthor: {
    maxWidth: 200,
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
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    width: 300,
  },
  detailValue: {
    width: 220,
    fontSize: 16,
    textAlign: "right",
    color: "#666",
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
    gap: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#FF5252',
  },
  evaluateButton: {
    backgroundColor: '#EB6C42',
  },
  completedButton: {
    borderWidth: 3,
    borderColor: "#A7A7A7",
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonCompletedText: {
    color: '#A7A7A7',
    fontSize: 16,
    fontWeight: '600',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '80%',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  star: {
    marginHorizontal: 4,
  },
  ratingText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#B5B5B5',
  },
  submitButton: {
    backgroundColor: '#EB6C42',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});