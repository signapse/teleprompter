import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import React, { useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  selectedValue: string | null;
  onSelect: (opt: SelectOption | null) => void;
  withChevron?: boolean;
  selectedOptionComponent?: React.ReactNode;
  modalTitle?: string;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
  withChevron = true,
  selectedOptionComponent,
  modalTitle,
  placeholder,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const handleSelect = (value: string) => {
    const option = options.find((option) => option.value === value);

    console.log("option", option);

    onSelect(option || null);

    setModalVisible(false);
  };

  console.log("selectedValue", typeof selectedValue);

  return (
    <View style={styles.container}>
      {/* Trigger button for opening the modal */}
      <View style={styles.select}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.selectedText}>
            {selectedValue
              ? selectedOptionComponent ||
                options.find(
                  (option) => option.value.toString() === selectedValue
                )?.label
              : placeholder || "Select an option"}
          </Text>

          {withChevron && (
            <TabBarIcon
              size={16}
              name={modalVisible ? "chevron-up" : "chevron-down"}
              color="#8D96A2"
              style={{ marginLeft: 8 }}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Modal for displaying options */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPressOut={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {modalTitle ? (
                <Text style={styles.modalTitle}>{modalTitle}</Text>
              ) : null}
              <FlatList
                data={options}
                keyExtractor={(item) => item.value?.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    style={[
                      styles.option,
                      {
                        paddingHorizontal: 15,
                        backgroundColor:
                          selectedValue === item.value.toString()
                            ? "pink"
                            : "white",
                      },
                    ]}
                    onPress={() => handleSelect(item.value)}
                  >
                    <Text style={styles.optionText}>{item.label}</Text>
                  </Pressable>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default Select;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  select: {
    gap: 8,
    backgroundColor: "#FBFCFE",
  },
  label: {
    color: "white",
    fontSize: 16,
  },
  selectButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
  },
  selectedText: {
    color: "white",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  option: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
});

// import { MutableRefObject, useRef, useState } from "react";
// import { View, Text, StyleSheet, Platform } from "react-native";
// import DropDownPicker from "react-native-dropdown-picker";
// // import { useOnClickOutside } from "@/hooks/useOnClickOutside";
// import {
//   BackgroundColor,
//   FontSize,
//   ScrollSpeed,
//   TextColor,
// } from "@/components/providers/SettingsProvider";

// export interface SelectOption {
//   label: string;
//   value: string;
// }

// interface Props {
//   value: string | null;
//   options: SelectOption[];
//   label?: string;
//   setValue: (opt: SelectOption | null) => void;
// }

// export default function Select({ value, options, label, setValue }: Props) {
//   const [open, setOpen] = useState(false);

//   const dropdownRef = useRef<View | null>(null);

//   // useOnClickOutside(dropdownRef, () => {
//   //   setOpen(false);
//   // });

//   const onSelect = (callback: any) => {
//     const value = callback();
//     setValue(options.find((option) => option.value === value) || null);
//   };

//   // Close dropdown when clicking outside (on blur)
//   const handleOutsidePress = () => {
//     if (open) {
//       setOpen(false);
//     }
//   };

//   return (
//     <View
//       ref={dropdownRef}
//       style={[styles.select, open ? styles.selectOpen : null]}
//     >
//       {label ? <Text style={styles.label}>{label}</Text> : null}
//       <DropDownPicker
//         open={open}
//         value={value}
//         multiple={false}
//         style={{
//           backgroundColor: "pink",
//           borderRadius: 6,
//           borderColor: "grey",
//         }}
//         selectedItemContainerStyle={{
//           backgroundColor: "pink",
//         }}
//         items={options}
//         //   setOpen={setOpen} // Open dropdown
//         setValue={onSelect}
//         onClose={() => {
//           console.log("onClose");
//           setOpen(false);
//         }}
//         setOpen={setOpen} // Open dropdown
//         zIndex={3000} // Adjust this value if needed
//         zIndexInverse={1000} // Ensures the dropdown is on top of others
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   select: {
//     // borderColor: "red",
//     // backgroundColor: "orange",
//     // borderWidth: 1,
//     borderRadius: 6,
//     // zIndex: 100,
//   },
//   selectOpen: {
//     zIndex: 3000, // Give a high zIndex when dropdown is open
//     ...(Platform.OS === "android" ? { elevation: 10 } : {}),
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#000",
//     marginBottom: 10,
//   },
// });
