import { NavigationProp, useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet } from 'react-native';
import { useHideTabBar } from '../../hook/HideTabBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Headers } from '../../components/NoneButtonHeader';
import { ProfileStackParamList } from '../../navigation/type';
export default function EvaluateScreen() {
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>(); 
  const handleGoBack = () => {
    navigation.reset({
      routes: [{ name: 'Index' }],
    });
  }
  useHideTabBar();
  return (
    <SafeAreaView style={styles.container}>
      <Headers title='我的評價' back={handleGoBack}></Headers>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: "#f5f5f5",
  },
});