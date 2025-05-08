import * as VideoThumbnails from "expo-video-thumbnails";
import { Image, StyleSheet, View } from "react-native";

import { useEffect, useState } from "react";

interface IVideoThumbnailProps {
  videoUri: string;
}

export default function VideoThumbnail({ videoUri }: IVideoThumbnailProps) {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const generateThumbnail = async () => {
      try {
        const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
          time: 15000,
        });
        setImage(uri);
      } catch (e) {
        console.warn(e);
      }
    };

    generateThumbnail().then();
  }, []);

  return (
    <View style={styles.thumbnailContainer}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <View />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  thumbnailContainer: {
    width: 40,
    height: 40,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "gray",
    aspectRatio: 1,
  },
  image: {
    // asp
    width: "100%",
    height: "100%",
  },
});
