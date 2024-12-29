import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ImageBackground, Image} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { api } from '../../api/api';
import { asyncPost } from '../../utils/fetch';
import { AuthStackParamList, RootStackParamList } from '../navigation/type';
import { saveUserId } from '../../utils/stroage';
import { LoadingModal } from '../components/LoadingModal';
export default function LoginScreen() {
  const AuthNavigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const RootNavigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const handleLogin = async () => {
    if (email === "" || password === "") {
      setErrorText("請輸入帳號或密碼");
      return;
    }
    try {
      setIsLoading(true);
      const response = await asyncPost(api.login, {
        "email": email,
        "password": password
      })
      if (response.status === 200) {
        saveUserId(response.data.body._id);
        RootNavigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      } else if (response.status === 401 || response.status === 404){
        setErrorText("帳號或密碼錯誤");
      } else {
        setErrorText("伺服器異常");
      }
    } catch (error) {
      console.log("failed to login");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <ImageBackground 
        source={require('../../assets/Auth-Background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.container}>
            <Text style={styles.logoText}>登入</Text>
          <View>
            <TextInput
              style={styles.input}
              placeholder="電子郵件"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="密碼"
              secureTextEntry
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>登入</Text>
            </TouchableOpacity>
            <Text style={styles.errorText}>{errorText}</Text>
            <View style={styles.bottom}>
              <TouchableOpacity style={styles.Button}>
                <Text style={styles.signupLink} onPress={() => AuthNavigation.navigate('Forget')}>忘記密碼?</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.Button}>
                <Text style={styles.signupLink} onPress={() => AuthNavigation.navigate('Register')}>註冊帳號</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
      <LoadingModal isLoading={isLoading} message={"登入中..."} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(255, 255, 255)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    width: '85%',
    elevation: 5,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  errorText: {
    width: 200,
    textAlign: 'center',
    color: 'red',
    marginBottom: 12,
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
  Button: {
    justifyContent: 'center',
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});