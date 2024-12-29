import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Headers } from '../../components/NoneButtonHeader';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useHideTabBar } from '../../hook/HideTabBar';
import { useEffect, useState } from 'react';
import { MainTabParamList, ProfileStackParamList } from '../../navigation/type';
import { Product } from '../../interface/Product';
import { getUserId } from '../../../utils/stroage';
import { asyncGet, asyncPost } from '../../../utils/fetch';
import { api } from '../../../api/api';
import { LoadingModal } from '../../components/LoadingModal';
import React from 'react';

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
          keyExtractor={(item: Product, index) => item.id || index.toString()}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    paddingTop: 12,
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
  footerText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
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
    justifyContent: 'space-between',
    height: 80,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    lineHeight: 18,
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
});
