import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function ExperienceDetailScreen({ navigation }) {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchExperiences() {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/experiences`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();

      if (response.ok) {
        setExperiences(result.data.experiences);
      } else {
        throw new Error("Gagal mengambil data riwayat pengalaman");
      }
    } catch (error) {
      Alert.alert("Error", "Server Error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/experiences/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        Alert.alert("Success", "Sukses menghapus riwayat pengalaman");
        fetchExperiences();
      } else {
        Alert.alert("Error", "Gagal menghapus riwayat pengalaman");
      }
    } catch (error) {
      Alert.alert("Error", "Server Error");
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchExperiences();
    }, [])
  );

  function renderCard({ item }) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.company_name}</Text>
        <View style={styles.row}>
          <Text style={styles.field}>Jenis Kepegawaian</Text>
          <Text style={styles.value}>{item.employee_type}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.field}>Lokasi</Text>
          <Text style={styles.value}>{item.location}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.field}>Periode</Text>
          <Text style={styles.value}>
            {item.start_month_experience} {item.start_year_experience} -
            {item.still_active
              ? "Sekarang"
              : `${item.end_month_experience} ${item.end_year_experience}`}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.field}>Deskripsi</Text>
          <Text style={styles.value}>{item.desc_experience}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.field}>Keahlian</Text>
          <Text style={styles.value}>{item.desc_skill}</Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("EditExperienceScreen", { experience: item })
            }
          >
            <Icon name="edit" size={24} color="#243d8f" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Konfirmasi",
                "Apakah Anda yakin ingin menghapus pengalaman ini?",
                [
                  { text: "Batal", style: "cancel" },
                  { text: "Hapus", onPress: () => handleDelete(item.id) },
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

  if (experiences.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Tidak ada data pengalaman tersedia</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={experiences}
        renderItem={renderCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("CreateExperienceScreen")}
      >
        <Text style={styles.addButtonText}>Tambah Riwayat Pengalaman</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#243d8f",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  field: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    width: 150,
  },
  value: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  errorText: {
    textAlign: "center",
    color: "#ff0000",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#243d8f",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
