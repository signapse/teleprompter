import axios from "axios";

import {
  fetchToken,
  getToken,
  isTokenExpired,
  storeToken,
} from "../auth/authUtils";
import { HUB_API_BASE_URL } from "../consts";
import * as Sentry from "@sentry/react-native";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: HUB_API_BASE_URL,
});

// Axios request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    let token = await getToken(); // Get the token from storage
    const tokenExpired = await isTokenExpired(); // Check if token is expired

    if (!token || tokenExpired) {
      try {
        // No token or token is expired: fetch a new one
        const newToken = await fetchToken();
        token = newToken.access_token;

        // Store the new token and expiration time
        await storeToken(newToken);

        // Add the new token to the request headers
        config.headers["Authorization"] = `Bearer ${token}`;
      } catch (error) {
        console.error("Error fetching token:", error);

        // Add detailed logging to Sentry
        Sentry.captureException(error, {
          extra: {
            message: "Failed to fetch a new token",
            requestUrl: config.url,
          },
        });

        throw error;
      }
    } else {
      // Token exists and is not expired: use the existing token
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request Interceptor Error:", error);

    // Log to Sentry
    Sentry.captureException(error, {
      extra: {
        message: "Error in request interceptor",
        config: error.config,
      },
    });

    return Promise.reject(error);
  }
);

export default apiClient;
