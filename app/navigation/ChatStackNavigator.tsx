import { createStackNavigator } from '@react-navigation/stack';
import { ChatStackParamList } from './type';
import ChatScreen from '../tabs/chat';

export function ChatStackNavigator() {
    const CartStack = createStackNavigator<ChatStackParamList>(); // purchase
    return (
      <CartStack.Navigator screenOptions={{ headerShown: false }}>
        <CartStack.Screen name="Index" component={ChatScreen} />
      </CartStack.Navigator>
    );
}