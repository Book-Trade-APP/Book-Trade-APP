import { Text, View, TextInput, TouchableOpacity, ImageBackground, } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { api } from '@/api/api';
import { asyncPost } from '@/utils/fetch';
import { AuthStackParamList, RootStackParamList } from '../navigation/type';
import { saveUserId } from '@/utils/stroage';
import { LoadingModal } from '../components/LoadingModal';
import { styles } from '../tabs/styles/login';

export default function LoginScreen() {
  const AuthNavigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const RootNavigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const handleLogin = async () => {
    if (email === "" || password === "") {
      setErrorText("請輸入帳號或密碼");
      return;
    }
    try {
      setIsLoading(true);
      const response = await asyncPost(api.login, {
        "email": email,
        "password": password
      })
      if (response.status === 200) {
        saveUserId(response.data.body._id);
        RootNavigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      } else if (response.status === 401 || response.status === 404){
        setErrorText("帳號或密碼錯誤");
      } else {
        setErrorText("伺服器異常");
      }
    } catch (error) {
      console.log("failed to login");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <ImageBackground 
        source={require('@/assets/Auth-Background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.container}>
            <Text style={styles.logoText}>登入</Text>
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
            <Text style={styles.errorText}>{errorText}</Text>
            <View style={styles.bottom}>
              <TouchableOpacity style={styles.Button}>
                <Text style={styles.signupLink} onPress={() => AuthNavigation.navigate('Forget')}>忘記密碼?</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.Button}>
                <Text style={styles.signupLink} onPress={() => AuthNavigation.navigate('Register')}>註冊帳號</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
      <LoadingModal isLoading={isLoading} message={"登入中..."} />
    </>
  );
}