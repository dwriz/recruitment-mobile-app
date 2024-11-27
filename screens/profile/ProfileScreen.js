import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function ProfileScreen({ navigation }) {
  const [username, setUsername] = useState("Loading...");
  const [email, setEmail] = useState("Loading...");

  async function fetchUsername() {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/profile/name`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();

      if (response.ok) {
        setUsername(result.data.username);
        setEmail(result.data.email);
      } else {
        throw new Error("Failed to fetch username");
      }
    } catch (error) {
      setUsername("==error fetching name==");
      setEmail("==error fetching email==");
      Alert.alert("Error", "Failed to fetch username");
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchUsername();
    }, [])
  );

  const buttons = [
    { name: "Identitas Diri", icon: "person", screen: "UserDetailScreen" },
    { name: "Riwayat Pendidikan", icon: "school", screen: "EducationDetailScreen" },
    { name: "Riwayat Pengalaman", icon: "work" },
    { name: "Ganti Password", icon: "lock", screen: "ChangePasswordScreen" },
  ];

  function renderButton({ item }) {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => item.screen && navigation.navigate(item.screen)}
      >
        <Icon name={item.icon} size={24} color="#243d8f" />
        <Text style={styles.buttonText}>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageWrapper}>
          <Image
            source={require("../../assets/profile_picture_placeholder.jpg")}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editIcon}>
            <Icon name="edit" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.profileName}>{username}</Text>
        <Text style={styles.profileEmail}>{email}</Text>
      </View>

      <FlatList
        data={buttons}
        renderItem={renderButton}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.buttonsContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#6677a1",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  profileImageWrapper: {
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#243d8f",
    borderRadius: 15,
    padding: 4,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 8,
  },
  profileEmail: {
    fontSize: 16,
    color: "#ffffff",
  },
  buttonsContainer: {
    padding: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderColor: "#dddddd",
    borderWidth: 1,
  },
  buttonText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "bold",
    color: "#243d8f",
  },
});
