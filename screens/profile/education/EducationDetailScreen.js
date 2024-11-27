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

export default function EducationDetailScreen({ navigation }) {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchEducations() {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/educations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();

      if (response.ok) {
        setEducations(result.data.educations);
      } else {
        throw new Error("Failed to fetch education details");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch education details");
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchEducations();
    }, [])
  );

  function renderCard({ item }) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.title_education}</Text>
        <View style={styles.row}>
          <Text style={styles.field}>Tingkat</Text>
          <Text style={styles.value}>{item.education_type}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.field}>IPK / Nilai</Text>
          <Text style={styles.value}>{item.education_grade}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.field}>Bidang Studi</Text>
          <Text style={styles.value}>{item.education_field_study}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.field}>Periode</Text>
          <Text style={styles.value}>
            {item.month_education_start} {item.year_education_start} -{" "}
            {item.month_education_end} {item.year_education_end}
          </Text>
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

  if (educations.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Tidak ada data pendidikan tersedia</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={educations}
        renderItem={renderCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("CreateEducationScreen")}
      >
        <Text style={styles.addButtonText}>Tambah Riwayat Pendidikan</Text>
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
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  field: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    width: 120,
  },
  value: {
    fontSize: 14,
    color: "#333",
    flex: 1,
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
