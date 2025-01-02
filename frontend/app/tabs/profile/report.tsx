import { View, StyleSheet, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useHideTabBar } from '../../hook/HideTabBar';
import { useNavigation } from '@react-navigation/native';
import { Headers } from '../../components/NoneButtonHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { asyncPost } from '../../../utils/fetch';
import { api } from '../../../api/api';
import { LoadingModal } from '../../components/LoadingModal';
import React from 'react';
export default function ReportScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errorText, setErrorText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigation = useNavigation();
  const sentErrorMessage = async () => {
    if (!title.trim() || !content.trim()) {
      setErrorText("請填寫所有欄位");
      return;
    }
    try {
      setIsLoading(true)
      const response = await asyncPost(api.report, {
        "subject": title,
        "content": content
      })
      console.log(response);
      if (response.status === 200) {
        Alert.alert("成功", "問題回報成功！");
        navigation.goBack();
      }
    } catch (error) {
      console.log("failed to report question to admin");
    } finally {
      setIsLoading(false);
    }
  }
  useHideTabBar();
  return (
    <>
      <SafeAreaView style={styles.container}>
        <Headers title="問題回報" back={() => navigation.goBack()} />
        <View style={styles.field}>
          <Text style={styles.title}>想對開發人員說的話</Text>
          <TextInput style={styles.input_title} placeholder='請輸入問題或建議' value={title} onChangeText={setTitle} />
          <TextInput style={styles.input_content} placeholder='詳細描述內容' multiline={true} value={content} onChangeText={setContent}/>
          <Text style={styles.errorText}>{errorText}</Text>
          <TouchableOpacity style={styles.sendButton} onPress={sentErrorMessage}>
            <Text style={styles.sendButtonText}>提交回報</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <LoadingModal isLoading={isLoading} message='問題回報中...'/>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  field: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  title: {
    color: "#000",
    paddingBottom: 30,
    fontWeight: 600,
    fontSize: 22
  },
  label: {
    textAlign: "right",
    fontFamily: 'bold',
    fontSize: 20,
    padding: 10,
  },
  input_title: {
    borderWidth: 1,
    width: 300,
    height: 50,
    borderColor: "#d1d1d1",
    borderRadius: 8, 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    marginBottom: 20,
    fontSize: 16, 
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input_content: {
    borderWidth: 1,
    borderColor: "#d1d1d1",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
    textAlignVertical: "top",
    width: 300,
    height: 300,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  errorText: {
    width: 200,
    textAlign: 'center',
    color: 'red',
    marginBottom: 12,
  },
  sendButton: {
    width: 150,
    backgroundColor: '#2f95dc',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});