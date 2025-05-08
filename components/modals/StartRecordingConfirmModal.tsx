import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Button from "../ui/button/Button";

interface RecordDialogProps {
  recordDialogVisible: boolean;
  toggleRecordDialog: () => void;
  onClose: () => void;
}

const StartRecordingConfirmModal: React.FC<RecordDialogProps> = ({
  recordDialogVisible,
  toggleRecordDialog,
  onClose,
}) => {
  const navigation = useNavigation();

  const handleStartRecording = () => {
    navigation.navigate("record" as never); // Navigate to the "Record" screen

    toggleRecordDialog(); // Close the modal
  };

  return (
    <Modal
      //   animationType="slide"
      transparent={true}
      visible={recordDialogVisible}
      onRequestClose={toggleRecordDialog}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Record Videos</Text>
          <Text style={styles.modalText}>
            Are you sure you want to proceed to video recording?
          </Text>
          <View style={styles.modalActionButtons}>
            <Button
              variant="outline"
              style={{ flex: 1 }}
              onPress={onClose}
              title="Cancel"
            />

            <Button
              style={{ flex: 1 }}
              onPress={handleStartRecording}
              title="Continue"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default StartRecordingConfirmModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  modalActionButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
});
