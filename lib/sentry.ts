import * as Sentry from "@sentry/react-native";
import { isRunningInExpoGo } from "expo";
import { isProd, SENTRY_DSN } from "./consts";

// Construct a new integration instance. This is needed to communicate between the integration and React
// Create navigation integration
export const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

export const initSentry = () => {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV,
    debug: !isProd, // Only enable debug in non-prod
    tracesSampleRate: isProd ? 0.2 : 1.0, // Lower sample rate in prod
    integrations: [navigationIntegration],
    enableNativeFramesTracking: !isRunningInExpoGo(),
    beforeSend(event) {
      // Don't send events from Expo Go
      if (isRunningInExpoGo()) {
        return null;
      }
      return event;
    },
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,
  });
};
