import Providers from "@/components/providers/Providers";
import { Stack, useNavigationContainerRef } from "expo-router";
import "react-native-reanimated";
import { Buffer } from "buffer";
import * as Sentry from '@sentry/react-native';
import { useEffect } from "react";
import { initSentry, navigationIntegration } from "@/lib/sentry";

// Initialize Buffer globally
global.Buffer = Buffer;

// Initialize Sentry
initSentry();

function RootLayout() {
  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);
  
  return (
    <Providers>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="login" />
        <Stack.Screen name="record" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="settingsModal"
          options={{
            presentation: "modal",
          }}
        />
      </Stack>
    </Providers>
  );
}

// export default RootLayout;


// Wrap the Root Layout route component with `Sentry.wrap` to capture gesture info and profiling data.
export default Sentry.wrap(RootLayout);

