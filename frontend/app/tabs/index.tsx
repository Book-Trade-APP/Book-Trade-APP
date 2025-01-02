import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, FlatList, Image, 
  Dimensions, TouchableOpacity, Alert, Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { Product } from '../interface/Product';
import { HomeStackParamList } from '../navigation/type';
import { api } from '../../api/api';
import { getUserId } from '../../utils/stroage';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [showCategoryFilter, setShowCategoryFilter] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    '文學小說', '自然科普', '哲學宗教', '人文史地',
    '社會科學', '藝術設計', '商業理財', '語言學習',
    '醫療保健', '旅遊休閒', '電腦資訊', '考試用書',
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(api.GetAllProducts);
      const data = await response.json();
      const userId = await getUserId();

      if (data.code === 200) {
        const availableProducts = data.body.filter((product: Product) =>
          product.quantity > 0
        );
        setProducts(availableProducts);
        setFilteredProducts(availableProducts);
      } else {
        Alert.alert('錯誤', data.message || '無法獲取商品數據');
      }
    } catch (error) {
      Alert.alert('錯誤', '無法連接到伺服器');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProducts();
    }, [])
  );

  const handleSearch = (text: string) => {
    setSearchText(text);
    filterProducts(text, selectedCategory);
  };
  
  const handleCategorySelect = (category: string) => {
    const newCategory = category === selectedCategory ? null : category;
    setSelectedCategory(newCategory);
    filterProducts(searchText, newCategory); // 添加這行來更新篩選結果
  };

  const filterProducts = (text: string, category: string | null) => {
    let result = products;
    if (text.trim()) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(text.toLowerCase())
      );
    }
    if (category) {
      result = result.filter((product) => product.category === category);
    }
    setFilteredProducts(result);
  };

  const clearSearch = () => {
    setSearchText('');
    setSelectedCategory(null);
    setFilteredProducts(products);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productContainer}
      onPress={() =>
        navigation.navigate('Product', { productId: item._id, source: 'Home' })
      }
    >
      <Image source={{ uri: item.photouri }} style={styles.productImage} />
      <View style={styles.detailContainer}>
        <Text style={styles.productTitle} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.author} numberOfLines={1}>{item.author}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
  <>
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <Ionicons style={styles.searchImg} name="search-outline" size={20} />
          {selectedCategory && (
            <View style={styles.categoryLabel}>
              <Text style={styles.categoryLabelText}>[{selectedCategory}]</Text>
            </View>
          )}
          <TextInput
            style={[styles.search, selectedCategory && styles.searchWithCategory]}
            placeholder="搜尋商品"
            value={searchText}
            onChangeText={handleSearch}
            onFocus={() => setShowCategoryFilter(true)}
            onBlur={() => setShowCategoryFilter(false)}
          />
          {(searchText || selectedCategory) && (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons name="close-circle" size={20} color="gray" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {showCategoryFilter && (
        <View style={styles.categoryContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategoryButton,
              ]}
              onPress={() => handleCategorySelect(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <Text style={styles.footerText}>沒有更多商品了</Text>
        }
        onRefresh={fetchProducts}
        refreshing={loading}
      />
    </SafeAreaView>
  </>
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
  categoryContainer: {
    borderRadius: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    margin: 5,
  },
  categoryLabel: {
    borderRadius: 5,
    height: 25
  },
  categoryLabelText: {
    fontSize: 14,
    color: '#222',
    fontWeight: 'bold',
  },
  searchWithCategory: {
    marginLeft: 8, // 動態為類別文字留出間距
  },
  selectedCategoryButton: {
    backgroundColor: '#007BFF',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  selectedCategoryText: {
    color: '#fff',
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
    width: width - 20,
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
    maxWidth: 260,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  author: {
    maxWidth: 260,
    fontSize: 12,
    paddingBottom: 10,
    color: '#777',
  },
  productPrice: {
    fontSize: 16,
    color: 'red',
  },
  footerText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 10,
    fontSize: 14,
  },
});
