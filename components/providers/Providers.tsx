import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/query-core";
import { useOnlineManager } from "@/hooks/useOnlineManager";
import { useAppState } from "@/hooks/useAppState";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Auth0Provider } from "react-native-auth0";
import FontProvider from "@/components/providers/FontsProvider";
import { SettingsProvider } from "@/components/providers/SettingsProvider";
import { ParagraphSelectionProvider } from "@/components/providers/ParagraphSelectionProvider";
import { ParagraphsProvider } from "./ParagraphsProvider";
import { RecordingsProvider } from "./RecordingsProvider";
import { RecordingsSelectionProvider } from "./RecordingsSelectionProvider";
import { UserProvider } from "./UserProvider";
import { RecordingProvider } from "./RecordingProvider";
import FlashMessage from "react-native-flash-message";
import { BLEProvider } from "@/components/providers/ble/BLEContext";
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from "@/lib/consts";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();

  {
    /** This updates the app state when the app is active. **/
  }
  useOnlineManager();

  {
    /** This enables auto-refetch when the app reconnects to the internet. **/
  }
  useAppState();

  return (
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
    >
      <SettingsProvider>
        <FontProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <QueryClientProvider client={queryClient}>
              <UserProvider>
                <ParagraphsProvider>
                  <ParagraphSelectionProvider>
                    <RecordingsProvider>
                      <RecordingsSelectionProvider>
                        <RecordingProvider>
                          <FlashMessage position="top" />
                          <BLEProvider>
                            {children}
                          </BLEProvider>
                        </RecordingProvider>
                      </RecordingsSelectionProvider>
                    </RecordingsProvider>
                  </ParagraphSelectionProvider>
                </ParagraphsProvider>
              </UserProvider>
            </QueryClientProvider>
          </ThemeProvider>
        </FontProvider>
      </SettingsProvider>
    </Auth0Provider>
  );
}
