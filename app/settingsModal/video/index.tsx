import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Link, router } from "expo-router";
import { useUser } from "@/components/providers/UserProvider";
import { useAuth0 } from "react-native-auth0";
import UserAvatar from "@/components/shared/user-avatar/UserAvatar";
import FlashingCircle from "@/components/shared/flashing-circle/FlashingCircle";

export default function VideoSettingsList() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.section}>
          <Pressable
            onPress={() => router.push("/settingsModal/video/fontSize")}
            style={[
              styles.link,
              {
                borderBottomWidth: 1,
                borderColor: "#D8DEE4",
              },
            ]}
          >
            <Text style={styles.linkTitle}>Font Size</Text>
            <TabBarIcon name="chevron-forward" size={20} color="#99A3AF" />
          </Pressable>
          <Pressable
            style={[
              styles.link,
              {
                borderBottomWidth: 1,
                borderColor: "#D8DEE4",
              },
            ]}
            onPress={() => router.push("/settingsModal/video/textColour")}
          >
            <Text style={styles.linkTitle}>Font Colour</Text>
            <TabBarIcon name="chevron-forward" size={20} color="#99A3AF" />
          </Pressable>
          <Pressable
            style={[
              styles.link,
              {
                borderBottomWidth: 1,
                borderColor: "#D8DEE4",
              },
            ]}
            onPress={() => router.push("/settingsModal/video/backgroundColour")}
          >
            <Text style={styles.linkTitle}>Background Colour</Text>
            <TabBarIcon name="chevron-forward" size={20} color="#99A3AF" />
          </Pressable>
          <Pressable
            style={styles.link}
            onPress={() => router.push("/settingsModal/video/scrollSpeed")}
          >
            <Text style={styles.linkTitle}>Scroll Speed</Text>
            <TabBarIcon name="chevron-forward" size={20} color="#99A3AF" />
          </Pressable>
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
