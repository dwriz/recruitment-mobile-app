import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";

export default function AttachmentDetailScreen() {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);

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
      Alert.alert("Error", "Failed to fetch attachments.");
    } finally {
      setLoading(false);
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

  useFocusEffect(
    useCallback(() => {
      fetchAttachments();
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

  if (attachments.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>Tidak ada data lampiran dokumen</Text>
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
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },
});
