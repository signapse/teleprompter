import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { PropsWithChildren } from "react";
import { IParagraph } from "@/types/paragraph";
import useGetVideoRecordingByVideoLabel from "@/hooks/useGetVideoRecordingByVideoLabel";
import { useParagraphSelectionContext } from "../providers/ParagraphSelectionProvider";
import { useNavigation } from "expo-router";
import VideoPlayer from "../ui/video-player/VideoPlayer";
import { TabBarIcon } from "../navigation/TabBarIcon";

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
  paragraph: IParagraph;
}>;

export default function ParagraphOptionsModal({
  isVisible,
  onClose,
  paragraph,
}: Props) {
  const recording = useGetVideoRecordingByVideoLabel(paragraph.videoLabel);
  const navigation = useNavigation();
  const { selectOne } = useParagraphSelectionContext();

  const onRecordPress = () => {
    selectOne(paragraph);

    navigation.navigate("record" as never);

    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.modalContent}>
        <View style={styles.modalTitleContainer}>
          <Text style={styles.title} ellipsizeMode="tail" numberOfLines={1}>
            {paragraph.videoLabel}
          </Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <TabBarIcon name="close" color="#8D96A2" size={24} />
          </Pressable>
        </View>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.section}>
              <View style={styles.sectionContent}>
                <Pressable style={styles.link} onPress={onRecordPress}>
                  <View style={styles.linkTitleWithIcon}>
                    <View style={styles.linkIconContainer}>
                      <TabBarIcon name="videocam" color="#FBFCFE" size={20} />
                    </View>
                    <Text style={styles.linkTitle}>
                      {recording ? "Record Again" : "Record Video"}
                    </Text>
                  </View>
                  <TabBarIcon
                    name="chevron-forward"
                    size={20}
                    color="#99A3AF"
                  />
                </Pressable>
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Paragraph Text</Text>
              <View style={styles.sectionContent}>
                <Text style={styles.paragraphText}>{paragraph.text}</Text>
              </View>
            </View>
            {recording && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Video Preview</Text>
                <View style={styles.sectionContent}>
                  <VideoPlayer src={recording.videoUri} />
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    height: "85%",
    width: "100%",
    backgroundColor: "#E5E9EF",
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    position: "absolute",
    bottom: 0,
  },
  modalTitleContainer: {
    height: "10%",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "black",
    fontSize: 16,
  },
  closeButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
  },
  container: {
    flex: 1,
    padding: 12,
    gap: 22,
  },
  linkTitleWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    height: 60,
  },
  linkTitle: {
    fontSize: 16,
    color: "black",
  },
  linkIconContainer: {
    backgroundColor: "#2F516E",
    padding: 10,
    borderRadius: 10,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionContent: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FBFCFE",
  },

  paragraphText: {
    paddingVertical: 24,
    paddingHorizontal: 10,
    fontSize: 16,
  },
});
