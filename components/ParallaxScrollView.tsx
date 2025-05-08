import type { PropsWithChildren, ReactElement } from "react";
import { SafeAreaView, StyleSheet, useColorScheme } from "react-native";
import Animated, {
  useAnimatedRef,
  useScrollViewOffset,
} from "react-native-reanimated";

import { ThemedView } from "@/components/ThemedView";

const HEADER_HEIGHT = 250;

export default function ParallaxScrollView({
  children,
}: {
  children: ReactElement;
}) {
  const colorScheme = useColorScheme() ?? "light";
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        <ThemedView style={styles.content}>{children}</ThemedView>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1, // Ensures the content fills the ScrollView
  },
  // header: {
  //   height: 250,
  //   overflow: "hidden",
  // },
  content: {
    flex: 1,
    // padding: 32,
    gap: 16,
    overflow: "hidden",
    backgroundColor: "orange",
  },
});
