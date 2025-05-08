import { View, Text, StyleSheet } from "react-native";
import { useSettings } from "../../providers/SettingsProvider";
import Button from "../../ui/button/Button";
import { useRecordingContext } from "@/components/providers/RecordingProvider";

export default function CountdownOverlay() {
  const {
    state: { textColor, fontSize },
  } = useSettings();

  const {
    countdownSecondsLeft,
    isCountdownPaused,
    startCountdown,
    pauseCountdown,
    resetCountdown,
  } = useRecordingContext();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text
          style={[
            {
              color: textColor,
              fontSize: fontSize,
              lineHeight: fontSize * 1.6,
            },
          ]}
        >
          Recording starts in: {countdownSecondsLeft}
        </Text>
        <View style={styles.actions}>
          <Button
            title="Reset"
            variant="secondary"
            style={{
              flex: 1,
            }}
            size="large"
            onPress={resetCountdown}
          />
          <Button
            title={isCountdownPaused ? "Resume" : "Pause"}
            style={{
              flex: 1,
            }}
            size="large"
            onPress={isCountdownPaused ? startCountdown : pauseCountdown}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  content: {
    gap: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 6,
  },
});
