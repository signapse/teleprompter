import { Redirect, Tabs, useNavigation } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import HeaderRecordings from "@/components/layout/header-recordings/HeaderRecordings";
import HeaderParagraphs from "@/components/layout/header-paragraphs/HeaderParagraphs";
import { Pressable, Text } from "react-native";
import { useAuth0 } from "react-native-auth0";

export default function TabLayout() {
  const navigation = useNavigation();

  const { user } = useAuth0();

  if (!user?.sub) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "white",
          borderTopColor: "#D8DEE4",
          borderTopWidth: 1,
          height: 100,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Paragraphs",
          header: () => <HeaderParagraphs />, // Use the custom header with search bar
          tabBarButton: (props) => (
            <Pressable
              {...props} // Spread default button props
              style={[
                props.style,
                {
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  gap: 6,
                },
              ]}
            >
              {props.children}
            </Pressable>
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? "document-text" : "document-text-outline"}
              color={focused ? "#595DBA" : "#99A3AF"}
              size={24}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: 14,
                color: focused ? "#595DBA" : "#99A3AF",
                textAlign: "center",
              }}
            >
              Paragraphs
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="recordings"
        options={{
          title: "Recordings",
          header: () => <HeaderRecordings />,
          tabBarButton: (props) => (
            <Pressable
              {...props} // Spread default button props
              style={[
                props.style,
                {
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  gap: 6,
                },
              ]}
            >
              {props.children}
            </Pressable>
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? "videocam" : "videocam-outline"}
              color={focused ? "#595DBA" : "#99A3AF"}
              size={24}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: 14,
                color: focused ? "#595DBA" : "#99A3AF",
                textAlign: "center",
              }}
            >
              Recordings
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="placeholder"
        options={{
          title: "Account",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              name={focused ? "person" : "person-outline"}
              color={focused ? "#595DBA" : "#99A3AF"}
              size={24}
            />
          ),
          tabBarButton: (props) => (
            <Pressable
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                gap: 6,
              }}
              onPress={() => navigation.navigate("settingsModal" as never)}
            >
              {props.children}
            </Pressable>
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: 14,
                color: focused ? "#595DBA" : "#99A3AF",
                textAlign: "center",
              }}
            >
              Account
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
