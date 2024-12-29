import { createStackNavigator } from '@react-navigation/stack';
import { ChatStackParamList } from './type';
import ChatScreen from '../tabs/chat';
import ChatDetail from '../tabs/chat/chatDetail';

const ChatStack = createStackNavigator<ChatStackParamList>();

export function ChatStackNavigator() {
    return (
        <ChatStack.Navigator screenOptions={{ headerShown: false }}>
            <ChatStack.Screen name="Index" component={ChatScreen} />
            <ChatStack.Screen name="ChatDetail" component={ChatDetail} />
        </ChatStack.Navigator>
    );
}
