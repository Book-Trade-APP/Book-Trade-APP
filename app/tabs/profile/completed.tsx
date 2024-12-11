import { View, Text, StyleSheet } from 'react-native';
import { Headers } from '../../components/NoneButtonHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHideTabBar } from '../../hook/HideTabBar';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ProfileStackParamList } from '../../navigation/type';
export default function CompleteScreen() {
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>(); 
  const handleGoBack = () => {
    navigation.reset({
      routes: [{ name: 'Index' }],
    });
  }
  useHideTabBar();
  return (
    <SafeAreaView style={styles.container}>
      <Headers title='已完成交易' back={handleGoBack}></Headers>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: "#f5f5f5",
  },
});