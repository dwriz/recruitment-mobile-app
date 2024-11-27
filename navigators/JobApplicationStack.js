import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import JobApplicationScreen from "../screens/jobApplication/JobApplicationScreen";

const Stack = createStackNavigator();

export default function JobApplicationStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="JobApplicationScreen"
        component={JobApplicationScreen}
      />
    </Stack.Navigator>
  );
}
