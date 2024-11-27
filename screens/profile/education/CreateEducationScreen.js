import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function CreateEducationScreen({ navigation }) {
  const [titleEducation, setTitleEducation] = useState("");
  const [educationType, setEducationType] = useState(null);
  const [educationGrade, setEducationGrade] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [yearStart, setYearStart] = useState(null);
  const [monthStart, setMonthStart] = useState(null);
  const [yearEnd, setYearEnd] = useState(null);
  const [monthEnd, setMonthEnd] = useState(null);

  const [educationLevels, setEducationLevels] = useState([]);
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);

  const [loading, setLoading] = useState(true);

  async function fetchOptions() {
    try {
      const educationResponse = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/options/education-levels`
      );
      const educationData = await educationResponse.json();
      setEducationLevels(educationData.data.educationLevels);

      const yearsResponse = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/options/years`
      );
      const yearsData = await yearsResponse.json();
      setYears(yearsData.data.years);

      const monthsResponse = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/options/months`
      );
      const monthsData = await monthsResponse.json();
      setMonths(monthsData.data.months);

      setLoading(false);
    } catch (error) {
      Alert.alert("Error", "Server Error");
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchOptions();
    }, [])
  );

  async function handleSave() {
    if (
      !titleEducation ||
      !educationType ||
      !educationGrade ||
      !fieldOfStudy ||
      !yearStart ||
      !monthStart ||
      !yearEnd ||
      !monthEnd
    ) {
      Alert.alert("Error", "Semua input harus diisi.");
      return;
    }

    if (
      yearEnd < yearStart ||
      (yearEnd === yearStart && monthEnd < monthStart)
    ) {
      Alert.alert("Error", "Tanggal selesai harus setelah tanggal mulai.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/educations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title_education: titleEducation,
            education_type: educationType,
            education_grade: educationGrade,
            education_field_study: fieldOfStudy,
            year_education_start: yearStart,
            month_education_start: monthStart,
            year_education_end: yearEnd,
            month_education_end: monthEnd,
          }),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Riwayat pendidikan berhasil ditambahkan.");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Gagal menambahkan riwayat pendidikan.");
      }
    } catch (error) {
      Alert.alert("Error", "Server Error");
    }
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
      <TextInput
        style={styles.input}
        placeholder="Nama Institusi Pendidikan"
        value={titleEducation}
        onChangeText={setTitleEducation}
      />
      <View style={styles.dropdown}>
        <Picker
          selectedValue={educationType}
          onValueChange={(itemValue) => setEducationType(itemValue)}
        >
          <Picker.Item label="Tingkat Pendidikan" value={null} />
          {educationLevels.map((level) => (
            <Picker.Item
              key={level.id}
              label={level.param_data}
              value={level.id}
            />
          ))}
        </Picker>
      </View>
      <TextInput
        style={styles.input}
        placeholder="IPK / Nilai"
        value={educationGrade}
        onChangeText={setEducationGrade}
      />
      <TextInput
        style={styles.input}
        placeholder="Bidang Studi"
        value={fieldOfStudy}
        onChangeText={setFieldOfStudy}
      />
      <View style={styles.dropdown}>
        <Picker
          selectedValue={yearStart}
          onValueChange={(itemValue) => setYearStart(itemValue)}
        >
          <Picker.Item label="Tahun Mulai" value={null} />
          {years.map((year) => (
            <Picker.Item
              key={year.id}
              label={year.param_data}
              value={year.id}
            />
          ))}
        </Picker>
      </View>
      <View style={styles.dropdown}>
        <Picker
          selectedValue={monthStart}
          onValueChange={(itemValue) => setMonthStart(itemValue)}
        >
          <Picker.Item label="Bulan Mulai" value={null} />
          {months.map((month) => (
            <Picker.Item
              key={month.id}
              label={month.param_data}
              value={month.id}
            />
          ))}
        </Picker>
      </View>
      <View style={styles.dropdown}>
        <Picker
          selectedValue={yearEnd}
          onValueChange={(itemValue) => setYearEnd(itemValue)}
        >
          <Picker.Item label="Tahun Selesai" value={null} />
          {years.map((year) => (
            <Picker.Item
              key={year.id}
              label={year.param_data}
              value={year.id}
            />
          ))}
        </Picker>
      </View>
      <View style={styles.dropdown}>
        <Picker
          selectedValue={monthEnd}
          onValueChange={(itemValue) => setMonthEnd(itemValue)}
        >
          <Picker.Item label="Bulan Selesai" value={null} />
          {months.map((month) => (
            <Picker.Item
              key={month.id}
              label={month.param_data}
              value={month.id}
            />
          ))}
        </Picker>
      </View>
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
  dropdown: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    justifyContent: "center",
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
