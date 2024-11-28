import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditExperienceScreen({ navigation, route }) {
  const { experience } = route.params;

  const [title, setTitle] = useState(experience.title || "");
  const [employeeType, setEmployeeType] = useState(
    experience.employee_type || null
  );
  const [companyName, setCompanyName] = useState(experience.company_name || "");
  const [location, setLocation] = useState(experience.location || "");
  const [stillActive, setStillActive] = useState(experience.still_active);
  const [startYear, setStartYear] = useState(
    experience.start_year_experience || null
  );
  const [startMonth, setStartMonth] = useState(
    experience.start_month_experience || null
  );
  const [endYear, setEndYear] = useState(
    experience.end_year_experience || null
  );
  const [endMonth, setEndMonth] = useState(
    experience.end_month_experience || null
  );
  const [descExperience, setDescExperience] = useState(
    experience.desc_experience || ""
  );
  const [descSkill, setDescSkill] = useState(experience.desc_skill || "");

  const [employeeTypes, setEmployeeTypes] = useState([]);
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchOptions() {
    try {
      const employeeTypeResponse = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/options/employee-types`
      );
      const employeeTypeData = await employeeTypeResponse.json();
      setEmployeeTypes(employeeTypeData.data.employeeTypes);

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

  useEffect(() => {
    fetchOptions();
  }, []);

  function handleStillActiveChange(value) {
    setStillActive(value);
    if (value === 1) {
      setEndYear(null);
      setEndMonth(null);
    }
  }

  async function handleUpdate() {
    if (
      !title ||
      !employeeType ||
      !companyName ||
      !location ||
      stillActive === null ||
      !startYear ||
      !startMonth ||
      (stillActive === 0 && (!endYear || !endMonth)) ||
      !descExperience ||
      !descSkill
    ) {
      Alert.alert("Error", "Semua input harus diisi");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/experiences/${experience.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            employee_type: employeeType,
            company_name: companyName,
            location,
            still_active: stillActive,
            start_year_experience: startYear,
            start_month_experience: startMonth,
            end_year_experience: stillActive === 1 ? null : endYear,
            end_month_experience: stillActive === 1 ? null : endMonth,
            desc_experience: descExperience,
            desc_skill: descSkill,
          }),
        }
      );

      if (response.ok) {
        Alert.alert("Success", "Riwayat pengalaman berhasil diperbarui");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Gagal memperbarui riwayat pengalaman");
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TextInput
          style={styles.input}
          placeholder="Posisi"
          value={title}
          onChangeText={setTitle}
        />
        <View style={styles.dropdown}>
          <Picker
            selectedValue={employeeType}
            onValueChange={(itemValue) => setEmployeeType(itemValue)}
          >
            <Picker.Item label="Jenis Kepegawaian" value={null} />
            {employeeTypes.map((type) => (
              <Picker.Item
                key={type.id}
                label={type.param_data}
                value={type.id}
              />
            ))}
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Nama Perusahaan"
          value={companyName}
          onChangeText={setCompanyName}
        />
        <TextInput
          style={styles.input}
          placeholder="Lokasi"
          value={location}
          onChangeText={setLocation}
        />
        <View style={styles.dropdown}>
          <Picker
            selectedValue={stillActive}
            onValueChange={handleStillActiveChange}
          >
            <Picker.Item label="Status Pekerjaan" value={null} />
            <Picker.Item label="Masih bekerja di sini" value={1} />
            <Picker.Item label="Sudah tidak bekerja di sini" value={0} />
          </Picker>
        </View>
        <View style={styles.dropdown}>
          <Picker
            selectedValue={startYear}
            onValueChange={(itemValue) => setStartYear(itemValue)}
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
            selectedValue={startMonth}
            onValueChange={(itemValue) => setStartMonth(itemValue)}
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
        {stillActive === 0 && (
          <>
            <View style={styles.dropdown}>
              <Picker
                selectedValue={endYear}
                onValueChange={(itemValue) => setEndYear(itemValue)}
              >
                <Picker.Item label="Tahun Berakhir" value={null} />
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
                selectedValue={endMonth}
                onValueChange={(itemValue) => setEndMonth(itemValue)}
              >
                <Picker.Item label="Bulan Berakhir" value={null} />
                {months.map((month) => (
                  <Picker.Item
                    key={month.id}
                    label={month.param_data}
                    value={month.id}
                  />
                ))}
              </Picker>
            </View>
          </>
        )}
        <TextInput
          style={styles.input}
          placeholder="Deskripsi"
          value={descExperience}
          onChangeText={setDescExperience}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Keahlian"
          value={descSkill}
          onChangeText={setDescSkill}
          multiline
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
          <Text style={styles.saveButtonText}>Update</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 16,
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
