import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function ChangePasswordScreen({ navigation }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureOldPassword, setSecureOldPassword] = useState(true);
  const [secureNewPassword, setSecureNewPassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);

  async function handleChangePassword() {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Semua input harus terisi.");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("Error", "Password baru minimal 8 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Konfirmasi password tidak sesuai.");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ oldPassword, newPassword }),
        }
      );

      const result = await response.json();

      if (response.status === 200) {
        Alert.alert("Success", "Password berhasil diubah.");
        navigation.navigate("ProfileScreen");
      } else if (response.status === 401) {
        Alert.alert("Error", "Password lama salah.");
      } else {
        Alert.alert("Error", "Gagal mengganti password.");
      }
    } catch (error) {
      Alert.alert("Error", "Server Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Old Password */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password Lama"
          value={oldPassword}
          onChangeText={setOldPassword}
          secureTextEntry={secureOldPassword}
          autoCapitalize="none"
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setSecureOldPassword(!secureOldPassword)}
        >
          <Icon
            name={secureOldPassword ? "visibility-off" : "visibility"}
            size={24}
            color="#243d8f"
          />
        </TouchableOpacity>
      </View>

      {/* New Password */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password Baru"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={secureNewPassword}
          autoCapitalize="none"
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setSecureNewPassword(!secureNewPassword)}
        >
          <Icon
            name={secureNewPassword ? "visibility-off" : "visibility"}
            size={24}
            color="#243d8f"
          />
        </TouchableOpacity>
      </View>

      {/* Confirm Password */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Konfirmasi Password Baru"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={secureConfirmPassword}
          autoCapitalize="none"
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setSecureConfirmPassword(!secureConfirmPassword)}
        >
          <Icon
            name={secureConfirmPassword ? "visibility-off" : "visibility"}
            size={24}
            color="#243d8f"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleChangePassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Ganti Password</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6677a1",
    padding: 16,
    justifyContent: "center",
  },
  inputContainer: {
    position: "relative",
    marginBottom: 12,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingRight: 40,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: "30%",
  },
  button: {
    backgroundColor: "#243d8f",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
