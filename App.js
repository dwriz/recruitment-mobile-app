import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainStack from "./navigators/MainStack";
import AuthProvider, { AuthContext } from "./contexts/AuthContext";
import { Text, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useContext } from "react";

const Stack = createStackNavigator();

function AppContent() {
  const { isLoggedIn, handleLogout } = useContext(AuthContext);

  function LogoutIcon() {
    return (
      <TouchableOpacity
        onPress={handleLogout}
        style={{ marginRight: 15, alignItems: "center" }}
      >
        <Icon name="logout" size={20} color="#FFFFFF" />
        <Text style={{ fontSize: 10, color: "#FFFFFF" }}>Logout</Text>
      </TouchableOpacity>
    );
  }

  function HeaderLogo() {
    return (
      <Image
        source={require("./assets/logo_header.png")}
        style={{
          width: 200,
          height: 60,
          resizeMode: "contain",
          marginBottom: 10,
        }}
      />
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerRight: () =>
            isLoggedIn ? <LogoutIcon navigation={navigation} /> : null,
          headerTitle: () => <HeaderLogo />,
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#243d8f",
          },
        })}
      >
        <Stack.Screen name="MainStack" component={MainStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
