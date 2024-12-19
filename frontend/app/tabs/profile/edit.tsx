import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Headers } from '../../components/NoneButtonHeader';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useHideTabBar } from '../../hook/HideTabBar';
import { fake_editItems } from '../../data/fakeEditItem';
import { useState } from 'react';
import { Product } from '../../interface/Product';
import { ProfileStackParamList } from '../../navigation/type';
export default function EditScreen() {
  const [editItems, setEditItems] = useState(fake_editItems);
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();
  useHideTabBar()
  return (
    <SafeAreaView style={styles.container}>
      <Headers title='修改商品' back={() => navigation.goBack()} />
      <FlatList
        data={editItems} // 資料來源
        keyExtractor={(item: Product) => item.id.toString()}
        ListFooterComponent={
          <Text style={styles.footerText}>沒有更多商品了</Text>
        }
        renderItem={({ item }: { item: Product }) => (
          <View style={styles.itemContainer}>
            <Image style={styles.itemImage} source={item.photouri} />
            <TouchableOpacity 
              style={styles.itemInfo} 
              onPress={() => {
                // 使用類型斷言解決類型不兼容問題
                navigation.navigate("Seller", {product: item});
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
    </SafeAreaView>
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