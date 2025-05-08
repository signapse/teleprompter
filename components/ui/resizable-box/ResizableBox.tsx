import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, PanResponder, Dimensions } from "react-native";

interface Props {
  children: React.ReactNode;
}

export default function ResizableBox({ children }: Props) {
  // State for width and height
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(150);

  // Refs to store the last width and height
  const lastWidth = useRef(width);
  const lastHeight = useRef(height);

  // Get screen dimensions for bounds checking
  const screen = Dimensions.get("window");

  // PanResponder for resizing
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // No action needed on grant
      },
      onPanResponderMove: (evt, gestureState) => {
        // Calculate new width and height
        let newWidth = lastWidth.current + gestureState.dx;
        let newHeight = lastHeight.current + gestureState.dy;

        // Define minimum and maximum sizes
        const MIN_WIDTH = 100;
        const MIN_HEIGHT = 100;
        const MAX_WIDTH = screen.width - 40; // 20 padding on each side
        const MAX_HEIGHT = screen.height - 40;

        // Apply constraints
        newWidth = Math.max(MIN_WIDTH, Math.min(newWidth, MAX_WIDTH));
        newHeight = Math.max(MIN_HEIGHT, Math.min(newHeight, MAX_HEIGHT));

        setWidth(newWidth);
        setHeight(newHeight);
      },
      onPanResponderRelease: () => {
        // Update the last width and height
        lastWidth.current = width;
        lastHeight.current = height;
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.resizableBox,
          {
            width: width,
            height: height,
          },
        ]}
      >
        <View style={styles.frameContent}>
          <Text style={styles.label}>(1/10) 1231_LiveNation_label_1</Text>
          <Text style={styles.time}>
            {/* Insert your time variable here */}
          </Text>
          {/*<Text style={styles.scriptText}>{activeSelection.text}</Text>*/}
          {/* Assuming ScrollableTextView is another component */}
          <Text>Scrollable Text Here</Text>
        </View>
        {/* Resize Handle */}
        <View {...panResponder.panHandlers} style={styles.resizeHandle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Optional: Center the resizable box
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  resizableBox: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  frameContent: {
    flex: 1,
    padding: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  time: {
    fontSize: 14,
    color: "#666666",
  },
  scriptText: {
    fontSize: 14,
    color: "#333333",
  },
  resizeHandle: {
    width: 20,
    height: 20,
    backgroundColor: "#cccccc",
    position: "absolute",
    bottom: 0,
    right: 0,
    borderTopLeftRadius: 10,
    // Optional: Add a visual indicator (e.g., diagonal lines)
    // You can customize this as per your design
  },
});
