import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import {
  useSettings,
  TextColor,
} from "@/components/providers/SettingsProvider";

export default function VideoTextColourSettings() {
  const { state, saveSetting } = useSettings();

  const settingsOptions = [
    {
      title: "Black",
      value: TextColor.BLACK,
    },
    {
      title: "White",
      value: TextColor.WHITE,
    },
    {
      title: "Yellow",
      value: TextColor.YELLOW,
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
              onPress={() => saveSetting("textColor", option.value)}
            >
              <Text style={styles.linkTitle}>{option.title}</Text>
              {state.textColor === option.value && (
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
