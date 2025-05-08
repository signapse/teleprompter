import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import {
  useSettings,
  BackgroundColor,
} from "@/components/providers/SettingsProvider";

export default function VideoBackgroundColourSettings() {
  const { state, saveSetting } = useSettings();

  const settingsOptions = [
    {
      title: "Dark Blue",
      value: BackgroundColor.DARK_BLUE,
    },
    {
      title: "Black",
      value: BackgroundColor.BLACK,
    },
    {
      title: "White",
      value: BackgroundColor.WHITE,
    },
    {
      title: "Transparent",
      value: BackgroundColor.TRANSPARENT,
    },
    {
      title: "Translucent",
      value: BackgroundColor.TRANSLUCENT,
    },
  ];

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.section}>
          {settingsOptions.map((option, index) => (
            <Pressable
              key={option.value}
              style={[
                styles.link,
                index !== settingsOptions.length - 1 && {
                  borderBottomWidth: 1,
                  borderColor: "#D8DEE4",
                },
              ]}
              onPress={() => saveSetting("backgroundColor", option.value)}
            >
              <Text style={styles.linkTitle}>{option.title}</Text>
              {state.backgroundColor === option.value && (
                <TabBarIcon name="checkmark" size={20} color="#99A3AF" />
              )}
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#E5E9EF",
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 12,
    gap: 22,
  },
  section: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FBFCFE",
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    height: 60,
  },
  linkTitle: {
    fontSize: 16,
    color: "black",
  },
});
