import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { api } from '../../api/api';
import { asyncPost } from '../../utils/fetch';
import { AuthStackParamList, RootStackParamList } from '../navigation/type';

export default function LoginScreen() {
  const AuthNavigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const RootNavigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = async () => {
    if (email === "" || password === "") {
      Alert.alert("請輸入帳號或密碼");
      return;
    }
    const respone = await asyncPost(api.login, {
      "email": email,
      "password": password
    })
    if (respone.status === 200) {
      RootNavigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } else {
      Alert.alert("帳號或密碼錯誤");
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>登入</Text>
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
  Button: {
    justifyContent: 'center',
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});