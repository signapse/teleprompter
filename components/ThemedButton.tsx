import React from "react";
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  TextProps,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedButtonProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "primary" | "secondary" | "outline";
  text?: string;
  textStyle?: TextProps["style"];
};

export function ThemedButton({
  style,
  lightColor,
  darkColor,
  type = "default",
  text,
  textStyle,
  ...rest
}: ThemedButtonProps) {
  // Use existing theme color keys
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    type === "outline" ? "background" : "primary"
  );
  const borderColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "tint"
  );
  const textColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text"
  );

  return (
    <TouchableOpacity
      style={[
        { backgroundColor, borderColor },
        type === "default" ? styles.default : undefined,
        type === "primary" ? styles.primary : undefined,
        type === "secondary" ? styles.secondary : undefined,
        type === "outline" ? styles.outline : undefined,
        style,
      ]}
      {...rest}
    >
      {text && (
        <Text
          style={[
            { color: textColor },
            type === "outline" ? styles.outlineText : styles.defaultText,
            textStyle,
          ]}
        >
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  default: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
  },
  primary: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 0,
  },
  secondary: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
  },
  outline: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
  },
  defaultText: {
    fontSize: 16,
    textAlign: "center",
  },
  outlineText: {
    fontSize: 16,
    textAlign: "center",
    color: "#0a7ea4", // Example color for outline button text
  },
});
