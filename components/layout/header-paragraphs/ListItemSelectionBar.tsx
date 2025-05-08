import { useParagraphSelectionContext } from "@/components/providers/ParagraphSelectionProvider";
import { useParagraphs } from "@/components/providers/ParagraphsProvider";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function ListItemSelectionBar() {
  const { allParagraphs, paragraphs } = useParagraphs();
  const { selection, selectMany, clearSelection } =
    useParagraphSelectionContext();

  return (
    <View style={styles.listItemSelectionBar}>
      <View style={styles.selectedItemsContainer}>
        <Text style={styles.selectedItemsText}>
          Selected {selection.length}/{paragraphs.length}
        </Text>
      </View>
      <View style={styles.bulkActionButtonsContainer}>
        <Text style={styles.bulkActionTitle}>Select:</Text>
        <Pressable
          disabled={!allParagraphs}
          style={styles.bulkActionButton}
          onPress={() => selectMany(allParagraphs || [])}
        >
          <Text>All</Text>
        </Pressable>
        <Pressable style={styles.bulkActionButton} onPress={clearSelection}>
          <Text>Clear</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listItemSelectionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: "#FBFCFE",
    borderBottomColor: "#D8DEE4",
    borderBottomWidth: 2,
  },
  selectedItemsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  selectedItemsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  bulkActionTitle: {
    fontSize: 16,
    fontWeight: "semibold",
    color: "black",
  },
  bulkActionButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bulkActionButton: {
    backgroundColor: "#D8DEE4",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
});
