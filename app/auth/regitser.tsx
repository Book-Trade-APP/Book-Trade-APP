import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/type';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;
export default function RegisterScreen({ navigation }: Props){
    return(
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton}>
                <Text style={styles.backButtonText}
                onPress={() => navigation.goBack()}>返回</Text>
            </TouchableOpacity>
            <View style={styles.logo}>
                <Text style={styles.logoText}>註冊</Text>
            </View>

            <View>
                <TextInput
                    style={styles.input}
                    placeholder="電子郵件"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="使用者名稱"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="密碼"
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder="確認密碼"
                    secureTextEntry
                />
                <TouchableOpacity style={styles.registerButton}>
                    <Text style={styles.registerButtonText}>建立帳號</Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      
    },
    logo: {
      marginBottom: 40,
    },
    logoText: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    form: {
      width: '80%',
      alignItems: 'center',
    },
    input: {
      width: 200,
      height: 50,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      paddingHorizontal: 10,
      marginVertical: 10,
    },
    registerButton: {
        backgroundColor: '#4CAF50',
        width: 200,
        height: 50,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    registerButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        padding: 10,
    },
    backButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
  });