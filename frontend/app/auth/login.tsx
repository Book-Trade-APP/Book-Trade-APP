import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import axios from 'axios';

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const handleLogin = () => {
  //   navigation.reset({ routes: [{ name: "Main" }] });
  // }
  //http://自己的ip:8000/login

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.252.9:8000/login', {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        // 登入成功
        Alert.alert('成功', response.data.message);
        navigation.navigate('Main'); // 跳轉到主頁面
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Axios 錯誤
        if (error.response) {
          if (error.response.status === 404) {
            Alert.alert('錯誤', '帳戶不存在');
          } else if (error.response.status === 401) {
            Alert.alert('錯誤', '帳號/密碼錯誤');
          } else {
            Alert.alert('錯誤', '伺服器錯誤，請稍後再試');
          }
        } else {
          Alert.alert('錯誤', '無法連接到伺服器');
        }
      } else {
        // 其他錯誤
        Alert.alert('錯誤', '發生未知錯誤');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>登入</Text>
      </View>
      <View>
        <TextInput
          style={styles.input}
          placeholder="電子郵件"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="密碼"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>登入</Text>
        </TouchableOpacity>
        <View style={styles.bottom}>
          <TouchableOpacity style={styles.registerButton}>
            <Text style={styles.signupLink} onPress={() => navigation.navigate('Loading')}>忘記密碼?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.registerButton}>
            <Text style={styles.signupLink} onPress={() => navigation.navigate('Register')}>註冊帳號</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginBottom: 40,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  form: {
    width: '80%',
    alignItems: 'center',
  },
  input: {
    width: 200,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    width: 200,
    height: 50,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupLink: {
    color: '#4CAF50',
    marginTop: 10,
  },
  registerButton: {
    justifyContent: 'center',
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});