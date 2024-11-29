import { createStackNavigator } from '@react-navigation/stack';
import { CartStackParamList } from './type';
import ShoppingCartScreen from '../tabs/shopcart';

export function CartStackNavigator() {
    const CartStack = createStackNavigator<CartStackParamList>(); // purchase
    return (
      <CartStack.Navigator screenOptions={{ headerShown: false }}>
        <CartStack.Screen name="Index" component={ShoppingCartScreen} />
      </CartStack.Navigator>
    );
}