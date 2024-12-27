import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { clearUserData } from '../../utils/stroage';
import { api } from '../../api/api';
import { asyncGet } from '../../utils/fetch';
import { getUserId } from '../../utils/stroage';
import { useEffect, useState } from 'react';
import React from 'react';
export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [userName, setUserName] = useState<string | null>();
  const [evaluate, setEvaluate] = useState<number>(0.0);
  const fetchUserInformation = async () => {
    try {
      const id = await getUserId();
      const user = await asyncGet(`${api.find}?_id=${id}`);
      setUserName(user.body.username);
      setEvaluate(user.body.evaluate);
    } catch (error) {
      console.error("Failed to fetch user information:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // 當頁面獲得焦點時執行
      fetchUserInformation();
    }, [])
  );

  const handle_logout = async () => {
    const logout_response = await clearUserData();
    if (logout_response) {
      navigation.navigate("Auth");
    } else {
      Alert.alert("伺服器發生錯誤");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>二手書交易平台</Text>
        </View>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.profileContainer}>
          <Ionicons name="person-circle-outline" size={50} color="black" />
          <View style={styles.profileInfo}>
            <Text style={styles.userId}>{userName ? userName : "Loading..."}</Text>
            <Text style={styles.rating}>{evaluate ? `⭐ ${evaluate}` : "Loading..."}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.headerIcons} onPress={() => navigation.navigate('Setting')}>
          <Ionicons name="settings-outline" size={24} color="black" style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.buttonWrapper} onPress={() => navigation.navigate('Favorite')}>
          <Ionicons name="bookmark-outline" size={24} color="black" />
          <Text style={styles.buttonText}>已收藏</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonWrapper} onPress={() => navigation.navigate('OrderStatus', { status: "待處理" })}>
          <Ionicons name="swap-horizontal-outline" size={24} color="black" />
          <Text style={styles.buttonText}>待交易</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonWrapper} onPress={() => navigation.navigate('OrderStatus', { status: "待評價" })}>
          <Ionicons name="star-outline" size={24} color="black" />
          <Text style={styles.buttonText}>待評價</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonWrapper} onPress={() => navigation.navigate('OrderStatus', { status: "已完成" })}>
          <Ionicons name="checkmark-done-outline" size={24} color="black" />
          <Text style={styles.buttonText}>已完成</Text>
        </TouchableOpacity>
      </View>

      {/* Options Section */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionRow} onPress={() => {navigation.navigate('Seller')}}>
          <Ionicons name="lock-closed-outline" size={24} color="black" style={styles.optionIcon} />
          <Text style={styles.optionText}>我是賣家</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow} onPress={() => navigation.navigate('Edit')}>
          <Ionicons name="create-outline" size={24} color="black" style={styles.optionIcon} />
          <Text style={styles.optionText}>編輯商品</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow} onPress={() => navigation.navigate('Report')}>
          <Ionicons name="mail-outline" size={24} color="black" style={styles.optionIcon} />
          <Text style={styles.optionText}>功能建議與問題回報</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Section */}
      <TouchableOpacity style={styles.footerContainer} onPress={() => handle_logout()}>
        <Ionicons name="log-out-outline" size={24} color="red" />
        <Text style={styles.footerText}>登出</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoContainer: {
    backgroundColor: '#1AAC50'
  },
  logoText: {
    textAlign: 'center',
    padding: 20,
    fontSize: 18,
    color: '#fff',
    fontWeight: '900'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 8,
  },
  userId: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rating: {
    fontSize: 14,
    color: '#777',
  },
  headerIcons: {
    flexDirection: 'row',
    marginRight: 10,
  },
  icon: {
    marginLeft: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  buttonWrapper: {
    alignItems: 'center',
  },
  buttonText: {
    marginTop: 8,
    fontSize: 12,
  },
  optionsContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  optionIcon: {
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  footerText: {
    marginLeft: 8,
    fontSize: 14,
    color: 'red',
  },
});
