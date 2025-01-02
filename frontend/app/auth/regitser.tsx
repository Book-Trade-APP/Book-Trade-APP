import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, Alert, ImageBackground } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { api } from "@/api/api";
import { asyncPost } from "@/utils/fetch";
import { AuthStackParamList } from "../navigation/type";
import { LoadingModal } from "../components/LoadingModal";
import { styles } from "../tabs/styles/register";

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  // 用戶輸入狀態
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");

  // 註冊處理函數
  const handleRegister = async () => {
    if (email === "" || username ==="" || password === "" || confirmPassword === "") {
        setErrorText("請輸入完整資料");
        return;
    }
    if (password !== confirmPassword) {
      setErrorText("密碼不相符");
      return;
    }
    try {
      setIsLoading(true);
      const respone = await asyncPost(api.register, {
        "email": email,
        "username": username,
        "password": password,
      })
      if (respone.status === 200) {
        Alert.alert("註冊成功");
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      } else if (respone.status === 400) {
        setErrorText("電子郵件格式不正確");
      } else if(respone.status === 409) {
        setErrorText("該電子郵件已被註冊");
      } else {
        setErrorText("伺服器異常");
      }
    } catch (error) {
      console.log("failed to register");
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
          <View style={styles.logo}>
            <Text style={styles.logoText}>註冊</Text>
          </View>

          <View>
            <TextInput
              style={styles.input}
              placeholder="電子郵件"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="使用者名稱"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="密碼"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="確認密碼"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>建立帳號</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.errorText}>{errorText}</Text>
          <View style={styles.loginContainer}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.login} onPress={() => navigation.navigate('Login')}>返回登入</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
      <LoadingModal isLoading={isLoading} message="註冊中..." />
    </>
  );
}