import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [secureConfirmText, setSecureConfirmText] = useState(true);

  async function handleRegister() {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Seluruh input harus terisi");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password minimal 8 karakter");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Konfirmasi password salah");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        }
      );

      const result = await response.json();

      if (response.status === 201) {
        Alert.alert(
          "Berhasil",
          "Daftar berhasil, cek email anda dan segera lakukan verifikasi"
        );
        navigation.navigate("Verify");
      } else if (response.status === 409) {
        Alert.alert("Error", "Email sudah terdaftar");
      } else {
        Alert.alert("Error", "Server Error");
      }
    } catch (error) {
      Alert.alert("Error", "Server Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/login-screen-logo.png")}
        style={styles.logo}
      />
      <TextInput
        style={styles.input}
        placeholder="Nama Lengkap"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#aaa"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={secureText}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          <Icon
            name={secureText ? "visibility-off" : "visibility"}
            size={24}
            color="#243d8f"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Konfirmasi Password"
          secureTextEntry={secureConfirmText}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity
          onPress={() => setSecureConfirmText(!secureConfirmText)}
        >
          <Icon
            name={secureConfirmText ? "visibility-off" : "visibility"}
            size={24}
            color="#243d8f"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Daftar</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Verify")}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>Verifikasi Akun</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6677a1",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 24,
    resizeMode: "contain",
  },
  input: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 10,
    color: "#000",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
    color: "#000",
  },
  button: {
    width: "100%",
    padding: 15,
    alignItems: "center",
    backgroundColor: "#243d8f",
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkButton: {
    paddingVertical: 8,
  },
  linkText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
