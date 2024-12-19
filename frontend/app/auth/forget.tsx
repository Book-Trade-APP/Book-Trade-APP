import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Text, TextInput, View, TouchableOpacity, StyleSheet } from "react-native";
import { AuthStackParamList } from "../navigation/type";

export default function ForgetScreen() {
    const [email, setEmail] = useState("");
    const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

    const handleSendEmail = () => {
        /* 寄送email驗證碼*/
    }
    return (
        <View style={styles.container}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>忘記密碼?</Text>
          </View>
          <View>
            <TextInput
              style={styles.input}
              placeholder="電子郵件"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleSendEmail}>
              <Text style={styles.loginButtonText}>重設密碼</Text>
            </TouchableOpacity>
            <View style={styles.bottom}>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.signupLink} onPress={() => navigation.navigate('Login')}>返回登入</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.signupLink} onPress={() => navigation.navigate('Register')}>註冊帳號</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
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
      },
      button: {
        justifyContent: 'center',
      },
      bottom: {
        flexDirection: 'row',
        justifyContent: 'space-around',
      },
    });