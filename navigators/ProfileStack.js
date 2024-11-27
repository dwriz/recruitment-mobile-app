import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "../screens/profile/ProfileScreen";
import UserDetailScreen from "../screens/profile/userDetail/UserDetailScreen";
import EditUserDetailScreen from "../screens/profile/userDetail/EditUserDetailScreen";
import ChangePasswordScreen from "../screens/profile/changePassword/ChangePasswordScreen";

const Stack = createStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="UserDetailScreen" component={UserDetailScreen} />
      <Stack.Screen
        name="EditUserDetailScreen"
        component={EditUserDetailScreen}
      />
      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      />
    </Stack.Navigator>
  );
}
