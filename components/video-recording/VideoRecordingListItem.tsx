import VideoThumbnail from "@/components/VideoThumbnail";
import { Pressable, StyleSheet, View, Text } from "react-native";
import Checkbox from "../ui/checkbox/Checkbox";
import { IRecording } from "@/types/recording";
import { TabBarIcon } from "../navigation/TabBarIcon";
import { useEffect, useState } from "react";
import {
  convertBytesToMB,
  localRecordingToVideoFile,
  VideoFile,
} from "@/lib/fileUtils";

interface IVideoRecordingListItemProps {
  recording: IRecording;
  isSelected: boolean;
  onItemSelect: () => void;
  handleOpenModal: (item: IRecording) => void;
}

export default function VideoRecordingListItem({
  recording,
  isSelected,
  onItemSelect,
  handleOpenModal,
}: IVideoRecordingListItemProps) {
  const [file, setFile] = useState<VideoFile | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      const file = await localRecordingToVideoFile(
        recording.videoUri,
        recording.videoLabel
      );
      setFile(file);
    };

    fetchFile();
  }, []);

  return (
    <View style={styles.listItem}>
      <Checkbox
        label={file?.name || recording.videoLabel}
        secondaryLabel={file?.size ? `${convertBytesToMB(file.size)} MB` : ""}
        labelStyle={styles.label}
        secondaryLabelStyle={styles.secondaryLabelStyle}
        onValueChange={onItemSelect}
        labelNumberOfLines={1}
        labelEllipsizeMode="tail"
        value={isSelected}
      />
      <VideoThumbnail videoUri={recording.videoUri} />
      <Pressable
        style={styles.optionsButton}
        onPress={() => handleOpenModal(recording)}
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
    backgroundColor: "transparent",
    borderBottomColor: "#D8DEE4",
    borderBottomWidth: 1,
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
    fontSize: 14,
  },
  secondaryLabelStyle: {
    color: "black",
    flexShrink: 1,
    fontSize: 14,
  },
});
