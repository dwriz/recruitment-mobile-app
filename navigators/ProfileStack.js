import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "../screens/profile/ProfileScreen";
import UserDetailScreen from "../screens/profile/userDetail/UserDetailScreen";
import EditUserDetailScreen from "../screens/profile/userDetail/EditUserDetailScreen";
import EducationDetailScreen from "../screens/profile/education/EducationDetailScreen";
import CreateEducationScreen from "../screens/profile/education/CreateEducationScreen";
import EditEducationScreen from "../screens/profile/education/EditEducationScreen";
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
        name="EducationDetailScreen"
        component={EducationDetailScreen}
      />
      <Stack.Screen
        name="CreateEducationScreen"
        component={CreateEducationScreen}
      />
      <Stack.Screen
        name="EditEducationScreen"
        component={EditEducationScreen}
      />
      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      />
    </Stack.Navigator>
  );
}
