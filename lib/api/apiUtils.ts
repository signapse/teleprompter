import axios from "axios";
import { showMessage } from "react-native-flash-message";
import * as Sentry from "@sentry/react-native";

export const handleApiError = (error: unknown): never => {
  let errorMessage = "An unexpected error occurred.";
  let sentryContext: Record<string, any> = {};

  if (axios.isAxiosError(error)) {
    if (error.response) {
      errorMessage = `Request failed with status ${error.response.status}: ${
        error.response.data.message || "Unknown error"
      }`;
      sentryContext = {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        url: error.config?.url,
      };
    } else if (error.request) {
      errorMessage = "No response received from the server.";
      // No response received from the server
      errorMessage = "No response received from the server.";
      sentryContext = {
        request: error.request,
        url: error.config?.url,
      };
    } else {
      sentryContext = {
        message: error.message,
        config: error.config,
      };
    }
  }

  // Log the error to Sentry with additional context
  Sentry.captureException(error, {
    extra: sentryContext,
  });

  // showMessage({
  //   message: "Error",
  //   description: errorMessage,
  //   type: "danger",
  //   style: { backgroundColor: "red", zIndex: 9999 },
  // });

  throw new Error(errorMessage);
};
