import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { MainTabParamList } from "../../navigation/type";
export default function CheckoutSuccessScreen() {
    const MainNavigation = useNavigation<NavigationProp<MainTabParamList>>();
    const handleGoOrderPages = () => {
      MainNavigation.reset({ routes: [{ name: "Home" }] });
      MainNavigation.navigate('Profile', { 
        screen: 'OrderStatus',
        params: { status: "待處理" }
      });
    }
    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.content}>
            {/* 結帳成功圖示 */}
            <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/190/190411.png" }}
            style={styles.successIcon}
            />
            {/* 成功訊息 */}
            <Text style={styles.successText}>結帳成功！</Text>
            <Text style={styles.subText}>感謝您的購買，我們將盡快處理您的訂單。</Text>

            {/* 按鈕 */}
            <TouchableOpacity
            style={styles.button}
            onPress={() => MainNavigation.reset({ routes: [{ name: "Home" }] })} // 返回首頁並置頂
            >
            <Text style={styles.buttonText}>返回首頁</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleGoOrderPages}
            >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>查看訂單</Text>
            </TouchableOpacity>
        </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  successIcon: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  successText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderColor: "#4CAF50",
    borderWidth: 1,
  },
  secondaryButtonText: {
    color: "#4CAF50",
  },
});
