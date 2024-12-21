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
          data={favoriteList} // 收藏商品详情列表
          keyExtractor={(item: Product, index) => item.id || index.toString()} // 使用商品 ID 或索引作为 key
          ListFooterComponent={
            <Text style={styles.footerText}>沒有其他收藏商品了</Text>
          }
          renderItem={({ item }: { item: Product }) => (
            <View style={styles.itemContainer}>
              <Image style={styles.itemImage} source={{ uri: item.photouri }} />
              <TouchableOpacity 
                style={styles.itemInfo} 
                onPress={() => {
                  navigation.navigate('Home' as keyof MainTabParamList, {
                    screen: 'Product',
                    params: { productId: item._id, source: 'Favorite' }
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
    marginTop: 15,
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
  footerText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 10,
    fontSize: 14,
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
    width: 50,
  },
});
