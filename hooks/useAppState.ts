import { useEffect, useState } from "react";
import { AppState, Platform } from "react-native";
import type { AppStateStatus } from "react-native";
import { focusManager } from "@tanstack/query-core";

// Global app state and listener management
let appStateStatus: AppStateStatus = AppState.currentState;
let listenerAttached = false;
let listeners: Array<(status: AppStateStatus) => void> = [];

// Handle app state changes and notify all listeners
function onAppStateChange(status: AppStateStatus) {
  appStateStatus = status;

  // Notify all components that are listening to app state changes
  listeners.forEach((listener) => listener(status));

  // Update React Query focus manager
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

// Ensure the listener is attached only once
function ensureListenerAttached() {
  if (!listenerAttached) {
    AppState.addEventListener("change", onAppStateChange);
    listenerAttached = true;
  }
}

// Hook to use app state and trigger rerenders
export function useAppState() {
  const [status, setStatus] = useState<AppStateStatus>(appStateStatus); // Initialize with the current global state

  useEffect(() => {
    ensureListenerAttached(); // Attach the global listener only once

    // Add this component's listener to the global listeners array
    listeners.push(setStatus);

    // Clean up: remove the listener when the component unmounts
    return () => {
      listeners = listeners.filter((listener) => listener !== setStatus);
    };
  }, []);

  return status; // Return the current app state to the component
}
