import { Pressable } from "react-native";
import { Stack, useNavigation } from "expo-router";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";

export default function ModalLayout() {
  const navigation = useNavigation(); // Use navigation for modal control

  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        title: "Settings",
        headerStyle: {
          backgroundColor: "#E5E9EF",
        },
        headerTitleStyle: {
          color: "#1F2937",
        },
        headerRight: () => (
           <Pressable onPress={() => navigation.goBack()}>
            <TabBarIcon name="close"  size={26} />
          </Pressable>
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Settings",
        }}
      />
      <Stack.Screen
        name="video/index"
        options={{
          title: "Recording",
          headerBackTitle: "Settings",
        }}
      />
      <Stack.Screen
        name="video/fontSize"
        options={{
          title: "Font Size",
          headerBackTitle: "Recording",
        }}
      />
      <Stack.Screen
        name="video/textColour"
        options={{
          title: "Text Colour",
          headerBackTitle: "Recording",
        }}
      />
      <Stack.Screen
        name="video/backgroundColour"
        options={{
          title: "Background Colour",
          headerBackTitle: "Recording",
        }}
      />
      <Stack.Screen
        name="video/scrollSpeed"
        options={{
          title: "Scroll Speed",
          headerBackTitle: "Recording",
        }}
      />
      <Stack.Screen
        name="devices"
        options={{
          title: "Devices",
        }}
      />
      <Stack.Screen
        name="user"
        options={{
          title: "Account Details",
        }}
      />
    </Stack>
  );
}
