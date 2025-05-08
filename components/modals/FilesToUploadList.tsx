import {
  StyleSheet,
  FlatList,
  Text,
  View,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useCallback, useState } from "react";
import { TabBarIcon } from "../navigation/TabBarIcon";
import { convertBytesToMB, VideoFile } from "@/lib/fileUtils";

interface IParagraphsListProps {
  filesToUpload: VideoFile[];
  uploadStatuses: Record<string, number>;
  refetch: () => void;
}

export default function FilesToUploadList({
  filesToUpload,
  uploadStatuses,
  refetch,
}: IParagraphsListProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const renderItem = ({ item, index }: { item: VideoFile; index: number }) => {
    return (
      <View
        style={[
          styles.listItem,
          index === filesToUpload.length - 1 && { borderBottomWidth: 0 },
        ]}
      >
        <View style={styles.labelWithProgress}>
          <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">
            {item.name} - {convertBytesToMB(item.size)}MB
          </Text>
          <Text>
            {(() => {
              switch (uploadStatuses[item.id]) {
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
                      <TabBarIcon name="cloud-upload" color="white" size={16} />
                    </View>
                  );
                default:
                  if (
                    uploadStatuses[item.id] &&
                    uploadStatuses[item.id] !== 0
                  ) {
                    return <Text>{uploadStatuses[item.id] || 0}%</Text>;
                  }
                  return null;
              }
            })()}
          </Text>
        </View>
        {uploadStatuses[item.id] === -1 && (
          <View style={styles.errorMessage}>
            <Text numberOfLines={3} ellipsizeMode="tail">
              Something went wrong when uploading this recording to the hub.
            </Text>
          </View>
        )}
      </View>
    );
  };

  const handlePullDown = useCallback(() => {
    console.log("Pulled down while at the top!");
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    handlePullDown();
    setTimeout(() => setIsRefreshing(false), 1000);
  }, [handlePullDown]);

  return (
    <View>
      {filesToUpload.length === 0 ? (
        <ScrollView
          contentContainerStyle={styles.noDataContainer}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.noDataText}>No files to upload</Text>
        </ScrollView>
      ) : (
        <FlatList
          data={filesToUpload}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.flatListContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flatListContent: {
    // paddingBottom: 150, // Adds padding at the bottom to ensure scroll to end is visible
  },
  listItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 10,
    gap: 16,
    borderBottomColor: "#D8DEE4",
    borderBottomWidth: 1,
    maxHeight: 150,
    minHeight: 60,
  },
  labelWithProgress: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 14,
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
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  noDataText: {
    fontSize: 18,
    color: "#888",
  },
});
