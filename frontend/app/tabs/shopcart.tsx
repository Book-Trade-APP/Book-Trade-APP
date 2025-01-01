import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import CheckBox from 'react-native-check-box';
import { useFocusEffect, NavigationProp, useNavigation } from '@react-navigation/native';
import { MainTabParamList, CartStackParamList } from '../navigation/type';
import { Product } from '../interface/Product';
import { getUserId } from '../../utils/stroage';
import { asyncGet, asyncPost } from '../../utils/fetch';
import { api } from '../../api/api';

export default function ShoppingCartScreen() {
  const [cartList, setCartList] = useState<Product[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [checkOutButtonStatus, setCheckOutButtonStatus] = useState<boolean>(true); //disabled默認為true
  const MainNavigation = useNavigation<NavigationProp<MainTabParamList>>();
  const CartNavigation = useNavigation<NavigationProp<CartStackParamList>>();

  const initializeUserId = async () => {
    const id = await getUserId();
    setUserId(id);
  };

  const getCartList = async () => {
    if (!userId) return;
    try {
      const response = await asyncPost(api.GetCartList, {
        user_id: userId,
      });

      if (response.status === 200 && Array.isArray(response.data.body)) {
        const cartIds: string[] = response.data.body;
        await findProductDetails(cartIds);
      }
    } catch (error) {
      console.error('Error fetching cart list:', error);
    }
  };
  
  const findProductDetails = async (cartIds: string[]) => {
    const productDetails: Product[] = [];
    try {
      for (const productId of cartIds) {
        const response = await asyncGet(`${api.GetOneProduct}?product_id=${productId}`);
        if (response.code === 200) {
          productDetails.push({ ...response.body, quantity: 1, selected: false }); // 初始化數量為 1
        }
      }
      setCartList(productDetails);
      setSelectAll(false);
      setCheckOutButtonStatus(true);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await initializeUserId();
        if (userId) {
          await getCartList();
        }
      };

      fetchData();
    }, [userId])
  );

  const handleToggleSelection = (id: string): void => {
    setCartList(prevItems => {
      const updatedItems = prevItems.map(item =>
        item._id === id ? { ...item, selected: !item.selected } : item
      );
      const anySelected = updatedItems.some(item => item.selected);
      setSelectAll(updatedItems.every(item => item.selected));
      setCheckOutButtonStatus(!anySelected);
      return updatedItems;
    });
  };

  const handleToggleSelectAll = (): void => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setCartList(prevItems => {
      const updatedItems = prevItems.map(item => ({ ...item, selected: newSelectAll }));
      setCheckOutButtonStatus(!newSelectAll);
      return updatedItems;
    });
  };

  const calculateTotal = (): number => {
    return cartList
      .filter(item => item.selected)
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleQuantityChange = async (id: string, delta: number) => {
    try {
      const productResponse = await asyncGet(`${api.GetOneProduct}?product_id=${id}`);
      if (productResponse.code !== 200) {
        console.error('Error fetching product quantity:', productResponse);
        return;
      }

      const maxQuantity = productResponse.body.quantity;

      setCartList(prevItems =>
        prevItems.map(item => {
          if (item._id === id) {
            const newQuantity = item.quantity + delta;

            if (newQuantity > maxQuantity) {
              Alert.alert('錯誤', '商品數量不足');
              return item;
            }

            if (newQuantity <= 0) {
              asyncPost(api. UpdateCart, {
                user_id: userId,
                product_id: id,
                quantity: 0,
              }).catch(error => console.error("error updating cart: ", error))
              return null;
            }

            asyncPost(api.UpdateCart, {
              user_id: userId,
              product_id: id,
              quantity: newQuantity,
            }).catch(error => console.error('Error updating cart: ', error));

            return { ...item, quantity: newQuantity };
          }
          return item;
        }).filter(Boolean) as Product[] // 过滤掉被删除的商品
      );
    } catch (error) {
      console.error('Error handling quantity change:', error);
    }
  };

  const handleCheckout = () => {
    const selectedProducts = cartList.filter(item => item.selected);

    const productId = selectedProducts.map(item => item._id);
    const quantity = selectedProducts.map(item => item.quantity);

    console.log(`User ${userId} checkout with ${productId}`);

    CartNavigation.navigate('Checkout', { productId, quantity });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>購物車</Text>
      <FlatList
        data={cartList}
        keyExtractor={(item: Product, index) => item._id || index.toString()}
        ListEmptyComponent={
          <Text style={styles.footerText}>購物車空空的</Text>
        }
        renderItem={({ item }: { item: Product }) => (
          <View style={styles.itemContainer}>
            <CheckBox
              style={styles.checkbox}
              isChecked={item.selected}
              onClick={() => handleToggleSelection(item._id)}
            />
            <Image style={styles.itemImage} source={{ uri: item.photouri }} />
            <View style={styles.itemInfo}>
              <View style={styles.infoTopContainer}>
                <TouchableOpacity
                  style={styles.textContainer}
                  onPress={() => {
                    MainNavigation.navigate('Home' as keyof MainTabParamList, {
                      screen: 'Product',
                      params: { productId: item._id, source: 'Cart' },
                    } as any);
                  }}
                >
                  <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.author} numberOfLines={1}>{item.author}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange(item._id, -1)}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange(item._id, 1)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
                <Text style={styles.priceText}>${item.price}</Text>
              </View>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.selectAllContainer}>
          <CheckBox
            style={styles.checkbox}
            isChecked={selectAll}
            onClick={handleToggleSelectAll}
          />
          <Text style={styles.checkboxText}>全選</Text>
        </View>
        <Text style={styles.totalPrice}>總金額 ${calculateTotal()}</Text>
        <TouchableOpacity
          style={[styles.checkoutButton, !checkOutButtonStatus && styles.activeCheckoutButton]}
          onPress={handleCheckout}
          disabled={checkOutButtonStatus}
        >
          <Text style={styles.checkoutText}>
            結帳 ({cartList.filter(item => item.selected).length})
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    paddingLeft: 16,
    paddingTop: 16,
    marginBottom: 16,
    color: '#333',
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  checkbox: {
    marginRight: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  itemImage: {
    width: 60,
    height: 60,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
  },
  infoTopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#666',
  },
  priceAndQuantityContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF4757',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
  },
  quantityButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 8,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    minWidth: 30,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  checkoutButton: {
    backgroundColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
  },
  activeCheckoutButton: {
    backgroundColor: '#2f95dc',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  checkboxText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
    marginVertical: 12,
  },
});