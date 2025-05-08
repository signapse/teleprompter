import AsyncStorage from "@react-native-async-storage/async-storage";

// todo - use expo secure store

/**
 * Save an item to AsyncStorage with a specified key.
 * @param {string} key - The key for the data (used to retrieve or identify the data).
 * @param {string} value - The value to be saved (in your case, this can be a video URI or other data).
 */
export const saveItem = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
    console.log(`Item saved: ${key} -> ${value}`);
  } catch (error) {
    console.error("Error saving item to AsyncStorage:", error);
  }
};

/**
 * Retrieve an item from AsyncStorage with a specified key.
 * @param {string} key - The key for the data to be retrieved.
 * @returns {Promise<string | null>} - The retrieved value (e.g., video URI), or null if not found.
 */
export const getItem = async (key: string): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    // if (value !== null) {
    //   console.log(`Item retrieved: ${key} -> ${value}`);
    // }
    return value;
  } catch (error) {
    console.error("Error retrieving item from AsyncStorage:", error);
    return null;
  }
};

/**
 * Remove an item from AsyncStorage with a specified key.
 * @param {string} key - The key of the data to be removed.
 */
export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`Item removed: ${key}`);
  } catch (error) {
    console.error("Error removing item from AsyncStorage:", error);
  }
};

/**
 * Clear all items from AsyncStorage.
 * Use with caution, as this will remove all saved data.
 */
export const clearAll = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
    console.log("All items cleared from AsyncStorage.");
  } catch (error) {
    console.error("Error clearing AsyncStorage:", error);
  }
};

export const removeMany = async (keys: string[]): Promise<void> => {
  try {
    if (keys.length > 0) {
      await AsyncStorage.multiRemove(keys); // Remove all matching keys
      console.log(`Items with keys "${keys}" cleared from AsyncStorage.`);
    } else {
      console.log(`No items found with keys "${keys}".`);
    }
  } catch (error) {
    console.error("Error clearing items by prefix from AsyncStorage:", error);
  }
};

/**
 * Clear all items from AsyncStorage that match a specific key prefix.
 * @param {string} keyPrefix - The prefix to match keys (e.g., "videoUri_").
 */
export const clearAllByPrefix = async (keyPrefix: string): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys(); // Get all keys from storage
    const matchingKeys = keys.filter((key) => key.startsWith(keyPrefix)); // Filter keys by prefix

    if (matchingKeys.length > 0) {
      await AsyncStorage.multiRemove(matchingKeys); // Remove all matching keys
      console.log(
        `Items with prefix "${keyPrefix}" cleared from AsyncStorage.`
      );
    } else {
      console.log(`No items found with prefix "${keyPrefix}".`);
    }
  } catch (error) {
    console.error("Error clearing items by prefix from AsyncStorage:", error);
  }
};

/**
 * Retrieve all items that match a certain key prefix from AsyncStorage.
 * @param {string} keyPrefix - The prefix to match keys (e.g., "videoUri_").
 * @returns {Promise<Array<{ key: string, value: string }>>} - An array of key-value pairs.
 */
export const getItemsByPrefix = async (
  keyPrefix: string
): Promise<Array<{ key: string; value: string }>> => {
  try {
    const keys = await AsyncStorage.getAllKeys(); // Get all keys
    const matchingKeys = keys.filter((key) => key.startsWith(keyPrefix)); // Filter keys by prefix
    const items = await AsyncStorage.multiGet(matchingKeys); // Get the values for the filtered keys

    // Map the result to a structured format [{ key, value }]
    return items.reduce(
      (acc: { key: string; value: string }[], [key, value]) => {
        if (value) {
          acc.push({ key, value });
        }
        return acc;
      },
      []
    );
  } catch (error) {
    console.error("Error retrieving items by prefix from AsyncStorage:", error);
    return [];
  }
};

// 1. Get all paragraphs with in_dcs true flag - when? everytime the app is loaded ?
// 2. display the paragraphs in a list

// 3. videos recorded are stored locally - recording page - get all from the storage

// case 1. script there and paragraph there
// if video is already recorded and you press record on paragraph -> then record video it will OVERWRITE the video

// Questions
// 1. If video is already recorded and you press record on paragraph -> then record video it will OVERWRITE the video - YES
// 2. Once video is "Uploaded" should paragraph for that video and video recording disappear from the list (i.e. cleared from storage, and flag updated on paragraph no to be shown again) - YES
// 3. When you recording what is that bottom arrow to the left button supposed to do? - GO BACK / GO TO HOME ?
// 4. When you are recording - once stop pressed,
// settings - should settings be global or per single paragraph ? - YES
// How the paragraph works - what if the text is long - how do we scroll through the content? - YEs
// - when you actually press to save that video - or should this be saved automatically? what if you stopped mid way
// - when stopped, should you have rerecord button visible? or rerecording only available from Recordings screen
// - when pressing "NEXT" or "PREV" - should the recording be saved automatically or should it be saved only when you press "SAVE" button, also should those buttons be disabled if recoding is active?

// 5. All current bugs list

// internal, avoid  NOT ON APPLE STORE,

//
