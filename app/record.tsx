import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React from "react";
import Button from "@/components/ui/button/Button";
import VideoRecordingScreen from "@/components/screens/record/VideoRecordingScreen";
import { useCameraPermissions } from "expo-camera";

export default function RecordVideoScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return (
      <SafeAreaView style={styles.grantCameraPermissionScreen}>
        <View style={styles.content}>
          <Text style={styles.permissionsGrantText}>
            Checking camera permissions...
          </Text>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <SafeAreaView style={styles.grantCameraPermissionScreen}>
        <View style={styles.content}>
          <Text style={styles.permissionsGrantText}>
            We need your permission to show the camera
          </Text>
          <Button
            onPress={requestPermission}
            title="Grant Permission"
            size="large"
          />
        </View>
      </SafeAreaView>
    );
  }

  return <VideoRecordingScreen />;
}

const styles = StyleSheet.create({
  grantCameraPermissionScreen: {
    backgroundColor: "#FBFCFE",
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  permissionsGrantText: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
});
