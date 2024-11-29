import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ProfileStackParamList } from '../navigation/type';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Index'>;
export default function ProfileScreen({ navigation }: Props) {
  const handle_logout = () => {
    navigation.navigate("Auth");
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>個人資料</Text>
      <TouchableOpacity onPress={() => handle_logout()}>
        <Text>登出</Text>
      </TouchableOpacity>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});