import { ThemedView } from "@/components/ThemedView";
import {
  StyleSheet,
  FlatList,
  ScrollView,
  RefreshControl,
  Text,
  View,
} from "react-native";
import VideoRecordingListItem from "@/components/video-recording/VideoRecordingListItem";
import { useCallback, useState } from "react";
import RecordingOptionsModal from "../modals/RecordingOptionsModal";
import { IRecording } from "@/types/recording";

interface Props {
  recordings: IRecording[];
  selection: IRecording[];
  toggleRecordingSelection: (recording: IRecording) => void;
}

export default function VideoRecordingList({
  recordings,
  selection,
  toggleRecordingSelection,
}: Props) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [activeItem, setActiveItem] = useState<IRecording | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = ({ item }: { item: IRecording }) => {
    // TODO : optimise for perf
    const isSelected = Boolean(
      selection.find((selected) => selected.videoLabel === item.videoLabel)
    );

    return (
      <VideoRecordingListItem
        recording={item}
        isSelected={isSelected}
        onItemSelect={() => toggleRecordingSelection(item)}
        handleOpenModal={handleOpenModal}
      />
    );
  };
  const handleOpenModal = (item: IRecording) => {
    setActiveItem(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setActiveItem(null);
    setModalVisible(false);
  };

  // Callback function to be called on pull-down
  const handlePullDown = useCallback(() => {
    console.log("Pulled down while at the top!");
    // refetch();
    // Implement your custom logic here, like refreshing data
  }, []);

  // Refreshing logic for onRefresh property
  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    handlePullDown(); // Call the function on pull down
    // Simulate network request
    setTimeout(() => setIsRefreshing(false), 1000);
  }, [handlePullDown]);

  return (
    <View style={styles.listContainer}>
      {activeItem ? (
        <RecordingOptionsModal
          isVisible={modalVisible}
          onClose={handleCloseModal}
          recording={activeItem}
        />
      ) : null}
      {recordings.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.noDataContainer}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.noDataText}>No video recordings available</Text>
        </ScrollView>
      ) : (
        <FlatList
          data={recordings}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.videoLabel}-${index}`}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  list: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#D8DEE4",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20, // Provide some padding for pull-down gesture
  },
  noDataText: {
    fontSize: 18,
    color: "#888",
  },
});
