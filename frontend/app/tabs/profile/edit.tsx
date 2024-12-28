import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Headers } from '../../components/NoneButtonHeader';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useHideTabBar } from '../../hook/HideTabBar';
import { useEffect, useState } from 'react';
import { Product } from '../../interface/Product';
import { ProfileStackParamList } from '../../navigation/type';
import { asyncGet, asyncPost } from '../../../utils/fetch';
import { api } from '../../../api/api';
import { getUserId } from '../../../utils/stroage';
import { LoadingModal } from '../../components/LoadingModal';
import React from 'react';
export default function EditScreen() {
  useEffect (() => {
    getSellerProducts();
  }, [])
  const getSellerProducts = async () => {
    setIsLoading(true);
    try {
      // 獲取賣家的商品 ID 列表
      const response = await asyncPost(api.GetSellerProducts, {
        "seller_id": await getUserId(),
      });
      
      if (response.data?.body) {
        // 使用 Promise.all 同時獲取所有商品詳細信息
        const productDetails = await Promise.all(
          response.data.body.map(async (productId: string) => {
            try {
              const productResponse = await asyncGet(
                `${api.GetOneProduct}?product_id=${productId}`
              );
              return productResponse.body;
            } catch (error) {
              console.log(`Failed to fetch product ${productId}:`, error);
              return null;
            }
          })
        );

        // 過濾掉獲取失敗的商品（null值）
        const validProducts = productDetails.filter((product): product is Product => 
          product !== null
        );
        
        setEditItems(validProducts);
      }
    } catch (error) {
      console.log("Failed to get seller products:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const [editItems, setEditItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();
  useHideTabBar()
  return (
    <>
      <SafeAreaView style={styles.container}>
        <Headers title='修改商品' back={() => navigation.goBack()} />
        <FlatList
          data={editItems}
          keyExtractor={(item: Product) => item._id.toString()}
          ListFooterComponent={
            editItems.length > 0 ? (
              <Text style={styles.footerText}>沒有更多商品了</Text>
            ) : null
          }
          renderItem={({ item }: { item: Product }) => (
            <View style={styles.itemContainer}>
              <Image 
                style={styles.itemImage} 
                source={{ uri: item.photouri }}
              />
              <TouchableOpacity 
                style={styles.itemInfo} 
                onPress={() => {
                  navigation.navigate("Seller", { product: item });
                }}
              >
                <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
                <Text numberOfLines={1}>{item.author}</Text>
              </TouchableOpacity>
              <View>
                <Text style={styles.priceText}>{`$${item.price}`}</Text>
              </View>
            </View>
          )}
          refreshing={isLoading}
          onRefresh={getSellerProducts}
        />
      </SafeAreaView>
      <LoadingModal 
        isLoading={isLoading && editItems.length === 0} 
        message="正在載入商品..."
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  footerText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 10,
    fontSize: 14,
  },
});