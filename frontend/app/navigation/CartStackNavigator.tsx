import { createStackNavigator } from '@react-navigation/stack';
import { CartStackParamList } from './type';
import ShoppingCartScreen from '../tabs/shopcart';
import CheckoutScreen from '../tabs/cart/checkout';
const CartStack = createStackNavigator<CartStackParamList>(); // purchase
export function CartStackNavigator() {
    return (
      <CartStack.Navigator screenOptions={{ headerShown: false }}>
        <CartStack.Screen name="Index" component={ShoppingCartScreen} />
        <CartStack.Screen name="Checkout" component={CheckoutScreen} />
      </CartStack.Navigator>
    );
}