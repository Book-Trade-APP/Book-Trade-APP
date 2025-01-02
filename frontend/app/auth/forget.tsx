import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Text, TextInput, View, TouchableOpacity, ImageBackground, Alert } from "react-native";
import { AuthStackParamList } from "../navigation/type";
import { asyncPost } from "@/utils/fetch";
import { api } from "@/api/api";
import { LoadingModal } from "../components/LoadingModal";
import { styles } from "../tabs/styles/forget";

export default function ForgetScreen() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string>("");
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
    const SendNotification = async (userId: string) => {
      await asyncPost(api.UserSendNotification, {
        "user_id": userId,
        "title": "系統提醒",
        "message": "請立即更新您的密碼！"
      })
    }
    const handleSendEmail = async () => {
      if (email.length !== 0){
        try {
          setIsLoading(true);
          const response = await asyncPost(api.forget, {
            "email": email
          })
          if (response.status === 200) {
            await SendNotification(response.data.body);
            Alert.alert("成功", "臨時密碼已寄送至電子信箱");
            navigation.navigate('Login');
          } else if (response.status === 404) {
            setErrorText("找不到該用戶");
          } else {
            setErrorText("伺服器異常");
          }
        } catch (error) {
          console.log("failed to send code to email");
        } finally {
          setIsLoading(false);
        }
      }
      else {
        setErrorText("請輸入電子郵件");
      }
    }
    return (
      <>
        <ImageBackground 
          source={require('@/assets/Auth-Background.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.container}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>忘記密碼?</Text>
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
              <TouchableOpacity style={styles.loginButton} onPress={handleSendEmail}>
                <Text style={styles.loginButtonText}>寄送臨時碼</Text>
              </TouchableOpacity>
              <Text style={styles.errorText}>{errorText}</Text>
              <View style={styles.bottom}>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.signupLink} onPress={() => navigation.navigate('Login')}>返回登入</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.signupLink} onPress={() => navigation.navigate('Register')}>註冊帳號</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>
        <LoadingModal isLoading={isLoading} message={"正在寄送臨時密碼..."} />
      </>
    );
}