import { createStackNavigator, } from "@react-navigation/stack";
import { ProfileStackParamList } from "./type";
import ProfileScreen from "../tabs/profile";
import SettingScreen from "../tabs/profile/settings";
import ReportScreen from "../tabs/profile/report";
import SellerScreen from "../tabs/profile/seller";
import EditScreen from "../tabs/profile/edit";
import OrderStatusScreen from "../tabs/profile/orderStatus";
import { SlideUpTransition } from "../hook/SwitchPageAnimation";
import FavoriteScreen from "../tabs/profile/favorite";
const ProfileStack = createStackNavigator<ProfileStackParamList>(); //personal settings
  // Profile Stack Navigator
export function ProfileStackNavigator() {
    return (
      <ProfileStack.Navigator screenOptions={({ route }) => ({cardStyleInterpolator: route.name === 'Index' ? undefined : SlideUpTransition, headerShown: false, gestureEnabled: true, gestureDirection: 'vertical'})}>
        <ProfileStack.Screen name="Index" component={ProfileScreen} />
        <ProfileStack.Screen name="Setting" component={SettingScreen} />
        <ProfileStack.Screen name="Favorite" component={FavoriteScreen} />
        <ProfileStack.Screen name="Seller" component={SellerScreen} />
        <ProfileStack.Screen name="Edit" component={EditScreen} />
        <ProfileStack.Screen name="Report" component={ReportScreen} />
        <ProfileStack.Screen name="OrderStatus" component={OrderStatusScreen} />
      </ProfileStack.Navigator>
    );
}