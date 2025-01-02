import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useHideTabBar } from '@/app/hook/HideTabBar';
import { useNavigation } from '@react-navigation/native';
import { Headers } from '@/app/components/NoneButtonHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { asyncPost } from '@/utils/fetch';
import { api } from '@/api/api';
import { LoadingModal } from '@/app/components/LoadingModal';
import { styles } from '../styles/report';

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