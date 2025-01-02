import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Headers } from '@/app/components/NoneButtonHeader';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useHideTabBar } from '@/app/hook/HideTabBar';
import React, { useEffect, useState } from 'react';
import { Product } from '@/app/interface/Product';
import { ProfileStackParamList, RootStackParamList } from '@/app/navigation/type';
import { asyncGet, asyncPost } from '@/utils/fetch';
import { api } from '@/api/api';
import { getUserId } from '@/utils/stroage';
import { LoadingModal } from '@/app/components/LoadingModal';
import { styles } from '../styles/edit';
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
  const handleBack = () => {
    RootNavigation.reset({
      index: 0,
      routes: [
        { 
          name: 'Main',
          params: {
            screen: 'Profile',
            params: {
              screen: 'Index'
            }
          }
        }
      ]
    });
  };
  const [editItems, setEditItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const ProfileNavigation = useNavigation<NavigationProp<ProfileStackParamList>>();
  const RootNavigation = useNavigation<NavigationProp<RootStackParamList>>();
  useHideTabBar()
  return (
    <>
      <SafeAreaView style={styles.container}>
        <Headers title='修改商品' back={handleBack} />
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
                ProfileNavigation.navigate("Seller", { product: item });
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
