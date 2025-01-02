import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import CheckBox from 'react-native-check-box';
import { useFocusEffect, NavigationProp, useNavigation } from '@react-navigation/native';
import { MainTabParamList, CartStackParamList } from '../navigation/type';
import { Product } from '../interface/Product';
import { getUserId } from '@/utils/stroage';
import { asyncGet, asyncPost } from '@/utils/fetch';
import { api } from '@/api/api';
import { styles } from './styles/shopcart';
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