import { createStackNavigator } from '@react-navigation/stack';
import { HomeStackParamList } from './type';
import HomeScreen from '../tabs/index';
const HomeStack = createStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
    return (
      <HomeStack.Navigator screenOptions={{ headerShown: false }}>
        <HomeStack.Screen name="Index" component={HomeScreen} />
      </HomeStack.Navigator>
    );
}