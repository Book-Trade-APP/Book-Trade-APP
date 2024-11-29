import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/type';
import { AuthNavigator } from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';

export default function RootNavigator(){
    const RootStack = createStackNavigator<RootStackParamList>();
    return(
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Screen name="Auth" component={AuthNavigator} />
            <RootStack.Screen name="Main" component={MainTabNavigator} />
        </RootStack.Navigator>
    )
}

