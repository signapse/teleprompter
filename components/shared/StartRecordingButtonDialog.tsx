import { Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useState } from "react";
import { Button, Dialog } from "@rneui/base";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import StartRecordingConfirmModal from "../modals/StartRecordingConfirmModal";

interface IStartRecordingButtonDialogProps {
  disabled: boolean;
}

export default function StartRecordingButtonDialog({
  disabled,
}: IStartRecordingButtonDialogProps) {
  const [recordDialogVisible, setRecordDialogVisible] = useState(false);

  // const hasSelectionWithRecordings

  const toggleRecordDialog = (): void => {
    setRecordDialogVisible((prevVisible) => !prevVisible);
  };

  return (
    <>
      <Pressable
        style={[
          styles.primaryActionButton,
          {
            opacity: disabled ? 0.5 : 1,
            backgroundColor: disabled ? "#99A3AF" : "#6E72D8",
          }, // Handle opacity for disabled state directly
        ]}
        onPress={toggleRecordDialog}
        disabled={disabled}
        accessibilityLabel="Start Recording"
        accessibilityHint="Opens the recording dialog"
      >
        <TabBarIcon name="videocam" color="#FBFCFE" size={32} />
      </Pressable>

      <StartRecordingConfirmModal
        recordDialogVisible={recordDialogVisible}
        toggleRecordDialog={() =>
          setRecordDialogVisible((prevVisible) => !prevVisible)
        }
        onClose={() => setRecordDialogVisible(false)}
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
