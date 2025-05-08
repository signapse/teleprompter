import { StyleSheet, Pressable } from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useState } from "react";
import BulkUploadRecordingsModal from "../modals/BulkUploadRecordingsModal";
import UploadVideosConfirmModal from "./UploadVideosConfirmModal";
import { useRecordings } from "../providers/RecordingsProvider";

interface Props {
  disabled: boolean;
}

export default function UploadVideoButtonDialog({ disabled }: Props) {
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);

  const { clientFilter } = useRecordings();

  const onPress = () => {
    if (clientFilter) {
      setUploadModalVisible(true);
    } else {
      setConfirmModalVisible(true);
    }
  };

  return (
    <>
      <Pressable
        style={[
          styles.primaryActionButton,
          {
            opacity: disabled ? 0.5 : 1,
            backgroundColor: disabled ? "#99A3AF" : "#7DBA76",
          },
        ]}
        onPress={onPress}
        disabled={disabled}
        accessibilityLabel="Upload Recordings"
        accessibilityHint="Opens the upload recordings dialog"
      >
        <TabBarIcon name="cloud-upload" color="#FBFCFE" size={32} />
      </Pressable>
      <UploadVideosConfirmModal
        modalVisible={confirmModalVisible}
        toggleModalVisibility={() =>
          setConfirmModalVisible((prevVisible) => !prevVisible)
        }
        onClose={() => setConfirmModalVisible(false)}
        // onContinue={() => {
        //   setConfirmModalVisible(false);
        //   setUploadModalVisible(true);
        // }}
      />
      <BulkUploadRecordingsModal
        isVisible={uploadModalVisible}
        onClose={() => setUploadModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  primaryActionButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 70,
    width: 70,
    borderRadius: 9999,
  },
});
