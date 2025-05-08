import { StyleSheet, TouchableOpacity } from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useState } from "react";
import { Dialog } from "@rneui/base";
import { ThemedText } from "@/components/ThemedText";

interface IUploadParagraphsButtonDialogProps {
  disabled: boolean;
}

export default function UploadParagraphsButtonDialog({
  disabled,
}: IUploadParagraphsButtonDialogProps) {
  const [uploadDialogVisible, setUploadDialogVisible] = useState(false);

  const toggleUploadDialog = (): void => {
    setUploadDialogVisible((prevVisible) => !prevVisible);
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.primaryActionButton,
          { opacity: disabled ? 0.5 : 1 }, // Use dynamic opacity
        ]}
        onPress={toggleUploadDialog}
        disabled={disabled}
        accessibilityLabel="Upload Video"
        accessibilityHint="Opens the video upload dialog"
      >
        <TabBarIcon name="cloud-upload" color="white" />
      </TouchableOpacity>

      <Dialog
        isVisible={uploadDialogVisible}
        onBackdropPress={toggleUploadDialog}
      >
        <Dialog.Title title="Upload Dialog" />
        <ThemedText>
          Dialog body text. Add relevant information here.
        </ThemedText>
      </Dialog>
    </>
  );
}

const styles = StyleSheet.create({
  primaryActionButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    width: 60,
    borderRadius: 9999,
    backgroundColor: "green", // Set directly to avoid redundant styles
  },
});
