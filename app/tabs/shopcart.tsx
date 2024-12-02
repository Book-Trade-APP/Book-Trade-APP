import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import CheckBox from 'react-native-check-box';
import { fake_cartItems } from '../data/fakeCartItem';
import { CartItem } from '../interface/CartItem';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MainTabParamList } from '../navigation/type';

export default function ShoppingCartScreen() {
  const [cartItems, setCartItems] = useState(fake_cartItems);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProp<MainTabParamList>>();
  const handleToggleSelection = (id: number): void => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      );
      // 檢查是否所有項目被選中
      const allSelected = updatedItems.every(item => item.selected);
      setSelectAll(allSelected);
      return updatedItems;
    });
  };

  const handleToggleSelectAll = (): void => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setCartItems(prevItems =>
      prevItems.map(item => ({ ...item, selected: newSelectAll }))
    );
  };

  const handleIncreaseQuantity = (id: number): void => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };
  const handleDecreaseQuantity = (id: number): void => {
    setCartItems(prevItems =>
      prevItems
        .map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 } // 直接減少數量
            : item
        )
        .filter(item => item.quantity > 0) // 過濾掉數量為 0 的項目
    );
  };

  const calculateTotal = (): number => {
    return cartItems
      .filter(item => item.selected)
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>購物車</Text>

      <FlatList
        data={cartItems} // 資料來源
        keyExtractor={(item: CartItem) => item.id.toString()}
        ListFooterComponent={
          <Text style={styles.footerText}>沒有更多商品了</Text>
        }
        renderItem={({ item }: { item: CartItem }) => (
          <View style={styles.itemContainer}>
            <CheckBox
              style={styles.checkbox}
              isChecked={item.selected}
              onClick={() => handleToggleSelection(item.id)}
            />
            <Image style={styles.itemImage} source={item.image} />
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
              <Text style={styles.title}>{item.title}</Text>
              <Text>{`$${item.price}`}</Text>
            </TouchableOpacity>
            <View style={styles.quantityControl}>
              <TouchableOpacity
                onPress={() => handleDecreaseQuantity(item.id)}
                style={styles.quantityButton}
              >
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity
                onPress={() => handleIncreaseQuantity(item.id)}
                style={styles.quantityButton}
              >
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
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
        <TouchableOpacity style={styles.checkoutButton}>
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
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  quantityButton: {
    backgroundColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 30, // 固定寬度，防止數字撐開
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