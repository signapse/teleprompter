import { useUser } from "@/components/providers/UserProvider";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";

export default function UserDetailsScreen() {
  const { userMetadata } = useUser();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.detailSection}>
          <View
            style={[
              styles.detail,
              {
                borderBottomWidth: 1,
                borderColor: "#D8DEE4",
              },
            ]}
          >
            <Text style={styles.detailLabel}>Name</Text>
            <View>
              <Text style={styles.detailValue}>
                {userMetadata?.firstName} {userMetadata?.lastName}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.detail,
              {
                borderBottomWidth: 1,
                borderColor: "#D8DEE4",
              },
            ]}
          >
            <Text style={styles.detailLabel}>Role</Text>
            <View>
              <Text style={styles.detailValue}>{userMetadata?.role}</Text>
            </View>
          </View>
          <View style={styles.detail}>
            <Text style={styles.detailLabel}>Email</Text>
            <View>
              <Text style={styles.detailValue}>{userMetadata?.email}</Text>
            </View>
          </View>
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
  },
  detail: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FBFCFE",
    paddingHorizontal: 12,
    paddingVertical: 20,
  },

  detailSection: {
    borderRadius: 12,
    overflow: "hidden",
  },
  detailLabel: {
    fontWeight: "bold",
    fontSize: 16,
  },
  detailValue: {
    color: "gray",
  },
});
