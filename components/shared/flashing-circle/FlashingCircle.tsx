import React, { useEffect } from "react";
import { View, Animated, StyleSheet } from "react-native";

interface FlashingCircleProps {
  color?: "green" | "red"; // Accept only 'green' or 'red'
}

const FlashingCircle: React.FC<FlashingCircleProps> = ({ color = "green" }) => {
  const animatedValue = new Animated.Value(0); // Initial animated value

  useEffect(() => {
    // Start the flashing animation
    const startFlashing = () => {
      animatedValue.setValue(0);
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    startFlashing();

    // Cleanup animation on unmount
    return () => animatedValue?.stop?.();
  }, [animatedValue]);

  // Interpolate the animated value to control the opacity
  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      color === "red" ? "rgba(255, 0, 0, 0.5)" : "rgba(0, 255, 0, 0.5)",
      color === "red" ? "rgba(255, 0, 0, 1)" : "rgba(0, 255, 0, 1)",
    ],
  });

  return (
    <Animated.View
      style={[styles.circle, { backgroundColor: backgroundColor }]}
    />
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 12,
    height: 12,
    borderRadius: 10, // To make it a circle
  },
});

export default FlashingCircle;
