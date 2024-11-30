import { createStackNavigator } from "@react-navigation/stack";
import { ProfileStackParamList } from "./type";
import ProfileScreen from "../tabs/profile";

  // Profile Stack Navigator
export function ProfileStackNavigator() {
    const ProfileStack = createStackNavigator<ProfileStackParamList>(); //personal settings
    return (
      <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
        <ProfileStack.Screen name="Index" component={ProfileScreen} />
      </ProfileStack.Navigator>
    );
}