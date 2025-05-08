import { useParagraphs } from "@/components/providers/ParagraphsProvider";
import { useDebounceValue } from "@/hooks/useDebounceValue";
import { useState, useEffect } from "react";
import { View, TextInput, StyleSheet } from "react-native";

export default function SearchBar() {
  const [inputValue, setInputValue] = useState<string>("");

  const { setSearchQuery } = useParagraphs();

  const [debouncedValue] = useDebounceValue(inputValue, 500);

  useEffect(() => {
    setSearchQuery(debouncedValue);
  }, [debouncedValue]);

  return (
    <View style={styles.searchBar}>
      <TextInput
        style={styles.searchInput}
        placeholderTextColor="black"
        placeholder="Search by video label"
        value={inputValue}
        onChangeText={setInputValue} // Update state when text changes
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    paddingHorizontal: 8,
    paddingBottom: 10,
    height: 50,
  },
  searchInput: {
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: "#FBFCFE",
    color: "black",
    fontSize: 16,
  },
});
