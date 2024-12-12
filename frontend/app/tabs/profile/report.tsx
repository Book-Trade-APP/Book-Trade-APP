import { View, StyleSheet, ToastAndroid, TextInput } from 'react-native';
import { useHideTabBar } from '../../hook/HideTabBar';
import { useNavigation } from '@react-navigation/native';
import { Header } from '../../components/ButtonHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
export default function ReportScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigation = useNavigation();
  const publishError = () => {
    /* connect to someone email */ 
    ToastAndroid.show(`${title}`, ToastAndroid.SHORT);
    ToastAndroid.show(`${content}`, ToastAndroid.LONG);
  }
  useHideTabBar();
  return (
    <SafeAreaView style={styles.container}>
      <Header title="問題回報" text="傳送" navigation={navigation} Change={publishError}></Header>
      <View style={styles.field}>
        <TextInput style={styles.input_title} placeholder='請輸入問題或建議' value={title} onChangeText={setTitle} />
        <TextInput style={styles.input_content} placeholder='詳細描述內容' multiline={true} value={content} onChangeText={setContent}/>
      </View>
    </SafeAreaView>
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
  label: {
    textAlign: "right",
    fontFamily: 'bold',
    fontSize: 20,
    padding: 10,
  },
  input_title: {
      borderWidth: 1,
      borderColor: '#C0C0C0',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      width: 300,
      height: 50,
      backgroundColor: '#FFFFFF',
  },
  input_content: {
    borderWidth: 1,
    borderColor: '#C0C0C0',
    borderRadius: 5,
    padding: 10,
    width: 300,
    height: 200,  // Adjust the height as needed for more space
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'top', // Ensures that the text aligns at the top
},
});