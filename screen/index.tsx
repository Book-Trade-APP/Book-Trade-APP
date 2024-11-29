import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import ProfileScreen from './profile';
import NotificationsScreen from './notification';
import ShoppingCartScreen from './shopcart';

  const Tab = createBottomTabNavigator();
  export default function App() {
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
  
              // 根據不同路由設置對應的圖標
              switch (route.name) {
                case '首頁':
                  iconName = focused ? 'home' : 'home-outline';
                  break;
                case '個人':
                  iconName = focused ? 'person' : 'person-outline';
                  break;
                case '設置':
                  iconName = focused ? 'settings' : 'settings-outline';
                  break;
                case '通知':
                  iconName = focused ? 'notifications' : 'notifications-outline';
                  break;
              }
  
              // 返回圖標組件
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#007bff', // 活躍狀態顏色
            tabBarInactiveTintColor: 'gray', // 非活躍狀態顏色
            tabBarStyle: {
              height: 60,
              paddingBottom: 10,
            },
          })}
        >
          <Tab.Screen name="個人" component={ProfileScreen} />
          <Tab.Screen name="設置" component={ShoppingCartScreen} />
          <Tab.Screen name="通知" component={NotificationsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
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