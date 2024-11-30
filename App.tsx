import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './app/navigation/RootNavigator';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './app/login';
import RegisterScreen from './app/regitser';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ 
          headerShown: false 
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
        />
      </Stack.Navigator>

    </NavigationContainer>
  );
}