import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  StyleProp,
  TextStyle,
  ViewStyle,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "small" | "default" | "large";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  loading?: boolean; // Loading state
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "default",
  iconName,
  iconPosition = "left",
  disabled = false,
  loading = false,
  style,
  accessibilityLabel,
}) => {
  const buttonStyles = [
    styles.base,
    styles[size],
    styles[variant],
    (disabled || loading) && styles.disabled,
    style,
  ] as StyleProp<ViewStyle>;

  const textStyles = [
    styles.text,
    styles[`${variant}Text` as keyof typeof styles],
  ] as StyleProp<TextStyle>;

  return (
    <Pressable
      style={({ pressed }) => [
        buttonStyles,
        pressed && !disabled && !loading && styles.pressed,
      ]}
      onPress={!loading ? onPress : undefined}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "outline" || variant === "ghost" ? "#007bff" : "#fff"
          }
        />
      ) : (
        <>
          {iconName && iconPosition === "left" && (
            <MaterialIcons name={iconName} size={20} style={styles.icon} />
          )}
          <Text style={textStyles}>{title}</Text>
          {iconName && iconPosition === "right" && (
            <MaterialIcons name={iconName} size={20} style={styles.icon} />
          )}
        </>
      )}
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  // Sizes
  small: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  default: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  large: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  // Variants
  primary: {
    backgroundColor: "#595DBA",
  },
  secondary: {
    backgroundColor: "#6c757d",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#595DBA",
  },
  ghost: {
    backgroundColor: "transparent",
  },
  danger: {
    backgroundColor: "#dc3545",
  },
  // Disabled state
  disabled: {
    opacity: 0.6,
  },
  // Text styles
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  primaryText: {
    color: "#fff",
  },
  secondaryText: {
    color: "#fff",
  },
  outlineText: {
    color: "#595DBA",
  },
  ghostText: {
    color: "#007bff",
  },
  dangerText: {
    color: "#fff",
  },
  // Icon style
  icon: {
    marginHorizontal: 4,
  },
  // Pressed state
  pressed: {
    opacity: 0.75,
  },
});
