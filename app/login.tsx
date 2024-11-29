import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export default function LoginScreen({ navigation }: LoginScreenProps){
    return(
        <View style={styles.container}>
            <View style={styles.logo}>
                <Text style={styles.logoText}>二手書交易平台</Text>
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
                    placeholder="密碼"
                    secureTextEntry
                />
                <TouchableOpacity style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>登入</Text>
                </TouchableOpacity>
                <View style={styles.bottom}>
                  <TouchableOpacity style={styles.registerButton}>
                    <Text style={styles.signupLink}> 忘記密碼?</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.registerButton}>
                    <Text style={styles.signupLink} onPress={() => navigation.navigate('Register')}> 註冊帳號</Text>
                  </TouchableOpacity>
                </View>

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
    loginButton: {
      backgroundColor: '#4CAF50',
      width: 200,
      height: 50,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
    },
    loginButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    signupLink: {
      color: '#4CAF50',
      marginTop: 10,
      marginRight: 15,
      marginLeft: 15,
    },
    registerButton: {
        justifyContent: 'center',
    },
    bottom: {
      flexDirection: 'row'
    }
  });