import Constants from "expo-constants";

/** API Base Urls */
export const HUB_API_BASE_URL = process.env.EXPO_PUBLIC_HUB_API_BASE_URL;

export const AUTH_API_CLIENT_ID = process.env.EXPO_PUBLIC_AUTH_API_CLIENT_ID;

export const AUTH_API_CLIENT_SECRET =
  process.env.EXPO_PUBLIC_AUTH_API_CLIENT_SECRET;

export const AUTH_TOKEN_URL = process.env.EXPO_PUBLIC_AUTH_TOKEN_URL;

export const appVersion = Constants.expoConfig?.version ?? "Unknown version";

export const isDev = __DEV__;

export const isProd = process.env.NODE_ENV === "production";

export const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

export const AUTH0_CLIENT_ID = process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID;

export const AUTH0_DOMAIN = process.env.EXPO_PUBLIC_AUTH0_DOMAIN;
