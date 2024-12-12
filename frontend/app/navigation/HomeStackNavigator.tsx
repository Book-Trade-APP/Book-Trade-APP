import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { HomeStackParamList } from './type';
import HomeScreen from '../tabs/index';
import ProductDetailScreen from '../tabs/index/productDetail';
import { SlideUpTransition } from '../hook/SwitchPageAnimation';
const HomeStack = createStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
    return (
      <HomeStack.Navigator screenOptions={{cardStyleInterpolator: SlideUpTransition, headerShown: false, gestureEnabled: true}}>
        <HomeStack.Screen name="Index" component={HomeScreen} />
        <HomeStack.Screen name="Product" component={ProductDetailScreen} />
      </HomeStack.Navigator>
    );
}