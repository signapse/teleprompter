import { SafeAreaView, StyleSheet } from "react-native";
import FiltersBar from "./FiltersBar";
import ListItemSelectionBar from "./ListItemSelectionBar";
import SearchBar from "./SearchBar";

export default function HeaderRecordings() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <SearchBar />
      <FiltersBar />
      <ListItemSelectionBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#1F3D5A",
  },
});
