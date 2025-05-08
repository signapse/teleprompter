import Checkbox from "expo-checkbox";
import { StyleSheet, View, Text, Pressable } from "react-native";

interface Props {
  label: string;
  labelStyle?: any;
  secondaryLabel?: string;
  secondaryLabelStyle?: any;
  value: boolean;
  labelNumberOfLines?: number;
  labelEllipsizeMode?: "head" | "middle" | "tail" | "clip";
  onValueChange: (value: boolean) => void;
}

export default function CheckBoxWithLabel({
  label,
  labelStyle,
  secondaryLabel,
  labelNumberOfLines,
  labelEllipsizeMode,
  secondaryLabelStyle,
  value,
  onValueChange,
}: Props) {
  return (
    <View style={styles.checkbox}>
      <Checkbox
        style={styles.input}
        value={value}
        onValueChange={onValueChange}
      />
      <Pressable
        style={styles.labelContainer}
        onPress={() => onValueChange(!value)}
      >
        <Text
          ellipsizeMode={labelEllipsizeMode}
          numberOfLines={labelNumberOfLines}
          style={[styles.label, labelStyle]}
        >
          {label}
        </Text>
        {secondaryLabel && (
          <Text
            ellipsizeMode={labelEllipsizeMode}
            numberOfLines={labelNumberOfLines}
            style={[styles.secondaryLabel, secondaryLabelStyle]}
          >
            {secondaryLabel}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: 20,
    height: 20,
  },
  labelContainer: {
    flex: 1, // Allows the Pressable container to expand and prevent overflow
    gap: 4,
  },
  checkbox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "transparent",
  },
  label: {
    color: "white",
    fontSize: 18,
    flexShrink: 1, // Allows text to shrink if needed
    flexWrap: "wrap", // Wrap text if it overflows
  },
  secondaryLabel: {
    color: "white",
    fontSize: 16,
    flexShrink: 1, // Allows text to shrink if needed
    flexWrap: "wrap", // Wrap text if it overflows
  },
});
