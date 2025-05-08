import FilterParagraphsByClientModal from "@/components/layout/header-paragraphs/FilterParagraphsByClientModal";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useParagraphs } from "@/components/providers/ParagraphsProvider";
import { useState } from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import FilterParagraphsByFolderModal from "./FilterParagraphsByFolderModal";

export default function FiltersBar() {
  const [isClientFiltersModalVisible, setIsClientFiltersModalVisible] =
    useState(false);
  const [isFolderFiltersModalVisible, setIsFolderFiltersModalVisible] =
    useState(false);

  const { allParagraphs, clientFilter, folderFilter } = useParagraphs();

  const disabled = !allParagraphs || allParagraphs.length === 0;

  return (
    <>
      <FilterParagraphsByClientModal
        isVisible={isClientFiltersModalVisible}
        onClose={() => setIsClientFiltersModalVisible(false)}
      />
      <FilterParagraphsByFolderModal
        isVisible={isFolderFiltersModalVisible}
        onClose={() => setIsFolderFiltersModalVisible(false)}
      />
      <View style={styles.filtersBar}>
        <Pressable
          style={[styles.filtersButton, disabled && { opacity: 0.5 }]}
          disabled={disabled}
          onPress={() => setIsFolderFiltersModalVisible(true)}
        >
          <Text>Folder</Text>
          {folderFilter?.value && (
            <View style={styles.filtersCountBadgeContainer}>
              <Text style={styles.filtersBadgeText}>1</Text>
            </View>
          )}
          <TabBarIcon name="chevron-down" size={17} color="#8D96A2" />
        </Pressable>
        <Pressable
          style={[styles.filtersButton, disabled && { opacity: 0.5 }]}
          disabled={disabled}
          onPress={() => setIsClientFiltersModalVisible(true)}
        >
          <Text>Client</Text>
          {clientFilter?.value && (
            <View style={styles.filtersCountBadgeContainer}>
              <Text style={styles.filtersBadgeText}>1</Text>
            </View>
          )}
          <TabBarIcon name="chevron-down" size={17} color="#8D96A2" />
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  filtersBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    gap: 6,
    paddingHorizontal: 8,
    paddingTop: 8,
    backgroundColor: "#F8FAFD",
  },
  filtersButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 40,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#D8DEE4",
    backgroundColor: "#FBFCFE",
  },
  filtersCountBadgeContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#C1FCB8",
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  filtersBadgeText: {
    fontWeight: "bold",
  },
});
