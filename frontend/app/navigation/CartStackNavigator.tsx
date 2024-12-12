import { createStackNavigator } from '@react-navigation/stack';
import { CartStackParamList } from './type';
import ShoppingCartScreen from '../tabs/shopcart';
const CartStack = createStackNavigator<CartStackParamList>(); // purchase
export function CartStackNavigator() {
    return (
      <CartStack.Navigator screenOptions={{ headerShown: false }}>
        <CartStack.Screen name="Index" component={ShoppingCartScreen} />
      </CartStack.Navigator>
    );
}