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

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const validateInputs = () => {
    // 檢查是否有空欄位
    if (email === "" || username === "" || password === "" || confirmPassword === "") {
      setErrorText("請輸入完整資料");
      return false;
    }

    // 驗證使用者名稱長度
    if (username.length < 6 || username.length > 12) {
      setErrorText("使用者名稱長度必須為 6-12 字元");
      return false;
    }

    // 驗證密碼規則
    if (password.length < 8 || password.length > 20) {
      setErrorText("密碼長度必須為 8-20 字元");
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      setErrorText("密碼必須包含至少一個大寫字母");
      return false;
    }

    // 確認密碼是否相符
    if (password !== confirmPassword) {
      setErrorText("密碼不相符");
      return false;
    }

    return true;
  };
  const handleRegister = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      setIsLoading(true);
      const respone = await asyncPost(api.register, {
        email,
        username,
        password,
      });
      if (respone.status === 200) {
        await asyncPost(api.UserSendNotification, {
          "user_id": respone.data.body,
          "title": "公告",
          "message": `${username}您好，歡迎加入二手書交易平台！`
        })
        Alert.alert("註冊成功");
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      } else if (respone.status === 400) {
        setErrorText("電子郵件格式不正確");
      } else if (respone.status === 409) {
        setErrorText("該電子郵件已被註冊");
      } else {
        setErrorText("伺服器異常");
      }
    } catch (error) {
      console.log("failed to register");
      setErrorText("註冊失敗，請稍後再試");
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