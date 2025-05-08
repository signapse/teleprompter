import { useBLE } from "@/components/providers/ble/BLEContext";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useParagraphSelectionContext } from "@/components/providers/ParagraphSelectionProvider";
import { useRecordingContext } from "@/components/providers/RecordingProvider";
import { Link, useNavigation } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function ControlsBar() {
  const { selection, hasNextAvailableItem, getNextItem } =
    useParagraphSelectionContext();

  const { registerPedalEventHandler } = useBLE();

  // AFTER foot pedal:

  // OK:
  // videos saves
  // video jumps to next script
  // weird jump after saving through food pedal (switches to next script before actualy saves )
  // record button statys as rerecord

  // TODO
  // timer does not reset when recording is stopped

  const {
    setup,
    cleanup,
    startRecording,
    isRecording,
    stopRecording,
    isRecordingComplete,
    invalidateRecording,
    countdownSecondsLeft,
    recordingSessionFinished,
  } = useRecordingContext();

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const isRecordingRef = useRef(isRecording);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // Ref to track the toggle state without causing re-renders
  // const isStartedRef = useRef(false);

  // FOOTPEDAL INIT
  useEffect(() => {
    setup(true);

    const handlePedalEvent = (event: string) => {
      if (event === "Left Pedal Pressed Down") {
        if (!isRecordingRef.current) {
          console.log("Starting recording");
          startRecording();
        } else {
          console.log("Stopping recording");
          stopRecording(true);
        }
      }
    };

    // Register the handler and get the unregister function
    const unregister = registerPedalEventHandler(handlePedalEvent);

    // Cleanup by unregistering the handler when the component unmounts
    return () => {
      unregister();
    };
  }, [registerPedalEventHandler]);

  const navigation = useNavigation();

  const onNavigateToNextScript = (): void => {
    invalidateRecording();
    getNextItem();
  };

  const onRerecord = () => {
    invalidateRecording();
    startRecording();
  };

  const onExitRecording = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.controlsBar} pointerEvents="box-none">
      <View style={styles.container}>
        {/* Footpedal specific - dont show any controls after finishing recording the last paragraph */}
        {!recordingSessionFinished && (
            isRecording ? (
              <View>
                <Pressable
                  onPress={() => stopRecording(true)}
                  style={styles.controlButton}
                >
                  <TabBarIcon color="#D4FBCF" name="save" />
                </Pressable>
                <Pressable
                  style={styles.controlButton}
                  onPress={() => stopRecording(false)}
                >
                  <TabBarIcon color="#D4FBCF" name="close" />
                </Pressable>
                {/* TODO - speed up */}
                {/* TODO - speed down */}
              </View>
            ) : (
              <View>
                <Link href="/settingsModal/video" asChild>
                  <Pressable style={styles.controlButton}>
                    <TabBarIcon color="#D4FBCF" name="cog" />
                  </Pressable>
                </Link>
                {isRecordingComplete ? (
                  <Pressable onPress={onRerecord} style={styles.controlButton}>
                    <TabBarIcon color="#D4FBCF" name="refresh" />
                  </Pressable>
                ) : (
                  <Pressable
                    disabled={!!countdownSecondsLeft}
                    onPress={startRecording}
                    style={[
                      styles.controlButton,
                      !!countdownSecondsLeft && styles.disabledButton,
                    ]}
                  >
                    <TabBarIcon color="#D4FBCF" name="videocam" />
                  </Pressable>
                )}
                {selection?.length > 1 && (
                  <Pressable
                    onPress={onNavigateToNextScript}
                    disabled={!isRecordingComplete || !hasNextAvailableItem}
                    style={[
                      styles.controlButton,
                      (!isRecordingComplete || !hasNextAvailableItem) &&
                        styles.disabledButton,
                    ]}
                  >
                    <TabBarIcon color="#D4FBCF" name="chevron-forward" />
                  </Pressable>
                )}
              </View>
            )
        )}
        <Pressable
          style={[styles.controlButton, { marginTop: "auto" }]}
          onPress={onExitRecording}
        >
          <TabBarIcon color="#D4FBCF" name="home" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  controlsBar: {
    justifyContent: "space-between",
    // top: 0,
    // right: 0,
    height: "100%",
    backgroundColor: "#062743",
    zIndex: 100,
    // maxWidth: 50,
    // flexShrink: 1,
  },
  container: {
    gap: 4,
    flex: 1,
  },
  controlButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
  },
  disabledButton: {
    opacity: 0.2,
  },
});
