import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useFocusEffect } from "@react-navigation/native";

export default function ProfileScreen({ navigation }) {
  const [username, setUsername] = useState("Loading...");
  const [email, setEmail] = useState("Loading...");
  const [profilePicture, setProfilePicture] = useState(
    require("../../assets/profile_picture_placeholder.jpg")
  );
  const [uploading, setUploading] = useState(false);

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
      Alert.alert("Error", "Gagal memuat data profil");
    }
  }

  async function fetchProfilePicture() {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/profile/picture`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();

      if (response.ok && result.data?.profilePictureUrl) {
        setProfilePicture({ uri: result.data.profilePictureUrl });
      }
    } catch (error) {
      setProfilePicture(
        require("../../assets/profile_picture_placeholder.jpg")
      );
    }
  }

  async function pickImageAndUpload() {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Denied",
        "Permission to access the gallery is required."
      );
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled && pickerResult.assets?.length > 0) {
      setUploading(true);

      const localUri = pickerResult.assets[0].uri;

      const fileInfo = await FileSystem.getInfoAsync(localUri);
      const fileExtension = localUri.split(".").pop().toLowerCase();

      if (fileInfo.size > 5 * 1024 * 1024) {
        setUploading(false);
        Alert.alert("Error", "Ukuran gambar tidak dapat melebihi 5 MB");
        return;
      }

      const jpgUri =
        fileExtension !== "jpg" && fileExtension !== "jpeg"
          ? await FileSystem.writeAsStringAsync(
              FileSystem.documentDirectory + "profile_picture.jpg",
              await FileSystem.readAsStringAsync(localUri),
              {
                encoding: FileSystem.EncodingType.Base64,
              }
            )
          : localUri;

      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();
      formData.append("profile_picture", {
        uri: jpgUri,
        type: "image/jpeg",
        name: "profile_picture.jpg",
      });

      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/profile/picture`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            body: formData,
          }
        );

        if (response.ok) {
          fetchProfilePicture();
          Alert.alert("Success", "Foto profil berhasil diunggah");
        } else {
          Alert.alert("Error", "Gagal mengunggah foto profil");
        }
      } catch (error) {
        Alert.alert("Error", "Server Error");
      } finally {
        setUploading(false);
      }
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchUsername();
      fetchProfilePicture();
    }, [])
  );

  const buttons = [
    { name: "Identitas Diri", icon: "person", screen: "UserDetailScreen" },
    {
      name: "Riwayat Pendidikan",
      icon: "school",
      screen: "EducationDetailScreen",
    },
    {
      name: "Riwayat Pengalaman",
      icon: "work",
      screen: "ExperienceDetailScreen",
    },
    { name: "Dokumen Pendukung", icon: "feed", screen: "AttachmentDetailScreen" },
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
          <Image source={profilePicture} style={styles.profileImage} />
          <TouchableOpacity
            style={styles.editIcon}
            onPress={pickImageAndUpload}
          >
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

      <Modal visible={uploading} transparent={true} animationType="fade">
        <View style={styles.modalBackground}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </Modal>
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
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
