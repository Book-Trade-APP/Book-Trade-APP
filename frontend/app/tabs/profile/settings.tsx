import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, TextInput, AlertButton } from 'react-native';
import { Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useHideTabBar } from '@/app/hook/HideTabBar';
import * as ImagePicker from "expo-image-picker";
import { LoadingModal } from '@/app/components/LoadingModal';
import { getUserId } from '@/utils/stroage';
import { asyncGet, asyncPost, uploadImage } from '@/utils/fetch';
import { api } from '@/api/api';
import { styles } from "../styles/settings";

export default function SettingScreen() {
  const navigation = useNavigation<NavigationProp<any>>();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState<{ label: string; key: string } | null>(null);
  const [modalValue, setModalValue] = useState<string | Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userPhotoUri, setUserPhotoUri] = useState<string | null>(null);
  const [oldPhotoUri, setOldPhotoUri] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passwordErrorText, setPasswordErrorText] = useState<string>("");
  const [userData, setUserData] = useState({
    _id: "",
    userName: "",
    info: "",
    gender: "",
    birthday: "",
    phone: "",
    email: "",
    password: "",
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const fields = [
    { label: "名稱", key: "userName" },
    { label: "簡介", key: "info" },
    { label: "性別", key: "gender" },
    { label: "生日", key: "birthday" },
    { label: "手機號碼", key: "phone" },
    { label: "Email", key: "email" },
  ] as const;

  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        const id = await getUserId();
        const user = await asyncGet(`${api.find}?_id=${id}`);
        setUserData({
          _id: user.body._id,
          userName: user.body.username,
          info: user.body.info,
          gender: user.body.gender,
          birthday: user.body.birthday,
          phone: user.body.phone,
          email: user.body.email,
          password: user.body.password,
        });
        setUserPhotoUri(user.body.headshot);
        setOldPhotoUri(user.body.headshot);
      } catch (error) {
        console.error("Failed to fetch user information:", error);
      }
    };
    fetchUserInformation();
  }, []);
    const handleAddPhoto = async () => {
      const options: AlertButton[] = [
        {
          text: '拍攝照片',
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status === 'granted') {
              const result = await ImagePicker.launchCameraAsync({
                mediaTypes: "images",
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
              });
              if (!result.canceled) {
                setUserPhotoUri(result.assets[0].uri);
              }
            } else {
              Alert.alert('權限不足', '請允許相機權限以拍攝照片');
            }
          },
        },
        {
          text: '從相簿選取',
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status === 'granted') {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: "images",
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
              });
              if (!result.canceled) {
                setUserPhotoUri(result.assets[0].uri);
              }
            } else {
              Alert.alert('權限不足', '請允許相簿權限以選取照片');
            }
          },
        },
        { text: '取消', style: 'cancel' },
      ];
      Alert.alert('新增照片', '請選擇照片來源', options);
    };
  const handleFieldPress = (field: typeof fields[number]) => {
    setSelectedField(field);
    if (field.key === 'birthday') {
      setShowDatePicker(true);
      setModalValue(userData.birthday ? new Date(userData.birthday) : new Date());
    } else {
      setModalValue(userData[field.key as keyof typeof userData] || "");
      setModalVisible(true);
    }
  };

  const handleSave = () => {
    if (!selectedField) return;
    setUserData(prevData => ({
      ...prevData,
      [selectedField.key]: modalValue instanceof Date
        ? modalValue.toISOString().split('T')[0]
        : modalValue
    }));
    setModalVisible(false);
  };

  const handleDateChange = (_: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setUserData(prevData => ({
        ...prevData,
        birthday: selectedDate.toISOString().split('T')[0]
      }));
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const handlePasswordChange = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordErrorText('請填寫所有密碼欄位');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordErrorText('新密碼與確認密碼不符');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordErrorText('新密碼長度需至少6個字元');
      return;
    }

    if (passwordData.newPassword === passwordData.currentPassword) {
      setPasswordErrorText('新密碼與舊密碼相同');
      return;
    }

    handleUpdatePassword();
  };

  const handleUpdatePassword = async () => {
    try {
      setIsLoading(true);
      const response = await asyncPost(api.updatePassword, {
        "user_id": userData._id,
        "password": passwordData.currentPassword,
        "new_password": passwordData.newPassword
      });

      if (response.status === 200) {
        Alert.alert('成功', '密碼已更新');
        setShowPasswordModal(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        setPasswordErrorText('輸入的舊密碼錯誤');
      }
    } catch (error) {
      console.error("Failed to update password:", error);
      Alert.alert('錯誤', '更新密碼時發生錯誤');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAll = async () => {
    try {
      setIsLoading(true);
      const image_url = oldPhotoUri === userPhotoUri
      ? userPhotoUri
      : await uploadImage(userData.userName, userPhotoUri as string);
      const response = await asyncPost(api.update, {
        "_id": userData._id,
        "username": userData.userName,
        "info": userData.info,
        "gender": userData.gender, 
        "birthday": userData.birthday,
        "phone": userData.phone,
        "email": userData.email,
        "password": userData.password,
        "headshot": image_url
      });
      if (response.status === 200) {
        setIsLoading(false);
        navigation.goBack();
      } else {
        throw new Error("回傳資料不正確");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Failed to save data:", error);
      Alert.alert("資料修改失敗", "請稍後再試");
    }
  };

  useHideTabBar();

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={28} />
          </TouchableOpacity>
          <Text style={styles.title}>修改個人訊息</Text>
          <TouchableOpacity onPress={handleSaveAll}>
            <Text style={styles.saveText}>儲存</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.avatarButton} onPress={handleAddPhoto}>
            {userPhotoUri ?
            <Image
              style={styles.avatar}
              source={{uri: userPhotoUri}}
            />
            :
            <Ionicons name="person-circle-outline" size={98} />
            }
            <Text style={styles.editText}>編輯</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoList}>
          {fields.map((field) => (
            <TouchableOpacity
              key={field.key}
              style={styles.infoRow}
              onPress={() => handleFieldPress(field)}
            >
              <Text style={styles.infoLabel}>{field.label}</Text>
              <Text style={styles.infoAction}>
                {field.key === "birthday" && userData[field.key]
                  ? new Date(userData[field.key]).toLocaleDateString()
                  : userData[field.key as keyof typeof userData] || "立刻設定"}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => setShowPasswordModal(true)}
          >
            <Text style={styles.infoLabel}>密碼</Text>
            <Text style={styles.infoAction}>修改</Text>
          </TouchableOpacity>
          <Modal
          visible={showPasswordModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowPasswordModal(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>修改密碼</Text>
              
              <TextInput
                style={styles.modalTextInput}
                value={passwordData.currentPassword}
                onChangeText={(text) => setPasswordData(prev => ({ ...prev, currentPassword: text }))}
                placeholder="目前密碼"
                secureTextEntry
              />
              
              <TextInput
                style={styles.modalTextInput}
                value={passwordData.newPassword}
                onChangeText={(text) => setPasswordData(prev => ({ ...prev, newPassword: text }))}
                placeholder="新密碼"
                secureTextEntry
              />
              
              <TextInput
                style={styles.modalTextInput}
                value={passwordData.confirmPassword}
                onChangeText={(text) => setPasswordData(prev => ({ ...prev, confirmPassword: text }))}
                placeholder="確認新密碼"
                secureTextEntry
              />
              <Text style={styles.errorText}>{passwordErrorText}</Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity 
                  style={styles.modalButton} 
                  onPress={() => {
                    setShowPasswordModal(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                  }}
                >
                  <Text style={styles.modalButtonText}>取消</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.modalButton}
                  onPress={handlePasswordChange}
                >
                  <Text style={styles.modalButtonText}>確認</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={modalValue instanceof Date ? modalValue : new Date()}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
          />
        )}

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>
                {selectedField ? `修改${selectedField.label}` : ''}
              </Text>
              {selectedField?.key === 'gender' ? (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={modalValue as string}
                    onValueChange={(itemValue) => setModalValue(itemValue)}
                    style={styles.picker}
                  >
                    <Picker.Item label="請選擇性別" enabled={false}/>
                    <Picker.Item label="男" value="男" />
                    <Picker.Item label="女" value="女" />
                  </Picker>
                </View>
              ) : (
                <TextInput
                  style={styles.modalTextInput}
                  value={modalValue as string}
                  onChangeText={setModalValue}
                  placeholder={selectedField ? `輸入新的${selectedField.label}` : ''}
                />
              )}
              <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                  <Text style={styles.modalButtonText}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={handleSave}>
                  <Text style={styles.modalButtonText}>儲存</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
      <LoadingModal isLoading={isLoading} message="資料更新中..." />
    </>
  );
}