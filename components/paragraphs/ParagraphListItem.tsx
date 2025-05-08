import { ThemedView } from "@/components/ThemedView";
import { Pressable, StyleSheet, View, Text } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { getRecordingByVideoLabel } from "@/lib/local-storage/videoRecordingStorageHelpers";
import { IParagraph } from "@/types/paragraph";

import Checkbox from "../ui/checkbox/Checkbox";
import { IRecording } from "@/types/recording";
import { TabBarIcon } from "../navigation/TabBarIcon";
import { useIsFocused } from "@react-navigation/native";
import { useRecordings } from "../providers/RecordingsProvider";

interface Props {
  paragraph: IParagraph;
  isSelected: boolean;
  handleOpenModal: (item: IParagraph) => void;
  onItemSelect: () => void;
}

export default function ParagraphListItem({
  paragraph,
  isSelected,
  handleOpenModal,
  onItemSelect,
}: Props) {
  const [paragraphRecording, setParagraphRecording] =
    useState<IRecording | null>(null);

  const { recordings } = useRecordings();

  useEffect(() => {
    (async () => {
      const recording = await getRecordingByVideoLabel(paragraph.videoLabel);
      setParagraphRecording(recording);
    })();
    // }
  }, [recordings?.length, paragraph.videoLabel]);

  return (
    <View
      style={[
        styles.listItem,
        {
          backgroundColor: paragraphRecording ? "#D4FBCF" : "transparent",
          borderBottomColor: "#D8DEE4",
          borderBottomWidth: 1,
        },
      ]}
    >
      <Checkbox
        label={paragraph.videoLabel}
        labelStyle={styles.label}
        secondaryLabel={paragraph.text}
        secondaryLabelStyle={styles.text}
        onValueChange={(e) => {
          onItemSelect();
        }}
        labelNumberOfLines={1}
        labelEllipsizeMode="tail"
        value={isSelected}
      />
      <Pressable
        style={styles.optionsButton}
        onPress={() => handleOpenModal(paragraph)}
      >
        <TabBarIcon
          name="ellipsis-vertical-outline"
          color="#8D96A2"
          size={14}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingLeft: 10,
    gap: 10,
  },
  optionsButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontWeight: "bold",
    color: "black",
    flexShrink: 1,
    fontSize: 16,
  },
  text: {
    color: "black",
    flexShrink: 1,
    fontSize: 14,
  },
});
