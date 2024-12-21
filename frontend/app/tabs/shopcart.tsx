import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
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
  const [checkOutButtonStatus, setCheckOutButtonStatus] = useState<boolean>(true);
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
          productDetails.push({ ...response.body, quantity: 1 }); // 初始化数量为 1
        }
      }
      setCartList(productDetails);
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

  const handleQuantityChange = (id: string, delta: number) => {
    setCartList(prevItems =>
      prevItems.map(item =>
        item._id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + delta), // 确保数量最少为 1
            }
          : item
      )
    );
  };

  const handleCheckout = () => {
    const selectedProductIds = cartList
      .filter(item => item.selected)
      .map(item => item._id);
    console.log(selectedProductIds);
    CartNavigation.navigate('Checkout', { productId: selectedProductIds });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>購物車</Text>
      <FlatList
        data={cartList}
        keyExtractor={(item: Product, index) => item._id || index.toString()}
        ListFooterComponent={
          <Text style={styles.footerText}>沒有更多商品了</Text>
        }
        renderItem={({ item }: { item: Product }) => (
          <View style={styles.itemContainer}>
            <CheckBox
              style={styles.checkbox}
              isChecked={item.selected}
              onClick={() => handleToggleSelection(item._id)}
            />
            <Image style={styles.itemImage} source={{ uri: item.photouri }} />
            <TouchableOpacity
              style={styles.itemInfo}
              onPress={() => {
                MainNavigation.navigate('Home' as keyof MainTabParamList, {
                  screen: 'Product',
                  params: { productId: item._id, source: 'Cart' },
                } as any);
              }}
            >
              <Text style={styles.title}>{item.name}</Text>
              <Text>{item.author}</Text>
            </TouchableOpacity>
            <View>
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
                <Text style={styles.priceText}>{`$${item.price}`}</Text>
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
          style={[
            styles.checkoutButton,
            !checkOutButtonStatus && styles.activeCheckoutButton,
          ]}
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
    fontWeight: 'bold',
    paddingLeft: 16,
    paddingTop: 16,
    marginBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 16,
    marginVertical: 5,
  },
  checkbox: {
    marginRight: 5,
  },
  itemImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 5,
  },
  itemInfo: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    color: '#f80',
    width: 60,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityButton: {
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#d3d3d3',
    padding: 10,
    borderRadius: 5,
    marginTop: 'auto',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#aaa',
    padding: 8,
    borderRadius: 5,
  },
  activeCheckoutButton: {
    backgroundColor: '#4CAF50',
  },
  checkoutText: {
    color: '#fff',
  },
  checkboxText: {
    fontWeight: 'bold',
  },
  selectAllContainer: {
    flexDirection: 'row',
  },
  footerText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 10,
    fontSize: 14,
  },
});