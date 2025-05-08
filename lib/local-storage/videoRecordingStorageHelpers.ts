import {
  clearAllByPrefix,
  getItem,
  getItemsByPrefix,
  removeItem,
  removeMany,
} from "@/lib/local-storage/asyncStorageHelpers";
import { IRecording } from "@/types/recording";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VIDEO_RECORDING_PREFIX = "videoRecording_";

const buildStorageKey = (label: string): string => {
  return `${VIDEO_RECORDING_PREFIX}${label}`;
};

/**
 * Save an item to AsyncStorage with a specified key.
 * @param {string} videoLabel - The key for the data (used to retrieve or identify the data).
 * @param {string} videoUri - The value to be saved (in your case, this can be a video URI or other data).
 */
export const saveRecording = async (
  videoLabel: string,
  videoUri: string,
  folder: string,
  clientName: string,
  clientId: number
): Promise<void> => {
  try {
    const key = buildStorageKey(videoLabel);

    const data = JSON.stringify({
      videoLabel,
      videoUri,
      folder,
      clientName,
      clientId,
    });

    await AsyncStorage.setItem(key, data);
  } catch (error) {
    console.error("Error saving item to AsyncStorage:", error);
  }
};

/**
 * Retrieve an item from AsyncStorage with a specified key.
 * @param {string} videoLabel - paragraph video label
 * @returns {Promise<IRecording | null>} - The retrieved value (e.g., video URI), or null if not found.
 */
export const getRecordingByVideoLabel = async (
  videoLabel: string
): Promise<IRecording | null> => {
  try {
    const key = buildStorageKey(videoLabel);

    const value = await getItem(key);

    if (value !== null) {
      // console.log(`Item retrieved: ${key} -> ${value}`);
      return JSON.parse(value);
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error retrieving item from AsyncStorage:", error);
    return null;
  }
};

/**
 * Remove an item from AsyncStorage with a specified key.
 * @param {string} videoLabel - The key of the data to be removed.
 */
export const removeRecordingByLabel = async (
  videoLabel: string
): Promise<void> => {
  try {
    const key = buildStorageKey(videoLabel);
    await removeItem(key);
    console.log(`Item removed: ${key}`);
  } catch (error) {
    console.error("Error removing item from AsyncStorage:", error);
  }
};

/**
 * Retrieve all items that match a certain key prefix from AsyncStorage.
 * @returns {Promise<Array<{ key: string, value: string }>>} - An array of key-value pairs.
 */
export const getAllRecordings = async (): Promise<IRecording[]> => {
  try {
    const items = await getItemsByPrefix(VIDEO_RECORDING_PREFIX);

    return items.map((item) => JSON.parse(item.value));
  } catch (error) {
    console.error("Error retrieving items by prefix from AsyncStorage:", error);
    return [];
  }
};

/**
 * Remove multiple recordings by an array of video labels.
 * @param {string[]} videoLabels - An array of video labels for items to be removed.
 */
export const removeRecordingsByLabels = async (
  videoLabels: string[]
): Promise<void> => {
  try {
    const keysToRemove = videoLabels.map((label) => buildStorageKey(label));

    console.log("Keys to remove:", keysToRemove);

    await removeMany(keysToRemove);
    console.log(`Items removed: ${keysToRemove.join(", ")}`);
  } catch (error) {
    console.error("Error removing items from AsyncStorage:", error);
  }
};

/**
 * Clear all items from AsyncStorage.
 * Use with caution, as this will remove all saved data.
 */
export const clearAllRecordings = async (): Promise<void> => {
  try {
    await clearAllByPrefix(VIDEO_RECORDING_PREFIX);
    console.log("All items cleared from AsyncStorage.");
  } catch (error) {
    console.error("Error clearing AsyncStorage:", error);
  }
};
