import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { router, useNavigation } from "expo-router";
import { useUser } from "@/components/providers/UserProvider";
import { useAuth0 } from "react-native-auth0";
import UserAvatar from "@/components/shared/user-avatar/UserAvatar";
import { appVersion } from "@/lib/consts";

export default function SettingsModalLandingScreen() {
  const { userMetadata } = useUser();
  const { clearSession } = useAuth0();

  const navigation = useNavigation();

  const onLogout = async () => {
    try {
      await clearSession();

      navigation.goBack();
    } catch (e) {
      console.log("Log out cancelled");
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.section}>
          <Pressable
            style={styles.link}
            onPress={() => router.push("/settingsModal/user")}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <UserAvatar
                firstName={userMetadata?.firstName || ""}
                lastName={userMetadata?.lastName || ""}
              />
              <Text style={styles.linkTitle}>
                {userMetadata?.firstName} {userMetadata?.lastName}
              </Text>
            </View>
            <TabBarIcon name="chevron-forward" size={20} color="#99A3AF" />
          </Pressable>
        </View>
        <View style={styles.section}>
          <Pressable
            style={[
              styles.link,
              {
                borderBottomWidth: 1,
                borderColor: "#D8DEE4",
              },
            ]}
            onPress={() => router.push("/settingsModal/devices")}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: "#2F516E",
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <TabBarIcon name="bluetooth" color="#FBFCFE" size={20} />
              </View>
              <Text style={styles.linkTitle}>Pair Device</Text>
            </View>
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
            onPress={() => router.push("/settingsModal/video")}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: "#2F516E",
                  padding: 10,
                  borderRadius: 10,
                }}
              >
                <TabBarIcon name="videocam" color="#FBFCFE" size={20} />
              </View>
              <Text style={styles.linkTitle}>Video Recording</Text>
            </View>
            <TabBarIcon name="chevron-forward" size={20} color="#99A3AF" />
          </Pressable>
        </View>
        <View style={styles.section}>
          <Pressable style={styles.link} onPress={onLogout}>
            <Text style={[styles.linkTitle, { color: "red" }]}>Sign Out</Text>
            <TabBarIcon name="log-out-outline" size={20} color="#99A3AF" />
          </Pressable>
        </View>
        <View style={styles.buildInfoContainer}>
          <Text>Build {appVersion}</Text>
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
    paddingHorizontal: 10,
    height: 60,
  },
  linkTitle: {
    fontSize: 16,
    color: "black",
  },
  buildInfoContainer: {
    alignItems: "center",
    padding: 16,
    marginTop: "auto",
  },
});
