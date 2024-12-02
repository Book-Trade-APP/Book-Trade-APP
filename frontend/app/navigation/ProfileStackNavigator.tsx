import { createStackNavigator } from "@react-navigation/stack";
import { ProfileStackParamList } from "./type";
import ProfileScreen from "../tabs/profile";
import SettingScreen from "../tabs/profile/settings";
import CollectionScreen from "../tabs/profile/collection";
import PendingScreen from "../tabs/profile/pending";
import CompleteScreen from "../tabs/profile/completed";
import EvaluateScreen from "../tabs/profile/evaluate";
import ReportScreen from "../tabs/profile/report";
import SellerScreen from "../tabs/profile/seller";
import EditScreen from "../tabs/profile/edit";
const ProfileStack = createStackNavigator<ProfileStackParamList>(); //personal settings
  // Profile Stack Navigator
export function ProfileStackNavigator() {
    return (
      <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
        <ProfileStack.Screen name="Index" component={ProfileScreen} />
        <ProfileStack.Screen name="Setting" component={SettingScreen} />
        <ProfileStack.Screen name="Collection" component={CollectionScreen} />
        <ProfileStack.Screen name="Pending" component={PendingScreen} />
        <ProfileStack.Screen name="Completed" component={CompleteScreen} />
        <ProfileStack.Screen name="Evaluate" component={EvaluateScreen} />
        <ProfileStack.Screen name="Seller" component={SellerScreen} />
        <ProfileStack.Screen name="Edit" component={EditScreen} />
        <ProfileStack.Screen name="Report" component={ReportScreen} />
      </ProfileStack.Navigator>
    );
}