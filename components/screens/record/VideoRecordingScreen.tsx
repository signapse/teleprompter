import { SafeAreaView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import Teleprompter from "@/components/screens/record/Teleprompter";
import ControlsBar from "./ControlsBar";
import { useParagraphSelectionContext } from "@/components/providers/ParagraphSelectionProvider";
import { useRecordingContext } from "@/components/providers/RecordingProvider";
import { useParagraphs } from "@/components/providers/ParagraphsProvider";
import { useRecordings } from "@/components/providers/RecordingsProvider";
import PreRecordingChecklistDialog from "@/components/screens/record/PreRecordingChecklistModal";

function VideoRecording() {
  const { invalidateRecording } = useRecordingContext();
  const { clearActiveItem, clearSelection } = useParagraphSelectionContext();
  const { refetch: refetchParagraphs } = useParagraphs();
  const { refetch: refetchRecordings } = useRecordings();

  useEffect(() => {
    return () => {
      invalidateRecording();
      clearActiveItem();
      clearSelection();
      refetchParagraphs();
      refetchRecordings();
    };
  }, []);

  return (
      <SafeAreaView>
        <View style={styles.container}>
          <Teleprompter />
          <ControlsBar />
        </View>
      </SafeAreaView>
  );
}


export default function VideoRecordingScreen() {
  const [
    isPreRecordingChecklistDialogVisible,
    setIsPreRecordingChecklistDialogVisible,
  ] = useState(true);

  return (
    <>
      <PreRecordingChecklistDialog
        isVisible={isPreRecordingChecklistDialogVisible}
        onClose={() => setIsPreRecordingChecklistDialogVisible(false)}
        toggleModalVisibility={() =>
          setIsPreRecordingChecklistDialogVisible((prev) => !prev)
        }
      />
      <VideoRecording />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flexDirection: "row",
    height: "100%",
  },
});
