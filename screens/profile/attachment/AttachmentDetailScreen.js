import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import * as DocumentPicker from "expo-document-picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

export default function AttachmentDetailScreen() {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  async function fetchAttachments() {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/profile/attachments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();

      if (response.ok) {
        setAttachments(result.data);
      } else {
        throw new Error("Failed to fetch attachments");
      }
    } catch (error) {
      Alert.alert("Error", "Gagal memuat dokumen pendukung");
    } finally {
      setLoading(false);
    }
  }

  async function fetchDocumentTypes() {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/options/document-types`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();

      if (response.ok) {
        setDocumentTypes(result.data.documentTypes);
      } else {
        throw new Error("Failed to fetch document types");
      }
    } catch (error) {
      Alert.alert("Error", "Gagal memuat jenis dokumen");
    }
  }

  async function deleteAttachment(attachmentId) {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/profile/attachments/${attachmentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Sukses menghapus dokumen");
        fetchAttachments();
      } else {
        throw new Error("Failed to delete attachment");
      }
    } catch (error) {
      Alert.alert("Error", "Gagal menghapus dokumen");
    }
  }

  async function handleFileUpload() {
    const fileResult = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
      copyToCacheDirectory: true,
    });

    if (fileResult.type === "cancel") {
      return;
    }

    const asset = fileResult.assets ? fileResult.assets[0] : null;

    if (!asset) {
      Alert.alert("Error", "Gagal melampirkan file - silakan coba kembali");
      return;
    }

    const file = {
      uri: asset.uri,
      name: asset.name,
      type: asset.mimeType,
    };

    if (asset.size > 5 * 1024 * 1024) {
      Alert.alert("Error", "Ukuran file tidak dapat melebihi 5 MB");
      return;
    }

    setUploading(true);

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token is missing.");
      }

      const formData = new FormData();
      formData.append("document_type_id", selectedDocumentType);
      formData.append("profile_attachment", file);

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/profile/attachments`,
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
        Alert.alert("Success", "Dokumen berhasil diunggah");
        fetchAttachments();
      } else {
        Alert.alert("Error", "Gagal mengunggah dokumen");
      }
    } catch (error) {
      Alert.alert("Error", "Terjadi kesalahan saat mengunggah dokumen");
    } finally {
      setUploading(false);
      setModalVisible(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchAttachments();
      fetchDocumentTypes();
    }, [])
  );

  function renderAttachmentCard({ item }) {
    return (
      <View style={styles.card}>
        <Text style={styles.documentType}>{item.document_type}</Text>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => Linking.openURL(item.url)}
          >
            <Icon name="file-download" size={24} color="#243d8f" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() =>
              Alert.alert(
                "Konfirmasi",
                "Apa anda yakin akan menghapus dokumen ini?",
                [
                  { text: "Batal", style: "cancel" },
                  {
                    text: "Hapus",
                    style: "destructive",
                    onPress: () => deleteAttachment(item.id),
                  },
                ]
              )
            }
          >
            <Icon name="delete" size={24} color="#ff0000" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#243d8f" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={attachments}
        renderItem={renderAttachmentCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.uploadButtonText}>Upload Dokumen Pendukung</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pilih Jenis Dokumen</Text>
            <Picker
              selectedValue={selectedDocumentType}
              onValueChange={(itemValue) => setSelectedDocumentType(itemValue)}
              style={styles.picker}
            >
              {documentTypes.map((type) => (
                <Picker.Item
                  key={type.id}
                  label={type.param_data}
                  value={type.id}
                />
              ))}
            </Picker>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleFileUpload}
              disabled={!selectedDocumentType}
            >
              <Text style={styles.confirmButtonText}>Pilih Dokumen</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {uploading && (
        <View style={styles.uploadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  documentType: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#243d8f",
    marginBottom: 8,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  iconButton: {
    borderRadius: 8,
  },
  uploadButton: {
    backgroundColor: "#243d8f",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  picker: {
    width: "100%",
    marginBottom: 16,
  },
  confirmButton: {
    backgroundColor: "#243d8f",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
    width: "100%",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  uploadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});
