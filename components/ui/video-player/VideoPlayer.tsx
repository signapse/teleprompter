import React from "react";
import { StyleSheet, View } from "react-native";
import { ResizeMode, Video } from "expo-av";

interface Props {
  src: string;
}

export default function VideoPlayer({ src }: Props) {
  return (
    // <View>
    <Video
      source={{
        uri: src,
      }}
      style={styles.video}
      useNativeControls // Enables play/pause and other controls
      resizeMode={ResizeMode.CONTAIN} // Adjusts the video scaling
      isLooping={false} // Set to true if you want the video to loop
    />
    // </View>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   // backgroundColor: "#000",
  //   // justifyContent: "center",
  //   // alignItems: "center",
  // },
  video: {
    width: "100%",
    height: 300,
  },
});
