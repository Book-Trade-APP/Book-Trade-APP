import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/type';

import LoadingScreen from '../auth/loading';
import LoginScreen from '../auth/login';
import RegisterScreen from '../auth/regitser';
const AuthStack = createStackNavigator<AuthStackParamList>();
export function AuthNavigator() {
    return (
      <AuthStack.Navigator initialRouteName="Loading" screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Loading" component={LoadingScreen} />
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Register" component={RegisterScreen} />
      </AuthStack.Navigator>
    );
  }