import { StyleSheet, View } from "react-native";
import StartRecordingButtonDialog from "@/components/shared/StartRecordingButtonDialog";
import UploadVideoButtonDialog from "@/components/video-recording/UploadVideoButtonDialog";
import { useRecordingsSelectionContext } from "../providers/RecordingsSelectionProvider";

export default function VideoRecordingListActionsBar() {
  const { selection } = useRecordingsSelectionContext();

  const isDisabled = selection.length === 0;

  return (
    <View style={styles.fixedActionButtons}>
      <StartRecordingButtonDialog disabled={isDisabled} />
      <UploadVideoButtonDialog disabled={isDisabled} />
    </View>
  );
}

const styles = StyleSheet.create({
  fixedActionButtons: {
    position: "absolute",
    right: 20,
    bottom: 20,
    left: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 1000,
    backgroundColor: "transparent",
  },
});
