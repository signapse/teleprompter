import axios from "axios";
import { getItem, saveItem } from "@/lib/local-storage/asyncStorageHelpers";
import {
  AUTH_API_CLIENT_ID,
  AUTH_API_CLIENT_SECRET,
  AUTH_TOKEN_URL,
} from "../consts";

interface AuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

const TOKEN_STORAGE_KEY = "authToken";
const TOKEN_EXPIRY_KEY = "authTokenExpiry";

// Check if the token is expired
export const isTokenExpired = async (): Promise<boolean> => {
  const expiryTime = await getItem(TOKEN_EXPIRY_KEY);
  if (!expiryTime) return true;

  return new Date().getTime() > parseInt(expiryTime);
};

// Store token in AsyncStorage
export const storeToken = async (token: AuthToken) => {
  await saveItem(TOKEN_STORAGE_KEY, token.access_token);
  const expiryTime = (
    new Date().getTime() +
    token.expires_in * 1000
  ).toString();
  await saveItem(TOKEN_EXPIRY_KEY, expiryTime);
};

// Get token from AsyncStorage
export const getToken = async (): Promise<string | null> => {
  return await getItem(TOKEN_STORAGE_KEY);
};

// Fetch new token
export const fetchToken = async (): Promise<AuthToken> => {
  const url = AUTH_TOKEN_URL!!;
  const username = AUTH_API_CLIENT_ID!!;
  const password = AUTH_API_CLIENT_SECRET!!;

  // Encode the credentials
  const credentials = btoa(`${username}:${password}`);

  try {
    const response = await axios.post(
      url,
      new URLSearchParams({ grant_type: "client_credentials" }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch authentication token: ${response.statusText}`
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching authentication token:", error);
    throw error;
  }
};
