import { Alert, SafeAreaView, StyleSheet, View } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { ThemedText } from "@/components/ThemedText";
import { Redirect } from "expo-router";
import Button from "@/components/ui/button/Button";

function LoginScreen() {
  const { authorize, error, user } = useAuth0();

  // If user is logged in, redirect to the main app
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  const onLogin = async () => {
    try {
      await authorize();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ThemedText style={styles.title}>Signapse Teleprompter</ThemedText>
        <Button title="Login" onPress={onLogin} />
        <ThemedText style={styles.info}>
          This is an invite only app. If you don't have an account, you can
          request access.
        </ThemedText>
        {error && <ThemedText>{error.message}</ThemedText>}
      </View>
    </SafeAreaView>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#D8DEE4",
  },
  container: {
    flex: 1,
    gap: 16,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    textAlign: "center",
    color: "black",
    fontSize: 30,
    fontWeight: "bold",
    lineHeight: 30,
  },
  info: {
    textAlign: "center",
    fontSize: 14,
    color: "black",
    lineHeight: 20,
  },
});
