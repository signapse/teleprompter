import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  firstName: string;
  lastName: string;
  size?: number;
  style?: any;
}

export default function UserAvatar({
  firstName,
  lastName,
  size = 38,
  style,
}: Props) {
  // Extract initials from the names
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    >
      <Text style={styles.initials}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007AFF", // Customize the background color as needed
  },
  initials: {
    color: "white", // Text color
    fontWeight: "bold",
    fontSize: 18, // You can adjust the font size based on the avatar size
  },
});
