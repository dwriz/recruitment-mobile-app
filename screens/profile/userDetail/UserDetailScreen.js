import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function UserDetailScreen({ navigation }) {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchUserDetails() {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();

      if (response.ok) {
        setUserDetails(result.data);
      } else {
        throw new Error("Failed to fetch user details");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  }

  useFocusEffect(
    useCallback(() => {
      fetchUserDetails();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#243d8f" />
      </View>
    );
  }

  if (!userDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Data identitas diri tidak tersedia</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Identitas Diri</Text>
      <View style={styles.row}>
        <Text style={styles.field}>Nama Lengkap</Text>
        <Text style={userDetails.username ? styles.value : styles.placeholder}>
          {userDetails.username || "Tidak tersedia, mohon dilengkapi"}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.field}>Tanggal Lahir</Text>
        <Text style={userDetails.dob ? styles.value : styles.placeholder}>
          {userDetails.dob
            ? formatDate(userDetails.dob)
            : "Tidak tersedia, mohon dilengkapi"}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.field}>Alamat</Text>
        <Text style={userDetails.address ? styles.value : styles.placeholder}>
          {userDetails.address || "Tidak tersedia, mohon dilengkapi"}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.field}>No. Telepon</Text>
        <Text style={userDetails.phone ? styles.value : styles.placeholder}>
          {userDetails.phone || "Tidak tersedia, mohon dilengkapi"}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() =>
          navigation.navigate("EditUserDetailScreen", { userDetails })
        }
      >
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#243d8f",
    marginBottom: 16,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  field: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    width: 140,
  },
  value: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  placeholder: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    flex: 1,
  },
  errorText: {
    textAlign: "center",
    color: "#ff0000",
    fontSize: 16,
  },
  editButton: {
    marginTop: 24,
    backgroundColor: "#243d8f",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
