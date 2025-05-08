import React, { useState, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import { SelectOption } from "@/components/ui/select/Select";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";

type FilterModalProps<T> = {
  isVisible: boolean;
  onClose: () => void;
  items: T[];
  hasAnyItems?: boolean;
  selectedValue?: string;
  getLabel: (item: T) => string;
  getValue: (item: T) => string;
  onSelect: (option: SelectOption) => void;
  title?: string;
  placeholder?: string;
};

export default function FilterModal<T>({
  isVisible,
  onClose,
  items,
  selectedValue,
  hasAnyItems,
  getLabel,
  getValue,
  onSelect,
  title = "Filter Items",
  placeholder = "Search...",
}: FilterModalProps<T>) {
  const [inputValue, setInputValue] = useState<string>("");

  const filterOptions: SelectOption[] = useMemo(() => {
    if (!items) return [];

    const itemMap = new Map<string, SelectOption>();
    let optionsArray: SelectOption[] = [];

    items.forEach((item) => {
      const label = getLabel(item);
      const value = getValue(item);

      if (
        !itemMap.has(value) &&
        label.toLowerCase().includes(inputValue.toLowerCase())
      ) {
        const option = { label, value };
        itemMap.set(value, option);

        // Add selected option directly to the start if it matches.
        if (selectedValue && value === selectedValue) {
          optionsArray.unshift(option);
        } else {
          optionsArray.push(option);
        }
      }
    });

    return optionsArray;
  }, [items, inputValue, selectedValue, getLabel, getValue]);

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.modalContent}>
        <View style={styles.modalTitleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <TabBarIcon name="close" color="#8D96A2" size={24} />
          </Pressable>
        </View>

        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              placeholderTextColor="black"
              value={inputValue}
              onChangeText={setInputValue}
            />
          </View>
          <View style={styles.optionsContainer}>
            <Text style={styles.sectionTitle}>Options</Text>
            {filterOptions.length > 0 ? (
              <View style={styles.section}>
                {filterOptions.map((option, index) => (
                  <Pressable
                    key={option.value}
                    style={[
                      styles.filter,
                      index !== filterOptions.length - 1 && {
                        borderBottomWidth: 1,
                        borderColor: "#D8DEE4",
                      },
                    ]}
                    onPress={() => onSelect(option)}
                  >
                    <Text
                      style={styles.filterTitle}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {option.label}
                    </Text>
                    {selectedValue === option.value && (
                      <TabBarIcon name="checkmark" size={20} color="#99A3AF" />
                    )}
                  </Pressable>
                ))}
              </View>
            ) : (
              <Text style={styles.noResultsPlaceholder}>
                {hasAnyItems ? (
                  <Text>No results match your query "{inputValue}"</Text>
                ) : (
                  <Text>No items to filter</Text>
                )}
              </Text>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    height: "85%",
    width: "100%",
    backgroundColor: "#E5E9EF",
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    position: "absolute",
    bottom: 0,
  },
  modalTitleContainer: {
    height: "10%",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "black",
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 12,
    gap: 22,
  },
  section: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FBFCFE",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  noResultsPlaceholder: {
    fontSize: 16,
    color: "#8D96A2",
    textAlign: "center",
    marginTop: 20,
  },
  filter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    height: 60,
  },
  filterTitle: {
    flex: 1,
    fontSize: 16,
    color: "black",
  },
  closeButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
  },
  inputContainer: {
    borderRadius: 8,
    overflow: "hidden",
    height: 50,
  },
  input: {
    backgroundColor: "#FBFCFE",
    padding: 14,
    flex: 1,
    fontSize: 16,
  },
  optionsContainer: {
    gap: 10,
  },
});
