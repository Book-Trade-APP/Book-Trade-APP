import { View, Text, StyleSheet, TextInput, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../interface/Product';
import { fake_products } from '../data/fakeProudctList';
import { useState } from 'react';

// 獲取螢幕寬高
const { width } = Dimensions.get('window');
export default function HomeScreen() {
  const [searchText, setSearchText] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(fake_products);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredProducts(fake_products);
    } else {
      setFilteredProducts(fake_products.filter((product) =>
        product.title.toLowerCase().includes(text.toLowerCase())
      ));
    }
  };
  const clearSearch = () => {
    setSearchText('');
    setFilteredProducts(fake_products);
  };
  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.productContainer}>
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.detailContainer}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 搜索框 */}
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <Ionicons style={styles.searchImg} name="search-outline" size={20} />
          <TextInput
            style={styles.search}
            placeholder="搜尋商品"
            value={searchText}
            onChangeText={handleSearch}
          />
          {searchText ? (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons name="close-circle" size={20} color="gray" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* 商品列表 */}
      <FlatList
        data={fake_products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <Text style={styles.footerText}>沒有更多商品了</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    width: '90%',
    paddingHorizontal: 10,
  },
  searchImg: {
    marginRight: 8,
  },
  search: {
    flex: 1,
    height: 40,
  },
  content: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    width: width - 20, // 寬度與螢幕一致
    alignSelf: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
  detailContainer: {
    flexDirection: 'column',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: 'red',
  },
  footerText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 10,
    fontSize: 14,
  },
});