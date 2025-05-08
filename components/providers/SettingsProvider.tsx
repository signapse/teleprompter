import React, { createContext, useReducer, useContext, useEffect } from "react";
import {
  getItem,
  removeItem,
  saveItem,
} from "@/lib/local-storage/asyncStorageHelpers";

export enum TextColor {
  BLACK = "#000000",
  WHITE = "#FFFFFF",
  YELLOW = "#FFFF00",
}

export enum BackgroundColor {
  DARK_BLUE = "#0A0A23",
  BLACK = "#000000",
  WHITE = "#FFFFFF",
  TRANSPARENT = "transparent",
  TRANSLUCENT = "rgba(#000000, 0.5)",
}

export enum ScrollSpeed {
  SLOW = 10000,
  NORMAL = 9000,
  FAST = 8000,
}

export enum FontSize {
  EXTRA_SMALL = 20,
  SMALL = 24,
  MEDIUM = 26,
  LARGE = 28,
  EXTRA_LARGE = 30,
}

interface SettingsState {
  textColor: TextColor;
  fontSize: FontSize;
  backgroundColor: BackgroundColor;
  scrollSpeed: ScrollSpeed;
}

// Initial state with default values
const initialState: SettingsState = {
  textColor: TextColor.YELLOW,
  fontSize: FontSize.MEDIUM,
  backgroundColor: BackgroundColor.DARK_BLUE,
  scrollSpeed: ScrollSpeed.NORMAL,
};

// Add action to handle setting scroll type
type ActionType =
  | { type: "SET_TEXT_COLOR"; payload: TextColor }
  | { type: "SET_FONT_SIZE"; payload: FontSize }
  | { type: "SET_BACKGROUND_COLOR"; payload: BackgroundColor }
  | { type: "SET_SCROLL_SPEED"; payload: ScrollSpeed };

// Keys for AsyncStorage
const STORAGE_KEYS = {
  TEXT_COLOR: "TEXT_COLOR",
  FONT_SIZE: "FONT_SIZE",
  BACKGROUND_COLOR: "BACKGROUND_COLOR",
  SET_SCROLL_SPEED: "SET_SCROLL_SPEED",
};

// Reducer function to handle state updates
const settingsReducer = (
  state: SettingsState,
  action: ActionType
): SettingsState => {
  switch (action.type) {
    case "SET_TEXT_COLOR":
      return { ...state, textColor: action.payload };
    case "SET_FONT_SIZE":
      return { ...state, fontSize: action.payload };
    case "SET_BACKGROUND_COLOR":
      return { ...state, backgroundColor: action.payload };
    case "SET_SCROLL_SPEED":
      return { ...state, scrollSpeed: action.payload };
    default:
      return state;
  }
};

// Define the context type
interface SettingsContextType {
  state: SettingsState;
  saveSetting: (
    key: keyof SettingsState,
    value: string | number
  ) => Promise<void>;
}

// Create the SettingsContext
const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

// Custom hook to use the SettingsContext
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

// SettingsProvider component to wrap the app
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  // Load settings from AsyncStorage
  const loadSettings = async () => {
    try {
      await removeItem(STORAGE_KEYS.TEXT_COLOR);
      await removeItem(STORAGE_KEYS.FONT_SIZE);
      await removeItem(STORAGE_KEYS.BACKGROUND_COLOR);
      await removeItem(STORAGE_KEYS.SET_SCROLL_SPEED);

      const storedTextColor = await getItem(STORAGE_KEYS.TEXT_COLOR);
      const storedFontSize = await getItem(STORAGE_KEYS.FONT_SIZE);
      const storedBackgroundColor = await getItem(
        STORAGE_KEYS.BACKGROUND_COLOR
      );
      const storedScrollSpeed = await getItem(STORAGE_KEYS.SET_SCROLL_SPEED);

      if (storedTextColor)
        dispatch({
          type: "SET_TEXT_COLOR",
          payload: storedTextColor as TextColor,
        });
      if (storedFontSize)
        dispatch({
          type: "SET_FONT_SIZE",
          payload: parseInt(storedFontSize, 10) as FontSize,
        });
      if (storedBackgroundColor)
        dispatch({
          type: "SET_BACKGROUND_COLOR",
          payload: storedBackgroundColor as BackgroundColor,
        });
      if (storedScrollSpeed)
        dispatch({
          type: "SET_SCROLL_SPEED",
          payload: parseInt(storedScrollSpeed, 10) as ScrollSpeed,
        });
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  // Single function to save to AsyncStorage and update the state via reducer
  const saveSetting = async (
    key: keyof SettingsState,
    value: string | number
  ) => {
    try {
      // Save to AsyncStorage
      let storageKey: string;
      switch (key) {
        case "textColor":
          storageKey = STORAGE_KEYS.TEXT_COLOR;
          dispatch({ type: "SET_TEXT_COLOR", payload: value as TextColor });
          break;
        case "fontSize":
          storageKey = STORAGE_KEYS.FONT_SIZE;
          dispatch({ type: "SET_FONT_SIZE", payload: value as FontSize });
          break;
        case "backgroundColor":
          storageKey = STORAGE_KEYS.BACKGROUND_COLOR;
          dispatch({
            type: "SET_BACKGROUND_COLOR",
            payload: value as BackgroundColor,
          });
          break;
        case "scrollSpeed":
          storageKey = STORAGE_KEYS.SET_SCROLL_SPEED;
          dispatch({ type: "SET_SCROLL_SPEED", payload: value as ScrollSpeed });
          break;
        default:
          throw new Error("Unknown setting key");
      }

      // Save value in AsyncStorage
      await saveItem(storageKey, value.toString());
    } catch (error) {
      console.error("Error saving setting:", error);
    }
  };

  // Load settings on initial render (when app starts)
  useEffect(() => {
    loadSettings().then();
  }, []);

  return (
    <SettingsContext.Provider value={{ state, saveSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}
