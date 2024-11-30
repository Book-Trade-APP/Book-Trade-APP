import { createStackNavigator } from "@react-navigation/stack";
import { ProfileStackParamList } from "./type";
import ProfileScreen from "../tabs/profile";
const ProfileStack = createStackNavigator<ProfileStackParamList>(); //personal settings
  // Profile Stack Navigator
export function ProfileStackNavigator() {
    return (
      <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
        <ProfileStack.Screen name="Index" component={ProfileScreen} />
      </ProfileStack.Navigator>
    );
}