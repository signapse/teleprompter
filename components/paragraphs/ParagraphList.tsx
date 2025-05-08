import {
  StyleSheet,
  FlatList,
  Text,
  View,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
} from "react-native";
import ParagraphListItem from "@/components/paragraphs/ParagraphListItem";
import { IParagraph } from "@/types/paragraph";
import { useCallback, useState } from "react";
import ParagraphOptionsModal from "../modals/ParagraphOptionsModal";

interface IParagraphsListProps {
  paragraphs: IParagraph[];
  selection: IParagraph[];
  toggleParagraphSelection: (item: IParagraph) => void;
  refetch: () => void;
  error: string | undefined;
}

export default function ParagraphList({
  paragraphs,
  selection,
  toggleParagraphSelection,
  refetch,
  error,
}: IParagraphsListProps) {
  const [activeItem, setActiveItem] = useState<IParagraph | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const renderItem = ({ item }: { item: IParagraph }) => {
    const isSelected = selection.some(
      (selectedItem) => selectedItem.id === item.id
    );

    return (
      <ParagraphListItem
        paragraph={item}
        isSelected={isSelected}
        onItemSelect={() => toggleParagraphSelection(item)}
        handleOpenModal={handleOpenModal}
      />
    );
  };

  const handleOpenModal = (item: IParagraph) => {
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
    refetch();
    // Implement your custom logic here, like refreshing data
  }, []);

  // Refreshing logic for onRefresh property
  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    handlePullDown(); // Call the function on pull down
    // Simulate network request
    setTimeout(() => setIsRefreshing(false), 1000);
  }, [handlePullDown]);

  if (error) {
    return (
      <View style={styles.listContainer}>
        <ScrollView
          contentContainerStyle={styles.noDataContainer}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.noDataText}>{error}</Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      {activeItem ? (
        <ParagraphOptionsModal
          isVisible={modalVisible}
          onClose={handleCloseModal}
          paragraph={activeItem}
        />
      ) : null}
      {paragraphs.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.noDataContainer}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.noDataText}>No paragraphs available</Text>
        </ScrollView>
      ) : (
        <FlatList
          data={paragraphs}
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
