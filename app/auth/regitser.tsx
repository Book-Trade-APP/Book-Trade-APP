import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios"; // 引入 axios 用於 API 請求

export default function RegisterScreen() {
  const navigation = useNavigation();

  // 用戶輸入狀態
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 註冊處理函數
  // const handleRegister = async () => {
  //   if (!email || !username || !password || !confirmPassword) {
  //     Alert.alert("錯誤", "請填寫所有欄位");
  //     return;
  //   }

  //   if (password !== confirmPassword) {
  //     Alert.alert("錯誤", "密碼與確認密碼不一致");
  //     return;
  //   }

  //   try {
  //     // 發送 POST 請求到後端 http://自己的ip:8000/register
  //     const response = await axios.post("http://192.168.106.98:8000/register", { 
  //       email: email,
  //       username: username,
  //       password: password,
  //     });

  //     if (response.status === 201) {
  //       Alert.alert("成功", "註冊成功！");
  //       navigation.goBack(); // 返回登入頁面
  //     }
  //   } catch (error) {
  //       if (axios.isAxiosError(error)) {
  //         // Axios 錯誤
  //         if (error.response) {
  //           if (error.response.status === 409) {
  //             Alert.alert('錯誤', '帳戶已存在');
  //           } else {
  //             Alert.alert('錯誤', '伺服器錯誤，請稍後再試');
  //           }
  //         } else {
  //           Alert.alert('錯誤', '無法連接到伺服器');
  //         }
  //       } else {
  //         // 其他錯誤
  //         Alert.alert('錯誤', '發生未知錯誤');
  //       }
  //     }
  //   };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>返回</Text>
      </TouchableOpacity>
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
        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.registerButtonText}>建立帳號</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    marginBottom: 40,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    width: 200,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  registerButton: {
    backgroundColor: "#4CAF50",
    width: 200,
    height: 50,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
});