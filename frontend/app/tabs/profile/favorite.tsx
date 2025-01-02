import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Headers } from '@/app/components/NoneButtonHeader';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useHideTabBar } from '@/app/hook/HideTabBar';
import React, { useEffect, useState } from 'react';
import { MainTabParamList, ProfileStackParamList } from '@/app/navigation/type';
import { Product } from '@/app/interface/Product';
import { getUserId } from '@/utils/stroage';
import { asyncGet, asyncPost } from '@/utils/fetch';
import { api } from '@/api/api';
import { LoadingModal } from '@/app/components/LoadingModal';
import { styles } from '../styles/favorite';

export default function FavoriteScreen() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [favoriteList, setFavoriteList] = useState<Product[]>([]);
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();

  const initializeUserId = async () => {
    const id = await getUserId();
    setUserId(id);
  };

  const getFavoritesList = async () => {
    if (!userId) return;
    try {
      setIsLoading(true)
      const response = await asyncPost(api.GetFavoriteList, {
        "user_id": userId,
      });

      if (response.status === 200 && Array.isArray(response.data.body)) {
        const favoriteIds: string[] = response.data.body;
        await findProductDetails(favoriteIds);
        setIsLoading(false)
      } else if (response.status === 404){
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const findProductDetails = async (favoriteIds: string[]) => {
    const productDetails: Product[] = [];
    try {
      for (const productId of favoriteIds) {
        const response = await asyncGet(`${api.GetOneProduct}?product_id=${productId}`); 
        if (response.code === 200) {
          productDetails.push(response.body);
        }
      }
      setFavoriteList(productDetails); // 更新收藏商品列表
      // console.log(productDetails)
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  useEffect(() => {
    initializeUserId();
  }, []);

  useEffect(() => {
    getFavoritesList();
  }, [userId]);

  const handleGoBack = () => {
    navigation.reset({
      routes: [{ name: 'Index' }],
    });
  };

  useHideTabBar();

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Headers title="收藏庫" back={handleGoBack} />
        <FlatList
          data={favoriteList}
          contentContainerStyle={styles.list}
          keyExtractor={(item: Product, index) => item._id || index.toString()}
          ListEmptyComponent={
            <Text style={styles.footerText}>沒有更多商品了</Text>
          }
          renderItem={({ item }: { item: Product }) => (
            <TouchableOpacity 
              style={styles.itemContainer} 
              onPress={() => {
                navigation.navigate('Home' as keyof MainTabParamList, {
                  screen: 'Product',
                  params: { productId: item._id, source: 'Favorite' }
                } as any);
              }}
            >
              <Image style={styles.itemImage} source={{ uri: item.photouri }} />
              <View style={styles.itemInfo}>
                <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.author} numberOfLines={1}>{item.author}</Text>
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.priceText}>${item.price}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
      <LoadingModal 
          isLoading={isLoading} 
          message="正在載入收藏庫..." 
      />
    </>
  );
}

