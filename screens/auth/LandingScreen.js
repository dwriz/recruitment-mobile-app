import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function LandingScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  async function fetchData(page) {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/job-vacancies?page=${page}&limit=5`
      );
      const result = await response.json();
      if (result.statusCode === 200) {
        setData(result.data.job_vacancies);
        setTotalPages(result.data.totalPages);
      }
    } catch (error) {
      Alert.alert("Error", "Server Error");
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData(currentPage);
    }, [currentPage])
  );

  function renderCard({ item }) {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.title}>{item.job_title}</Text>
        <View style={styles.row}>
          <Text style={styles.field}>Lokasi</Text>
          <Text style={styles.value}>{item.location}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.field}>Jenis Kepegawaian</Text>
          <Text style={styles.value}>{item.employee_type}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.field}>Min. Edukasi</Text>
          <Text style={styles.value}>{item.education_type}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.field}>Bidang</Text>
          <Text style={styles.value}>{item.job_specialization}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.field}>Tanggal Berakhir</Text>
          <Text style={styles.value}>
            {new Date(item.end_at).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  function PaginationControls() {
    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.button, currentPage === 1 && styles.disabledButton]}
          onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <Text style={styles.buttonText}>Sebelum</Text>
        </TouchableOpacity>
        <Text style={styles.pageIndicator}>
          Halaman {currentPage} dari {totalPages}
        </Text>
        <TouchableOpacity
          style={[
            styles.button,
            currentPage === totalPages && styles.disabledButton,
          ]}
          onPress={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          <Text style={styles.buttonText}>Berikut</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading && currentPage === 1 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#243d8f" />
        </View>
      ) : data.length > 0 ? (
        <FlatList
          data={data}
          renderItem={renderCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>Tidak ada data</Text>
        </View>
      )}
      <PaginationControls />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#f5f5f5",
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#243d8f",
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  field: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    width: 160,
  },
  value: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  button: {
    padding: 10,
    backgroundColor: "#243d8f",
    borderRadius: 4,
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  pageIndicator: {
    fontSize: 16,
    fontWeight: "bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 18,
    color: "#888",
  },
});
