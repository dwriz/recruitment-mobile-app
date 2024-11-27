import { StyleSheet, Text, View } from "react-native";

export default function JobVacancyDetailScreen({ navigation, route }) {
  const { id } = route.params;
  return (
    <View style={styles.container}>
      <Text>JobVacancyDetailScreen</Text>
      <Text>{id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
