import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { PropsWithChildren } from "react";
import VideoPlayer from "../ui/video-player/VideoPlayer";
import { IRecording } from "@/types/recording";
import { removeRecordingByLabel } from "@/lib/local-storage/videoRecordingStorageHelpers";
import { TabBarIcon } from "../navigation/TabBarIcon";
import { useNavigation } from "expo-router";
import { useParagraphSelectionContext } from "../providers/ParagraphSelectionProvider";
import { useParagraphs } from "../providers/ParagraphsProvider";
import { useRecordings } from "../providers/RecordingsProvider";
import { useRecordingsSelectionContext } from "../providers/RecordingsSelectionProvider";

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
  recording: IRecording;
}>;

export default function RecordingOptionsModal({
  isVisible,
  onClose,
  recording,
}: Props) {
  const navigation = useNavigation();
  const { selectOne } = useParagraphSelectionContext();

  const { refetch: refetchRecordings } = useRecordings();
  const { clearSelection } = useRecordingsSelectionContext();

  const { findOneByVideoLabel, refetch: refetchParagraphs } = useParagraphs();

  const onReRecord = () => {
    const paragraph = findOneByVideoLabel(recording.videoLabel);

    if (paragraph) {
      selectOne(paragraph);

      navigation.navigate("record" as never);

      onClose();
    }

    // TODO handle error here
  };

  const onSendToHub = () => {
    // TODO
    // /multipart
    // step 1: upload video to s3 (multipart - call endpoint)
    // onSuccess /multipart/complete
    // step 2: set as is_teleprompter = false flag (Remove from teleprompter app)
    // onSuccess /translation/complete
    // step 3: remove local recording
    // step 4: reftech
  };

  const onDeleteRecording = async () => {
    try {
      // step 1: remove local recording
      await removeRecordingByLabel(recording.videoLabel);

      refetchRecordings();

      refetchParagraphs(); // TODO - is this needed ??

      clearSelection();

      // step 2: close modal
      onClose();

      // step 3: show toast
    } catch (error) {
      // toast error
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.modalContent}>
        <View style={styles.modalTitleContainer}>
          <Text style={styles.title} ellipsizeMode="tail" numberOfLines={1}>
            {recording.videoLabel}
          </Text>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <TabBarIcon name="close" color="#8D96A2" size={24} />
          </Pressable>
        </View>

        <ScrollView>
          <View style={styles.container}>
            <View style={styles.section}>
              <View style={styles.sectionContent}>
                <Pressable
                  style={[
                    styles.link,
                    {
                      borderBottomWidth: 1,
                      borderBottomColor: "#E5E9EF",
                    },
                  ]}
                  onPress={onSendToHub}
                >
                  <View style={styles.linkTitleWithIcon}>
                    <View style={styles.linkIconContainer}>
                      <TabBarIcon
                        name="cloud-upload"
                        color="#FBFCFE"
                        size={20}
                      />
                    </View>
                    <Text style={styles.linkTitle}>Upload To Hub</Text>
                  </View>
                  <TabBarIcon
                    name="chevron-forward"
                    size={20}
                    color="#99A3AF"
                  />
                </Pressable>
                <Pressable
                  style={[
                    styles.link,
                    {
                      borderBottomWidth: 1,
                      borderBottomColor: "#E5E9EF",
                    },
                  ]}
                  onPress={onDeleteRecording}
                >
                  <View style={styles.linkTitleWithIcon}>
                    <View style={styles.linkIconContainer}>
                      <TabBarIcon name="trash" color="#FBFCFE" size={20} />
                    </View>
                    <Text style={styles.linkTitle}>Delete Recording</Text>
                  </View>
                  <TabBarIcon
                    name="chevron-forward"
                    size={20}
                    color="#99A3AF"
                  />
                </Pressable>
                <Pressable style={styles.link} onPress={onReRecord}>
                  <View style={styles.linkTitleWithIcon}>
                    <View style={styles.linkIconContainer}>
                      <TabBarIcon name="videocam" color="#FBFCFE" size={20} />
                    </View>
                    <Text style={styles.linkTitle}>Record Again</Text>
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
              <Text style={styles.sectionTitle}>Video Preview</Text>
              <View style={styles.sectionContent}>
                <VideoPlayer src={recording.videoUri} />
              </View>
            </View>
          </View>
          {/* <Pressable style={styles.link} onPress={onSendToHub}>
              <View style={styles.linkTitleWithIcon}>
                <View style={styles.linkIconContainer}>
                  <TabBarIcon name="videocam" color="#FBFCFE" size={20} />
                </View>
                <Text style={styles.linkTitle}>Upload To Hub</Text>
              </View>
              <TabBarIcon name="cloud-upload" size={20} color="#99A3AF" />
            </Pressable>
          </View> */}
        </ScrollView>

        {/* <View style={styles.actions}>
          <Pressable style={styles.actionButton} onPress={onSendToHub}>
            <Icon style={{ color: "white" }} name="upload" />
            <Text style={styles.buttonLabel}>Send To Hub</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={onDeleteRecording}>
            <Icon style={{ color: "white" }} name="delete" />
            <Text style={styles.buttonLabel}>Delete Recording</Text>
          </Pressable>

          <Pressable style={styles.actionButton} onPress={onReRecord}>
            <Icon style={{ color: "white" }} name="videocam" />
            <Text style={styles.buttonLabel}>Rerecord</Text>
          </Pressable>
        </View> */}

        {/* <View style={styles.paragraphTextContainer}>
          <Text style={styles.paragraphTextTitle}>Video Preview:</Text>
          <VideoPlayer src={recording.videoUri} />
        </View> */}
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
});
