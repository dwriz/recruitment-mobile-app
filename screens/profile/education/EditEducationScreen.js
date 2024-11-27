import React, { useState, useEffect } from "react";
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

export default function EditEducationScreen({ route, navigation }) {
  const { education } = route.params;

  const [titleEducation, setTitleEducation] = useState(
    education.title_education || ""
  );
  const [educationType, setEducationType] = useState(null);
  const [educationGrade, setEducationGrade] = useState(
    education.education_grade || ""
  );
  const [fieldOfStudy, setFieldOfStudy] = useState(
    education.education_field_study || ""
  );
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

      const educationTypeId = educationData.data.educationLevels.find(
        (level) => level.param_data === education.education_type
      )?.id;
      const yearStartId = yearsData.data.years.find(
        (year) => year.param_data === education.year_education_start
      )?.id;
      const monthStartId = monthsData.data.months.find(
        (month) => month.param_data === education.month_education_start
      )?.id;
      const yearEndId = yearsData.data.years.find(
        (year) => year.param_data === education.year_education_end
      )?.id;
      const monthEndId = monthsData.data.months.find(
        (month) => month.param_data === education.month_education_end
      )?.id;

      setEducationType(educationTypeId || null);
      setYearStart(yearStartId || null);
      setMonthStart(monthStartId || null);
      setYearEnd(yearEndId || null);
      setMonthEnd(monthEndId || null);

      setLoading(false);
    } catch (error) {
      Alert.alert("Error", "Server Error");
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOptions();
  }, []);

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
      Alert.alert("Error", "Semua input harus terisi");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/educations/${education.id}`,
        {
          method: "PUT",
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
        Alert.alert("Success", "Riwayat pendidikan berhasil diperbarui");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Gagal memperbarui riwayat pendidikan");
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
        placeholder="Institution Name"
        value={titleEducation}
        onChangeText={setTitleEducation}
      />
      <View style={styles.dropdown}>
        <Picker
          selectedValue={educationType}
          onValueChange={(itemValue) => setEducationType(itemValue)}
        >
          <Picker.Item label="Select Education Level" value={null} />
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
        placeholder="GPA / Grade"
        value={educationGrade}
        onChangeText={setEducationGrade}
      />
      <TextInput
        style={styles.input}
        placeholder="Field of Study"
        value={fieldOfStudy}
        onChangeText={setFieldOfStudy}
      />
      <View style={styles.dropdown}>
        <Picker
          selectedValue={yearStart}
          onValueChange={(itemValue) => setYearStart(itemValue)}
        >
          <Picker.Item label="Start Year" value={null} />
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
          <Picker.Item label="Start Month" value={null} />
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
          <Picker.Item label="End Year" value={null} />
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
          <Picker.Item label="End Month" value={null} />
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
        <Text style={styles.saveButtonText}>Save</Text>
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
