import React from "react";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { createStackNavigator } from "@react-navigation/stack";
import AuthStack from "./AuthStack";
import BottomTab from "./BottomTab";

const Stack = createStackNavigator();

export default function MainStack() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="BottomTab" component={BottomTab} />
        ) : (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        )}
      </Stack.Navigator>
    </>
  );
}
