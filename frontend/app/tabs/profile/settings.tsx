import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Button, TextInput} from 'react-native';
import { Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useHideTabBar } from '../../hook/HideTabBar';

export default function SettingScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null); 

  const handleFieldPress = (field: string) => {
    setSelectedField(field);
    setModalVisible(true);
  };

  const handleSave = () => {
    // 保存邏輯
    setModalVisible(false);
  };
  const closeModal = () => {
    setModalVisible(false);
  }
  const handleSaveAll = () => {
    // 保存所有更改
    navigation.goBack();
  };
  useHideTabBar();
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={28} />
        </TouchableOpacity>
        <Text style={styles.title}>修改個人訊息</Text>
        <TouchableOpacity onPress={handleSaveAll}>
          <Text style={styles.saveText}>儲存</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Picture Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity style={styles.avatarButton}>
          <Image
            style={styles.avatar}
            source={require("../../../assets/Chiikawa.jpg")}
          />
          <Text style={styles.editText}>編輯</Text>
        </TouchableOpacity>
      </View>

      {/* Info List */}
      <View style={styles.infoList}>
        {[
          { label: "名稱", key: "name" },
          { label: "簡介", key: "intro" },
          { label: "性別", key: "sex" },
          { label: "生日", key: "birthday" },
          { label: "手機號碼", key: "phone" },
          { label: "Email", key: "email" },
        ].map((item) => (
          <TouchableOpacity 
            key={item.key} 
            style={styles.infoRow} 
            onPress={() => handleFieldPress(item.label)}
          >
            <Text style={styles.infoLabel}>{item.label}</Text>
            <Text style={styles.infoAction}>立刻設定</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal for editing field (optional, you can implement later) */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
         <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{selectedField ? `修改${selectedField}` : '修改資訊'}</Text>
            <TextInput 
              style={styles.modalTextInput}
              placeholder={`輸入新的${selectedField}`}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={handleSave}>
                <Text style={styles.modalButtonText}>儲存</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>取消</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  saveText: {
    color: "#007bff",
    fontSize: 16,
  },
  profileSection: {
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 20,
    marginTop: 10,
  },
  avatarButton: {
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f0f0",
  },
  editText: {
    marginTop: 8,
    fontSize: 14,
    color: "#007bff",
  },
  infoList: {
    marginTop: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  infoLabel: {
    fontSize: 16,
  },
  infoAction: {
    color: "#007bff",
    fontSize: 14,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明背景
  },
  modalContainer: {
    width: 320,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
    elevation: 10, // 提升卡片效果
    shadowColor: '#000', // 添加陰影
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalTextInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    flex: 1,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});