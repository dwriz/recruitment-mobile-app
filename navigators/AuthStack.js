import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LandingScreen from "../screens/auth/LandingScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import VerifyScreen from "../screens/auth/VerifyScreen";
import Icon from "react-native-vector-icons/MaterialIcons";

const Tab = createBottomTabNavigator();

export default function AuthStack() {
  return (
    <Tab.Navigator
      initialRouteName="Landing"
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
        name="Landing"
        component={LandingScreen}
        options={{
          tabBarLabel: "Lowongan Kerja",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="work-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Login"
        component={LoginScreen}
        options={{
          tabBarLabel: "Login",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="login" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          tabBarLabel: "Daftar",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-add" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Verify"
        component={VerifyScreen}
        options={{
          tabBarLabel: "Verifikasi Akun",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="verified-user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
