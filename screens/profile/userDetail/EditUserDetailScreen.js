import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditUserDetailScreen({ route, navigation }) {
  const { userDetails } = route.params;
  const [username, setUsername] = useState(userDetails.username || "");
  const [dob, setDob] = useState(
    userDetails.dob ? new Date(userDetails.dob) : null
  );
  const [address, setAddress] = useState(userDetails.address || "");
  const [phone, setPhone] = useState(userDetails.phone || "");
  const [showDatePicker, setShowDatePicker] = useState(false);

  function validateDob(selectedDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today;
  }

  function validatePhone(phoneNumber) {
    return phoneNumber.length >= 8;
  }

  async function handleSave() {
    if (!username || !address || !phone) {
      Alert.alert("Error", "Seluruh input harus terisi");
      return;
    }

    if (!dob || !validateDob(dob)) {
      Alert.alert(
        "Error",
        "Tanggal lahir tidak boleh hari ini atau di masa depan"
      );
      return;
    }

    if (!validatePhone(phone)) {
      Alert.alert("Error", "Nomor telepon minimal 8 digit");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username,
            dob: dob
              ? `${dob.getFullYear()}-${(dob.getMonth() + 1)
                  .toString()
                  .padStart(2, "0")}-${dob
                  .getDate()
                  .toString()
                  .padStart(2, "0")}`
              : null,
            address,
            phone,
          }),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Data berhasil diperbarui");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Gagal memperbarui data");
      }
    } catch (error) {
      Alert.alert("Error", "Server Error");
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nama Lengkap"
        value={username}
        onChangeText={setUsername}
      />
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>
          {dob
            ? `${dob.getFullYear()}-${(dob.getMonth() + 1)
                .toString()
                .padStart(2, "0")}-${dob.getDate().toString().padStart(2, "0")}`
            : "Tanggal Lahir"}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dob || new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate && validateDob(selectedDate)) {
              setDob(selectedDate);
            } else {
              Alert.alert(
                "Error",
                "Tanggal lahir tidak boleh hari ini atau di masa depan"
              );
            }
          }}
        />
      )}
      <TextInput
        style={[styles.input, styles.addressInput]}
        placeholder="Alamat"
        value={address}
        onChangeText={setAddress}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="No. Telepon"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Simpan</Text>
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
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
  },
  addressInput: {
    height: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#243d8f",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
