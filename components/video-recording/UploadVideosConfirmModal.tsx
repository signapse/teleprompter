import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import Button from "../ui/button/Button";
import { useRecordings } from "../providers/RecordingsProvider";
import { useRecordingsSelectionContext } from "../providers/RecordingsSelectionProvider";

interface Props {
  modalVisible: boolean;
  toggleModalVisibility: () => void;
  onClose: () => void;
  //   onContinue: () => void;
}

export default function UploadVideosConfirmModal({
  modalVisible,
  toggleModalVisibility,
  onClose,
  //   onContinue,
}: Props) {
  //   const { clientFilter } = useRecordings();
  //   const { selection } = useRecordingsSelectionContext();

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      onRequestClose={toggleModalVisibility}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Upload Videos to HUB</Text>
          {/* {clientFilter ? (
            <>
              <Text style={styles.modalText}>
                Are you sure you want to send {selection.length} item(s) to the
                hub? Once uploaded they will disapear from the Teleprompter app.
              </Text>
              <View style={styles.modalActionButtons}>
                <Button
                  style={{ flex: 1 }}
                  variant="outline"
                  onPress={onClose}
                  title="Cancel"
                />
                <Button
                  style={{ flex: 1 }}
                  onPress={onContinue}
                  title="Continue"
                />
              </View>
            </>
          ) : (
            <> */}
          <Text style={styles.modalText}>
            You need to select a client before you can upload recordings to the
            hub.
          </Text>
          <View style={styles.modalActionButtons}>
            <Button style={{ flex: 1 }} onPress={onClose} title="Cancel" />
          </View>
          {/* </> */}
          {/* )} */}
        </View>
      </View>
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
