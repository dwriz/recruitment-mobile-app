import React, { useEffect } from "react";
import { Alert } from "react-native";
import { createContext } from "react";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function handleLogout() {
    try {
      await AsyncStorage.removeItem("token");
      setIsLoggedIn(false);
    } catch (error) {
      Alert.alert("Error", `Error logging out\nPlease restart the app.`);
    }
  }

  async function checkLoginStatus() {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <>
      <AuthContext.Provider
        value={{
          isLoggedIn,
          setIsLoggedIn,
          checkLoginStatus,
          handleLogout,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
}
