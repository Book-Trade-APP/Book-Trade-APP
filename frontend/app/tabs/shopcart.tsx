import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import CheckBox from 'react-native-check-box';
import { fake_cartItems } from '../data/fakeCartItem';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MainTabParamList, CartStackParamList } from '../navigation/type';
import { Product } from '../interface/Product';

export default function ShoppingCartScreen() {
  const [cartItems, setCartItems] = useState(fake_cartItems);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [checkOutButtonStatus, setCheckOutButtonStatus] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProp<MainTabParamList>>();
  const navigation2 = useNavigation<NavigationProp<CartStackParamList>>();

  const handleToggleSelection = (id: number): void => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      );
      const anySelected = updatedItems.some(item => item.selected);
      setSelectAll(updatedItems.every(item => item.selected));
      setCheckOutButtonStatus(!anySelected); // 根據是否有選中的項目來更新按鈕狀態
      return updatedItems;
    });
  };
  
  const handleToggleSelectAll = (): void => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => ({ ...item, selected: newSelectAll }));
      setCheckOutButtonStatus(!newSelectAll); // 如果全選，則按鈕應啟用；否則禁用
      return updatedItems;
    });
  };

  const calculateTotal = (): number => {
    return cartItems
      .filter(item => item.selected)
      .reduce((total, item) => total + item.price, 0);
  };
  const handleCheckout = () => {
    const selectedProductIds = cartItems
      .filter(item => item.selected)
      .map(item => item.id);
  
    navigation2.navigate('Checkout', { productId: selectedProductIds });
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>購物車</Text>

      <FlatList
        data={cartItems} // 資料來源
        keyExtractor={(item: Product) => item.id.toString()}
        ListFooterComponent={
          <Text style={styles.footerText}>沒有更多商品了</Text>
        }
        renderItem={({ item }: { item: Product }) => (
          <View style={styles.itemContainer}>
            <CheckBox
              style={styles.checkbox}
              isChecked={item.selected}
              onClick={() => handleToggleSelection(item.id)}
            />
            <Image style={styles.itemImage} source={item.photouri} />
            <TouchableOpacity 
              style={styles.itemInfo} 
              onPress={() => {
                // 使用類型斷言解決類型不兼容問題
                navigation.navigate('Home' as keyof MainTabParamList, {
                  screen: 'Product',
                  params: { productId: item.id, source: 'Cart' }
                } as any);
              }}
            >
              <Text style={styles.title}>{item.name}</Text>
              <Text>{item.author}</Text>
            </TouchableOpacity>
            <View>
              <Text style={styles.priceText}>{`$${item.price}`}</Text>
            </View>
          </View>
        )
      }
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
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout} disabled={checkOutButtonStatus}>
          <Text style={styles.checkoutText}>
            結帳 ({cartItems.filter(item => item.selected).length})
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
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 50, // 固定寬度，防止數字撐開
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
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
    backgroundColor: '#a0a0a0',
    padding: 8,
    borderRadius: 5,
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