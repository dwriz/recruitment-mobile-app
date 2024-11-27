import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import JobVacancyStack from "./JobVacancyStack";
import JobApplicationStack from "./JobApplicationStack";
import ProfileStack from "./ProfileStack";
import Icon from "react-native-vector-icons/MaterialIcons";

const Tab = createBottomTabNavigator();

export default function BottomTab() {
  return (
    <Tab.Navigator
      initialRouteName="JobVacancyStack"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#243d8f",
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#BBBBBB",
      }}
    >
      <Tab.Screen
        name="JobVacancyStack"
        component={JobVacancyStack}
        options={{
          tabBarLabel: "Job Vacancies",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="work-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="JobApplicationStack"
        component={JobApplicationStack}
        options={{
          tabBarLabel: "Job Application",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="description" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          tabBarLabel: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
