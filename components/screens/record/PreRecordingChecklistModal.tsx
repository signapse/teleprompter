import Button from "@/components/ui/button/Button";
import Checkbox from "@/components/ui/checkbox/Checkbox";
import { useAppState } from "@/hooks/useAppState";
import { useInactivityTimer } from "@/hooks/useInactivityTimer";
import { useNavigation } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Modal,
} from "react-native";

interface CheckListState {
  sameBackground: boolean;
  fixedCamera: boolean;
  eyeLevelCamera: boolean;
  lightingSetup: boolean;
  preRecordingCheck: boolean;
  distanceFromCamera: boolean;
}

interface Props {
  isVisible: boolean;
  toggleModalVisibility: () => void;
  onClose: () => void;
}

export default function PreRecordingChecklistModal({
  isVisible,
  toggleModalVisibility,
  onClose,
}: Props) {
  const navigation = useNavigation();

  const appStatus = useAppState();

  const { resetInactivityTimer } = useInactivityTimer(-1, () => {
    console.log("Show the dialog after 20 minutes of inactivity");
    toggleModalVisibility();
  });

  const [checklist, setChecklist] = useState<CheckListState>({
    sameBackground: false,
    fixedCamera: false,
    eyeLevelCamera: false,
    lightingSetup: false,
    preRecordingCheck: false,
    distanceFromCamera: false,
  });

  const handleValueChange = (key: keyof CheckListState) => {
    setChecklist((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleDialogClose = () => {
    console.log("Closing the dialog");

    setChecklist({
      sameBackground: false,
      fixedCamera: false,
      eyeLevelCamera: false,
      lightingSetup: false,
      preRecordingCheck: false,
      distanceFromCamera: false,
    });

    onClose();
    // resetInactivityTimer();
  };

  const isReadyToRecord = Object.values(checklist).every((value) => value);

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={toggleModalVisibility}
    >
      <SafeAreaView style={styles.modalOverlay}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Pre-Recording Checklist</Text>
          <ScrollView>
            <View style={styles.list}>
              <Checkbox
                label="Same colour background as matches all translators to make it easier for the automatic chrome key."
                labelStyle={styles.checkboxLabel}
                onValueChange={() => handleValueChange("sameBackground")}
                value={checklist.sameBackground}
              />
              <Checkbox
                label="The camera setting and position should be fixed in the same place, never move them around or disassemble them."
                labelStyle={styles.checkboxLabel}
                onValueChange={() => handleValueChange("fixedCamera")}
                value={checklist.fixedCamera}
              />
              <Checkbox
                label="The camera lens should be on the same level as the translator's eye level to ensure the outcome looks professional by their sign and eye contact toward the camera."
                labelStyle={styles.checkboxLabel}
                onValueChange={() => handleValueChange("eyeLevelCamera")}
                value={checklist.eyeLevelCamera}
              />
              <Checkbox
                label="The lighting stands should be set and fixed behind the camera stand with the same temperature setting (Watts). However, this depends on the size of the room."
                labelStyle={styles.checkboxLabel}
                onValueChange={() => handleValueChange("lightingSetup")}
                value={checklist.lightingSetup}
              />
              <Checkbox
                label="Checklist before recording: Ensure no jewellery, messy hair, or dirty marks on clothes."
                labelStyle={styles.checkboxLabel}
                onValueChange={() => handleValueChange("preRecordingCheck")}
                value={checklist.preRecordingCheck}
              />
              <Checkbox
                label="Same distance from the translator stand to the camera tripod."
                labelStyle={styles.checkboxLabel}
                onValueChange={() => handleValueChange("distanceFromCamera")}
                value={checklist.distanceFromCamera}
              />
            </View>
          </ScrollView>
          <View style={styles.modalActionButtons}>
            <Button
              style={{ flex: 1 }}
              variant="outline"
              title="Home"
              onPress={() => {
                navigation.navigate("index" as never);
              }}
            />
            <Button
              style={{ flex: 1 }}
              disabled={!isReadyToRecord}
              title="Start Recording"
              onPress={handleDialogClose}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "95%",
    height: "95%",
    padding: 20,
    backgroundColor: "#FBFCFE",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  list: {
    marginTop: 20,
    minWidth: "100%",
    gap: 16,
    // width: 1200, // Ensures the checklist takes the full width of the modal
  },
  checkboxLabel: {
    fontSize: 18,
    color: "black",
  },
  modalActionButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
});
