import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { api } from "../../api/api";
import { asyncPost } from "../../utils/fetch";
export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp<any>>();

  // 用戶輸入狀態
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 註冊處理函數
  const handleRegister = async () => {
    if (email === "" || username ==="" || password === "" || confirmPassword === "") {
        Alert.alert("請輸入完整資料");
        return;
    }
    if (password !== confirmPassword) {
      Alert.alert("密碼不相符");
      return;
    }
    const respone = await asyncPost(api.register, {
      "email": email,
      "username": username,
      "password": password,
    })
    if (respone.status === 200) {
      Alert.alert("註冊成功")
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } else {
      Alert.alert("Server error")
    }
  };

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
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
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