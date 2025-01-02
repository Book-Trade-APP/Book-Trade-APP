import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { MainTabParamList } from "@/app/navigation/type";
import { styles } from "../styles/success";

export default function CheckoutSuccessScreen() {
    const MainNavigation = useNavigation<NavigationProp<MainTabParamList>>();
    const handleGoOrderPages = () => {
      MainNavigation.reset({ routes: [{ name: "Home" }] });
      MainNavigation.navigate('Profile', { 
        screen: 'OrderStatus',
        params: { status: "待確認" }
      });
    }
    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.content}>
            {/* 結帳成功圖示 */}
            <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/2644/2644923.png " }}
            style={styles.successIcon}
            />
            {/* 成功訊息 */}
            <Text style={styles.successText}>結帳成功</Text>
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
