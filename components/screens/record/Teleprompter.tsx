import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useSettings } from "../../providers/SettingsProvider";
import { useRecordingContext } from "../../providers/RecordingProvider";
import { CameraType, CameraView } from "expo-camera";
import { useParagraphSelectionContext } from "../../providers/ParagraphSelectionProvider";
import TopBar from "./TopBar";
import CountdownOverlay from "./CountdownOverlay";
import AutomaticVerticalScroll from "./AutomaticVerticalScroll";

interface ICameraConfig {
  facing: CameraType;
}

const cameraConfig: ICameraConfig = {
  facing: "front",
};

export default function Teleprompter() {
  const {
    state: { backgroundColor },
  } = useSettings();

  const { activeItem } = useParagraphSelectionContext();

  const {
    isRecording,
    cameraRef,
    countdownSecondsLeft,
    recordingSessionFinished,
  } = useRecordingContext();

  if (!activeItem) {
    return (
      <View>
        <Text>Something went wrong. No active paragraph to record.</Text>
      </View>
    );
  }

  return (
    <View style={styles.teleprompter}>
      <TopBar />
      <View
        style={[
          styles.teleprompterContent,
          {
            backgroundColor,
          },
        ]}
      >
        {recordingSessionFinished ? (
          <View
            style={{
              top: "50%",
              bottom: "50%",
              gap: 10,
              marginTop: -24,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 24,
                color: "white",
              }}
            >
              Recording Session Finished
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                color: "white",
              }}
            >
              All paragraphs have been recorded.
            </Text>
          </View>
        ) : (
          <>
            {countdownSecondsLeft ? (
              <CountdownOverlay />
            ) : isRecording ? (
              <AutomaticVerticalScroll text={activeItem.text} />
            ) : null}
          </>
        )}
      </View>
      <CameraView
        mode="video"
        style={styles.camera}
        facing={cameraConfig.facing}
        ref={cameraRef}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  teleprompter: {
    flex: 1,
    height: "100%",
  },
  teleprompterContent: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
  },
  camera: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 0,
  },
});
