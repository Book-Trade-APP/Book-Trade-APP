import { NavigationProp, useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useHideTabBar } from '../../hook/HideTabBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Headers } from '../../components/NoneButtonHeader';
import { ProfileStackParamList } from '../../navigation/type';
export default function PendingScreen() {
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>(); 
  const handleGoBack = () => {
    navigation.reset({
      routes: [{ name: 'Index' }],
    });
  }
  useHideTabBar();
  return (
    <SafeAreaView style={styles.container}>
      <Headers title='待交易' back={handleGoBack}></Headers>
      <ScrollView></ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: "#f5f5f5",
  },
});