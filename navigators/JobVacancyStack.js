import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import JobVacancyScreen from "../screens/jobVacancy/JobVacancyScreen";
import JobVacancyDetailScreen from "../screens/jobVacancy/JobVacancyDetailScreen";

const Stack = createStackNavigator();

export default function JobVacancyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="JobVacancyScreen" component={JobVacancyScreen} />

      <Stack.Screen
        name="JobVacancyDetailScreen"
        component={JobVacancyDetailScreen}
      />
    </Stack.Navigator>
  );
}
