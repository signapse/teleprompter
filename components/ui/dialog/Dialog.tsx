import { Dialog as RneuiDialog } from "@rneui/base";
import { useState } from "react";
import { Dimensions, StyleSheet } from "react-native";

interface Props {
  title: string;
  children: React.ReactNode;
  isVisible: boolean;
  onBackdropPress?: () => void;
  style?: object;
}

export default function Dialog({
  title,
  children,
  isVisible,
  style,
  onBackdropPress,
}: Props) {
  const screenWidth = Dimensions.get("window").width;

  return (
    <RneuiDialog
      style={[styles.dialog, style, { width: screenWidth - 20 }]} // Full width with some padding
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
    >
      <RneuiDialog.Title title={title} />
      {children}
    </RneuiDialog>
  );
}

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: "yellow",
    color: "white",
  },
});
