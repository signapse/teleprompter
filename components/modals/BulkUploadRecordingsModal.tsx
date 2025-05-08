import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Switch,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { TabBarIcon } from "../navigation/TabBarIcon";
import { useRecordings } from "../providers/RecordingsProvider";
import { useParagraphs } from "../providers/ParagraphsProvider";
import { useRecordingsSelectionContext } from "../providers/RecordingsSelectionProvider";
import FilesToUploadList from "./FilesToUploadList";
import Button from "../ui/button/Button";
import { localRecordingToVideoFile, VideoFile } from "@/lib/fileUtils";
import useBulkUploadVideoTranslations from "@/hooks/useBulkUploadVideoTranslations";
import { removeRecordingsByLabels } from "@/lib/local-storage/videoRecordingStorageHelpers";

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

export default function BulkUploadRecordingsModal({
  isVisible,
  onClose,
}: Props) {
  const [loadingFiles, setLoadingFiles] = useState(false);

  const [replaceVideos, setReplaceVideos] = useState(false);
  const [filesToUpload, setFilesToUpload] = useState<VideoFile[]>([]);

  const {
    clientFilter,
    refetch: refetchRecordings,
    toggleClientFilter,
    toggleFolderFilter,
  } = useRecordings();
  const { refetch: refetchParagraphs } = useParagraphs();

  const { clearSelection: clearParagraphsSelection } =
    useRecordingsSelectionContext();

  const { selection: recordings, clearSelection: clearRecordingsSelection } =
    useRecordingsSelectionContext();

  const { uploadFiles, isUploading, uploadStatuses, logs } =
    useBulkUploadVideoTranslations({
      onSuccess: async (uploadedFileIds: string[]) => {
        // Step 1: Remove recordings from local storage
        await removeRecordingsByLabels(uploadedFileIds);

        refetchParagraphs();
        refetchRecordings();

        // Step 4: Show success toast
        console.log("SUCCESS", uploadedFileIds);
        console.log("uploadedFileIds", uploadedFileIds);

        // Step 5: Close the modal
        // onClose();
        // clearParagraphsSelection();
        // clearRecordingsSelection(); // TODO Step 3: clear selection from the uploaded ones
        // TODO Step 3: clear selection from the uploaded ones
        // TODO: Handle not uploaded ones
      },
    });

  console.log("uploadStatuses", uploadStatuses);

  // this converts paths to files
  useEffect(() => {
    (async () => {
      try {
        setLoadingFiles(true);

        const convertedFiles: VideoFile[] = await Promise.all(
          recordings.map(async (recording) => {
            const fileData = await localRecordingToVideoFile(
              recording.videoUri,
              recording.videoLabel
            );
            return fileData;
          })
        );

        setFilesToUpload(convertedFiles);
      } catch (error) {
        console.error("Error converting files", error);
      } finally {
        setLoadingFiles(false);
      }
    })();
  }, [recordings]);

  // cleanup
  useEffect(() => {
    return () => {
      console.log("cleanup");
    };
  }, []);

  const onUpload = async () => {
    if (!clientFilter?.value) {
      throw new Error("Client is not selected");
    } else {
      try {
        console.log("uploading files", filesToUpload);

        await uploadFiles({
          clientId: parseInt(clientFilter.value),
          files: filesToUpload, // Ensure files are fully loaded before upload
          replace: replaceVideos,
        });
      } catch (error) {
        console.error("Error uploading files", error);
      }
    }
  };

  const handleClose = () => {
    // TODO - better check if upload is done - INVALIDATE HERE
    // if (logs?.length > 0) {
    //   clearParagraphsSelection();
    //   clearRecordingsSelection();
    //   toggleClientFilter(null);
    //   toggleFolderFilter(null);
    // }

    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <SafeAreaView style={styles.modalContent}>
        <View style={styles.modalTitleContainer}>
          <Text style={styles.title}>Upload Recordings to HUB</Text>
          <Pressable style={styles.closeButton} onPress={handleClose}>
            <TabBarIcon name="close" color="#8D96A2" size={24} />
          </Pressable>
        </View>
        <View style={styles.container}>
          <View style={styles.section}>
            <View style={styles.sectionContent}>
              <View style={styles.switch}>
                <Text style={styles.switchTitle}>Replace Videos</Text>
                <Switch
                  trackColor={{ true: "#A7ABFB" }}
                  thumbColor="#FBFCFE"
                  ios_backgroundColor="#8D96A2"
                  onValueChange={setReplaceVideos}
                  value={replaceVideos}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Files To Upload</Text>
            {loadingFiles ? (
              <ActivityIndicator />
            ) : (
              <View style={styles.sectionContent}>
                <FilesToUploadList
                  uploadStatuses={uploadStatuses || {}}
                  filesToUpload={filesToUpload}
                  refetch={() => {
                    console.log("refetch");
                  }}
                />
              </View>
            )}
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            style={{
              flex: 1,
            }}
            onPress={handleClose}
            title="Cancel"
            variant="outline"
          />
          <Button
            style={{
              flex: 1,
            }}
            disabled={isUploading}
            loading={isUploading}
            onPress={onUpload}
            title="Upload"
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    height: "90%",
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
    // flex: 1,
  },
  switch: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    height: 60,
  },
  switchTitle: {
    fontSize: 16,
    color: "black",
  },

  listItem: {
    paddingVertical: 16,
    paddingHorizontal: 10,
    gap: 16,
  },
  labelWithProgress: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    color: "black",
    flex: 1,
  },
  errorMessage: {
    padding: 10,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 8,
    backgroundColor: "#f8d7da",
  },
  actions: {
    flexDirection: "row",
    gap: 6,
    padding: 10,
    backgroundColor: "#FBFCFE",

    borderTopColor: "#D8DEE4",
    borderTopWidth: 1,
  },
});

{
  /* <Text>
{(() => {
  switch (uploadStatuses[fileToUpload.id]) {
    case 100:
      return (
        <View
          style={{
            backgroundColor: "green",
            borderRadius: 999999,
            width: 28,
            height: 28,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TabBarIcon
            name="checkmark-outline"
            color="white"
            size={20}
          />
        </View>
      );
    case -1:
      return (
        <View
          style={{
            backgroundColor: "grey",
            borderRadius: 999999,
            width: 28,
            height: 28,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TabBarIcon
            name="repeat-outline"
            color="white"
            size={20}
          />
        </View>
      );
    default:
      if (
        uploadStatuses[fileToUpload.id] &&
        uploadStatuses[fileToUpload.id] !== 0
      ) {
        return (
          <Text>
            {uploadStatuses[fileToUpload.id] || 0}%
          </Text>
        );
      }
      return null;
  }
})()}
</Text> */
}

{
  /* {loadingFiles ? (
                <Text>Loading files...</Text>
              ) : ( */
}

// mockFiles.map((fileToUpload, index) => (
//   <View
//     style={[
//       styles.listItem,
//       index !== mockFiles.length - 1 && {
//         borderBottomColor: "#D8DEE4",
//         borderBottomWidth: 1,
//       },
//     ]}
//   >
//     <View style={styles.labelWithProgress}>
//       <Text
//         style={styles.label}
//         numberOfLines={1}
//         ellipsizeMode="tail"
//       >
//         {fileToUpload.id}
//       </Text>
//     </View>
//     {/* {uploadStatuses[fileToUpload.id] === -1 && ( */}
//     <View style={styles.errorMessage}>
//       <Text>
//         Something went wrong when uploading this recording to
//         the hub.
//       </Text>
//     </View>
//     {/* )} */}
//   </View>
// ))
// )}
