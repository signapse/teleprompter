import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
} from "react-native";

import VideoRecordingList from "@/components/video-recording/VideoRecordingList";
import VideoRecordingListActionsBar from "@/components/video-recording/VideoRecordingListActionsBar";
import { useRecordings } from "@/components/providers/RecordingsProvider";
import { useRecordingsSelectionContext } from "@/components/providers/RecordingsSelectionProvider";

export default function VideoRecordingListScreen() {
  const { recordings, isLoading, error } = useRecordings();

  const { selection, toggleRecordingSelection } =
    useRecordingsSelectionContext();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator style={styles.activity} size="large" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>{error.message}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <VideoRecordingList
        recordings={recordings}
        selection={selection}
        toggleRecordingSelection={toggleRecordingSelection}
      />
      <VideoRecordingListActionsBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FBFCFE",
  },
  activity: {
    paddingVertical: 26,
  },
});
