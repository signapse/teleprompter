import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import {
  useSettings,
  ScrollSpeed,
} from "@/components/providers/SettingsProvider";

export default function VideoScrollSpeedSettings() {
  const { state, saveSetting } = useSettings();

  const settingsOptions = [
    {
      title: "Slow",
      value: ScrollSpeed.SLOW,
    },
    {
      title: "Normal",
      value: ScrollSpeed.NORMAL,
    },
    {
      title: "Fast",
      value: ScrollSpeed.FAST,
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
              onPress={() => saveSetting("scrollSpeed", option.value)}
            >
              <Text style={styles.linkTitle}>{option.title}</Text>
              {state.scrollSpeed === option.value && (
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
