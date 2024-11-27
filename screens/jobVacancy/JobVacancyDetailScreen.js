import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function JobVacancyDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  async function fetchJobDetails() {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/job-vacancies/${id}`
      );
      const result = await response.json();

      if (result.statusCode === 200) {
        setJobDetails(result.data);
      } else {
        Alert.alert("Error", "Server Error");
      }
    } catch (error) {
      Alert.alert("Error", "Server Error");
    } finally {
      setLoading(false);
    }
  }

  async function handleApply() {
    setApplying(true);
    const token = await AsyncStorage.getItem("token");

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/job-vacancies/${id}/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Lamaran kerja berhasil dikirim");
        navigation.navigate("JobVacancyScreen");
      } else if (response.status === 409) {
        Alert.alert("Error", "Anda sudah melamar pekerjaan ini");
      } else {
        Alert.alert("Error", "Server Error");
      }
    } catch (error) {
      Alert.alert("Error", "Server Error");
    } finally {
      setApplying(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchJobDetails();
    }, [id])
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#243d8f" />
      </View>
    );
  }

  if (!jobDetails) {
    return (
      <View style={styles.container}>
        <Text>Detail tidak tersedia</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{jobDetails.job_title}</Text>
      <View style={styles.row}>
        <Text style={styles.field}>Lokasi</Text>
        <Text style={styles.value}>{jobDetails.location}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.field}>Jenis Kepegawaian</Text>
        <Text style={styles.value}>{jobDetails.employee_type}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.field}>Min. Pendidikan</Text>
        <Text style={styles.value}>{jobDetails.education_type}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.field}>Bidang</Text>
        <Text style={styles.value}>{jobDetails.job_specialization}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.field}>Gender</Text>
        <Text style={styles.value}>{jobDetails.gender}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.field}>Max. Usia</Text>
        <Text style={styles.value}>{jobDetails.age} tahun</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.field}>Tanggal Dibuat</Text>
        <Text style={styles.value}>
          {new Date(jobDetails.created_at).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.field}>Tanggal Berakhir</Text>
        <Text style={styles.value}>
          {new Date(jobDetails.end_at).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.applyButton, applying && styles.disabledButton]}
        onPress={handleApply}
        disabled={applying}
      >
        {applying ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.applyButtonText}>Apply</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    alignItems: "flex-start",
  },
  field: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    width: 170,
  },
  value: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  applyButton: {
    marginTop: 24,
    backgroundColor: "#243d8f",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
});
