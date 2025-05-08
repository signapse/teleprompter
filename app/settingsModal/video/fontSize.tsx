import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useSettings, FontSize } from "@/components/providers/SettingsProvider";

export default function VideoFontSizeSettings() {
  const { state, saveSetting } = useSettings();

  const settingsOptions = [
    {
      title: "Extra Small",
      value: FontSize.EXTRA_SMALL,
    },
    {
      title: "Small",
      value: FontSize.SMALL,
    },
    {
      title: "Medium",
      value: FontSize.MEDIUM,
    },
    {
      title: "Large",
      value: FontSize.LARGE,
    },
    {
      title: "Extra Large",
      value: FontSize.EXTRA_LARGE,
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
              onPress={() => saveSetting("fontSize", option.value)}
            >
              <Text style={styles.linkTitle}>{option.title}</Text>
              {state.fontSize === option.value && (
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
