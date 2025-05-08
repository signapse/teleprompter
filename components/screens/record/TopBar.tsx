import { useParagraphSelectionContext } from "@/components/providers/ParagraphSelectionProvider";
import { useRecordingContext } from "@/components/providers/RecordingProvider";
import { IParagraph } from "@/types/paragraph";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  currentPosition: number;
  selection: IParagraph[];
  activeSelection: IParagraph;
  isRecording: boolean;
  time: string;
}

export default function TopBar() {
  const { selection, activeItemPosition, activeItem } =
    useParagraphSelectionContext();

  const { recordingTime, isRecording } = useRecordingContext();

  return (
    <View style={styles.topBar}>
      <View style={styles.badge}>
        <Text style={styles.badgeLabel}>
          {activeItemPosition + 1} / {selection.length}
        </Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeLabel} numberOfLines={1} ellipsizeMode="tail">
          {activeItem?.videoLabel}
        </Text>
      </View>
      {isRecording && <Text style={styles.time}>{recordingTime}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "100%",
    height: 40,
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    zIndex: 100,
  },
  badge: {
    flexShrink: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    paddingHorizontal: 12,
    backgroundColor: "#5356B3",
    color: "black",
    borderRadius: 24,
    maxWidth: 400,
  },
  badgeLabel: {
    fontSize: 16,
    color: "#FBFCFE",
  },

  time: {
    fontSize: 24,
    color: "#FBFCFE",
    marginLeft: "auto",
  },
});
