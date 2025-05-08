import { useSettings } from "@/components/providers/SettingsProvider";
import React, { useRef, useEffect, useState } from "react";
import { Animated, Text, View, StyleSheet, Easing } from "react-native";

interface Props {
  text: string;
}

const AutomaticVerticalScroll = ({ text }: Props) => {
  const {
    state: { backgroundColor, textColor, fontSize, scrollSpeed },
  } = useSettings();

  const scrollY = useRef(new Animated.Value(1000)).current; // Set initial value way below the container
  const textHeight = useRef(0);
  const containerHeight = useRef(0); // To store container height

  const measureText = (event: any) => {
    textHeight.current = event.nativeEvent.layout.height;
  };

  const measureContainer = (event: any) => {
    const height = event.nativeEvent.layout.height;
    containerHeight.current = height;
    scrollY.setValue(height); // Start just outside the bottom of the container
  };

  const startScrolling = () => {
    Animated.timing(scrollY, {
      toValue: -textHeight.current, // Move upwards to align with top
      duration: scrollSpeed || 10000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      startScrolling();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <View
      style={[
        styles.automaticVerticalScroll,
        {
          backgroundColor: backgroundColor,
        },
      ]}
      onLayout={measureContainer}
    >
      <Animated.View style={[{ transform: [{ translateY: scrollY }] }]}>
        <Text
          onLayout={measureText}
          style={[
            styles.text,
            {
              color: textColor,
              fontSize: fontSize,
              lineHeight: fontSize * 1.6,
            },
          ]}
        >
          {text}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  automaticVerticalScroll: {
    flex: 1,
    height: "100%",
    width: "100%",
    overflow: "hidden",
  },
  text: {
    textAlign: "center",
  },
});

export default AutomaticVerticalScroll;
