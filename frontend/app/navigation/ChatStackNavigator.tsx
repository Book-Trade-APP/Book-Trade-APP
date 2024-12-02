import { createStackNavigator } from '@react-navigation/stack';
import { ChatStackParamList } from './type';
import ChatScreen from '../tabs/chat';
const ChatStack = createStackNavigator<ChatStackParamList>(); // purchase
export function ChatStackNavigator() {
    return (
      <ChatStack.Navigator screenOptions={{ headerShown: false }}>
        <ChatStack.Screen name="Index" component={ChatScreen} />
      </ChatStack.Navigator>
    );
}