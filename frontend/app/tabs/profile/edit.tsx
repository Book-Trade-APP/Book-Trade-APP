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
          contentContainerStyle={{ paddingVertical: 8 }}
          ListEmptyComponent={
            <Text style={styles.footerText}>沒有更多商品了</Text>
          }
          renderItem={({ item }: { item: Product }) => (
            <TouchableOpacity 
              style={styles.itemContainer} 
              onPress={() => {
                navigation.navigate("Seller", { product: item });
              }}
            >
              <Image 
                style={styles.itemImage} 
                source={{ uri: item.photouri }}
              />
              <View style={styles.itemInfo}>
                <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.author} numberOfLines={1}>{item.author}</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>${item.price}</Text>
              </View>
            </TouchableOpacity>
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
  itemImage: {
    width: 100,
    height: 100,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  itemInfo: {
    flex: 1,
    paddingVertical: 4,
    justifyContent: 'space-between',
    height: 80,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  priceContainer: {
    minWidth: 70,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: 8,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF4757',
    textAlign: 'right',
  },
  footerText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
  }
});