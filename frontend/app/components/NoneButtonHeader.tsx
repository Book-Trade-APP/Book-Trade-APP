import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type HeaderProps = {
    title: string; // (e.g., "修改個人訊息")
    back: () => void; 
}
export const Headers: React.FC<HeaderProps> = ({ title, back }) => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={back} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={28} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        position: "relative", 
    },
    backButton: {
        zIndex: 1, // 確保按鈕可點擊
    },
    title: {
        position: "absolute", // 絕對定位
        left: 0, // 讓文字開始時水平居中
        right: 0,
        textAlign: "center", // 水平居中
        fontSize: 18,
        fontWeight: "bold",
    },
});