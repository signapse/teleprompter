// contexts/BLEContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
  useRef,
} from "react";
import {
  BleManager,
  Device,
  Subscription,
  State,
  BleError,
  Service,
} from "react-native-ble-plx";
import { Alert, Platform, PermissionsAndroid } from "react-native";
import bleManager from "./BLEManagerSingleton";
import {
  getItem,
  saveItem,
  removeItem,
} from "@/lib/local-storage/asyncStorageHelpers";

// TODO - after disconnecting from a device, the device is not listed in available devices and still shows as connected in iOS
// TODO - after disconnecting from a device I get this  ERROR  Error subscribing to characteristic 85da4f4b-a2ca-4c7c-8c7d-fcd9e2daad56: [BleError: Device 252D50E4-6FC5-84BD-E7C8-620F447A961F was disconnected] - clear subscription on disconnect

const SERVICE_UUIDS_STORAGE_KEY = "serviceUUIDs";

// Define the shape of the BLE context
interface BLEContextProps {
  bleState: string;
  connectedDevice: Device | null;
  availableDevices: Device[];
  error: string;
  scanForDevices: () => void;
  connectToDevice: (deviceId: string) => Promise<void>;
  disconnectFromDevice: (deviceId: string) => Promise<void>;
  registerPedalEventHandler: (handler: (event: string) => void) => () => void;
}

// Define an enum for pedal events
enum PedalEvent {
  PedalUp = 0,
  LeftPedalDown = 1,
  RightPedalDown = 4,
}

const decodeValue = (base64Value: string): string => {
  try {
    const buffer = Buffer.from(base64Value, "base64");
    const intValue = buffer[0];
    const event = mapValueToEvent(intValue);
    return event;
  } catch (error) {
    console.error("Error decoding Base64 value:", error);
    return "Unknown Event";
  }
};

// Function to map decoded values to events
const mapValueToEvent = (value: number): string => {
  switch (value) {
    case PedalEvent.LeftPedalDown:
      return "Left Pedal Pressed Down";
    case PedalEvent.RightPedalDown:
      return "Right Pedal Pressed Down";
    case PedalEvent.PedalUp:
      return "Pedal Released";
    default:
      return "Unknown Event";
  }
};

// Create the BLE context
const BLEContext = createContext<BLEContextProps | undefined>(undefined);

// Custom hook to use the BLE context
export const useBLE = (): BLEContextProps => {
  const context = useContext(BLEContext);
  if (!context) {
    throw new Error("useBLE must be used within a BLEProvider");
  }
  return context;
};

// Provider component
export const BLEProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [bleState, setBleState] = useState<string>(State.Unknown);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [availableDevices, setAvailableDevices] = useState<Device[]>([]);
  // const [isScanning, setIsScanning] = useState<boolean>(false);

  // Ref to track if BLE has been initialized
  const isInitialized = useRef(false);
  let subscription: Subscription | null = null;

  const pedalEventHandlers = useRef<((event: string) => void)[]>([]);

  const [error, setError] = useState<string>("");

  /**
   * Register a pedal event handler
   * @param handler - Callback function to handle pedal events
   * @returns Unregister function to remove the handler
   */
  const registerPedalEventHandler = useCallback(
    (handler: (event: string) => void): (() => void) => {
      pedalEventHandlers.current.push(handler);
      return () => {
        pedalEventHandlers.current = pedalEventHandlers.current.filter(
          (h) => h !== handler
        );
      };
    },
    []
  );

  /**
   * Load service UUIDs from AsyncStorage
   */
  const loadServiceUUIDs = useCallback(async (): Promise<string[]> => {
    try {
      const uuids = await getItem(SERVICE_UUIDS_STORAGE_KEY);
      return uuids ? JSON.parse(uuids) : [];
    } catch (err) {
      console.error("Error loading service UUIDs:", err);
      return [];
    }
  }, []);

  /**
   * Save service UUIDs to AsyncStorage
   */
  const saveServiceUUIDs = useCallback(
    async (uuids: string[]): Promise<void> => {
      try {
        await saveItem(SERVICE_UUIDS_STORAGE_KEY, JSON.stringify(uuids));
      } catch (err) {
        console.error("Error saving service UUIDs:", err);
      }
    },
    []
  );

  /**
   * Remove service UUIDs from AsyncStorage
   */
  const removeServiceUUIDs = useCallback(async (): Promise<void> => {
    try {
      await removeItem(SERVICE_UUIDS_STORAGE_KEY);
    } catch (err) {
      console.error("Error removing service UUIDs:", err);
    }
  }, []);

  /**
   * Load connected devices based on stored service UUIDs
   */
  const loadConnectedDevice = useCallback(async (): Promise<Device | void> => {
    try {
      const serviceUUIDs = await loadServiceUUIDs();
      if (serviceUUIDs.length === 0) {
        console.log("No service UUIDs found in AsyncStorage.");
        return;
      }

      const connectedDevices = await bleManager.connectedDevices(serviceUUIDs);
      if (connectedDevices.length === 0) {
        console.log(
          "No connected devices found for service UUIDs. Clearing storage..."
        );
        await removeServiceUUIDs();
        console.log("Service UUIDs removed from storage.");
        return;
      }

      const device = connectedDevices[0];
      console.log("Connected devices found:", device.name);
      return device;

      // setConnectedDevice(device);
    } catch (err) {
      console.error("Error fetching connected devices:", err);
    }
  }, [loadServiceUUIDs, removeServiceUUIDs]);

  /**
   * Request necessary permissions (Android only)
   */
  const requestPermissions = useCallback(async (): Promise<void> => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);

        const allGranted = Object.values(granted).every(
          (status) => status === PermissionsAndroid.RESULTS.GRANTED
        );

        if (!allGranted) {
          Alert.alert(
            "Permissions Required",
            "Bluetooth permissions are required to use this feature."
          );
        }
      } catch (err) {
        console.error("Error requesting permissions:", err);
      }
    }
  }, []);

  /**
   * Handle a found device during scan
   */
  const handleDeviceFound = useCallback(
    (device: Device): void => {
      const isConnected = connectedDevice && device.id === connectedDevice.id;
      const isConnectable = device.name && device.isConnectable && !isConnected;

      if (isConnectable) {
        setAvailableDevices((prevDevices) => {
          if (!prevDevices.find((d) => d.id === device.id)) {
            return [...prevDevices, device];
          }
          return prevDevices;
        });
      }
    },
    [connectedDevice]
  );

  /**
   * Stop scanning for devices
   */
  const stopDeviceScan = useCallback(async (): Promise<void> => {
    try {
      await bleManager.stopDeviceScan();
      console.log("Stopped scanning for devices");
      // setIsScanning(false);
    } catch (err) {
      console.error("Error stopping device scan:", err);
    }
  }, [bleManager]);

  /**
   * Scan for available devices
   */
  const scanForDevices = useCallback((): void => {
    setAvailableDevices([]);

    console.log("Starting device scan...");
    bleManager.startDeviceScan(
      null,
      { allowDuplicates: false },
      (error: BleError | null, device: Device | null) => {
        if (error) {
          console.error("Scan error:", error);
          setError(`Error ${error.iosErrorCode}: ${error.message}`);
          return;
        }

        if (device) {
          handleDeviceFound(device);
        }
      }
    );

    // Stop scanning after 10 seconds
    setTimeout(() => {
      stopDeviceScan();
    }, 10000);
  }, [bleManager, handleDeviceFound, stopDeviceScan]);

  /**
   * Handle BLE state changes
   */
  const handleBLEStateChange = useCallback((): Subscription => {
    const subscription = bleManager.onStateChange((state: State) => {
      console.log("Bluetooth state changed to:", state);
      setBleState(state);

      if (state === State.PoweredOn) {
        console.log(
          "Bluetooth is ON. Starting scan and attempting reconnections..."
        );
        scanForDevices();
        // reconnectDevices();
        loadConnectedDevice();
      } else if (state === State.PoweredOff) {
        console.log(
          "Bluetooth is OFF. Stopping scan and disconnecting devices."
        );
        bleManager.stopDeviceScan();
        setConnectedDevice(null);
        removeServiceUUIDs();
        // removeConnectedDevice("");
      }
      // Handle other states if necessary
    }, true);

    subscription.remove();
    return subscription;
  }, [
    bleManager,
    scanForDevices,
    loadConnectedDevice,
    removeServiceUUIDs,
    // reconnectDevices,
    // removeConnectedDevice,
  ]);

  /**
   * Connect to a device and discover services
   */
  const connectToDevice = useCallback(
    async (deviceId: string): Promise<void> => {
      try {
        console.log("Connecting to device:", deviceId);
        const device = await bleManager.connectToDevice(deviceId);
        console.log("Connected to device:", deviceId);

        console.log("Subscribing to notifiable characteristics...");
        const services = await subscribeToNotifiableCharacteristics(device);
        console.log("Subscribed to notifiable characteristics.");

        // const services = await device.services();
        if (!services || services.length === 0) {
          throw new Error("No services found for the device.");
        }

        const uuids = services.map((service) => service.uuid);
        console.log("Available services:", uuids);

        await saveServiceUUIDs(uuids);

        setConnectedDevice(device);

        // Optionally stop scanning after connecting
        stopDeviceScan();
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            "Error during connection or service discovery:",
            error.message
          );
          Alert.alert(
            "Connection Error",
            error.message || "Failed to connect to device."
          );
        } else {
          console.error("Error during connection or service discovery:", error);
          Alert.alert("Connection Error", "Failed to connect to device.");
        }
      }
    },
    [bleManager, saveServiceUUIDs, stopDeviceScan]
    // [bleManager, saveServiceUUIDs, saveConnectedDevice, stopDeviceScan]
  );

  /**
   * Disconnect from a device
   */
  const disconnectFromDevice = useCallback(
    async (deviceId: string): Promise<void> => {
      try {
        console.log("Disconnecting from device:", deviceId);
        await bleManager.cancelDeviceConnection(deviceId);
        console.log(`Disconnected from ${deviceId}`);

        setConnectedDevice(null);

        console.log("Removing service UUIDs from storage...");
        await removeServiceUUIDs();
        console.log("Service UUIDs removed from storage.");

        // await removeConnectedDevice(deviceId);
      } catch (error) {
        if (error instanceof Error) {
          console.error(`Failed to disconnect from device ${deviceId}:`, error);
          Alert.alert(
            "Disconnection Error",
            error.message || "Failed to disconnect from device."
          );
        } else {
          console.error(`Failed to disconnect from device ${deviceId}:`, error);
          Alert.alert(
            "Disconnection Error",
            "Failed to disconnect from device."
          );
        }
      }
    },
    [bleManager, removeServiceUUIDs]
    // [bleManager, removeServiceUUIDs, removeConnectedDevice]
  );

  const subscribeToNotifiableCharacteristics = async (
    device: Device
  ): Promise<Service[] | void> => {
    try {
      // STEP 1: Discover all services and characteristics (IMPORTANT)
      await device.discoverAllServicesAndCharacteristics();
      console.log("Services and characteristics discovered.");

      // STEP 2: List all services and characteristics for the device
      const services = await device.services();

      for (const service of services) {
        const characteristics = await service.characteristics(); // Get all characteristics of the service

        for (const characteristic of characteristics) {
          if (characteristic.isNotifiable) {
            console.log(
              `Subscribing to characteristic ${characteristic.uuid} of service ${service.uuid}`
            );

            characteristic.monitor((error, updatedCharacteristic) => {
              if (error) {
                console.error(
                  `Error subscribing to characteristic ${characteristic.uuid}:`,
                  error
                );
                return;
              }

              if (updatedCharacteristic?.value) {
                const event = decodeValue(updatedCharacteristic.value);

                // console.log(
                //   `Notification received for characteristic ${characteristic.uuid} from service ${service.uuid}:`,
                //   event
                // );

                // Handle the event (e.g., update state, trigger actions)
                handlePedalEvent(event);
              }
            });
          }
        }
      }

      return services;
    } catch (error) {
      console.error("Error subscribing to characteristics:", error);
    }
  };

  // Handler function to process pedal events
  const handlePedalEvent = (event: string) => {
    switch (event) {
      case "Left Pedal Pressed Down":
        // console.log("Left Pedal Pressed Down");
        break;
      case "Right Pedal Pressed Down":
        console.log("Right Pedal Pressed Down");
        break;
      case "Pedal Released":
        console.log("Pedal Released");
        break;
      default:
        console.log("Unknown Pedal Event");
    }

    // Invoke all registered handlers
    pedalEventHandlers.current.forEach((handler) => handler(event));
  };

  const waitForBluetoothState = async (desiredState: string): Promise<void> => {
    try {
      let state = await bleManager.state();
      while (state !== desiredState) {
        console.log(
          `Waiting for Bluetooth state: ${desiredState}. Current state: ${state}`
        );

        if (state === "PoweredOff" || state === "Unauthorized") {
          throw new Error(
            `Bluetooth cannot reach the desired state (${desiredState}) from ${state}`
          );
        }

        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
        state = await bleManager.state();
      }
    } catch (error) {
      console.error("Error waiting for Bluetooth state:", error);
      throw error;
    }
  };

  const ensureDeviceConnected = async (device: Device): Promise<Device> => {
    try {
      // Wait for Bluetooth to be powered on
      await waitForBluetoothState("PoweredOn");

      const isConnected = await device.isConnected();
      if (!isConnected) {
        console.log("Device is not connected. Reconnecting...");
        const connectedDevice = await bleManager.connectToDevice(device.id, {
          timeout: 10000, // Set a timeout to avoid indefinite waits
        });
        console.log("Device reconnected:", connectedDevice.id);
        return connectedDevice;
      }

      console.log("Device is already connected:", device.id);
      return device;
    } catch (error) {
      console.error("Error ensuring device connection:", error);

      if (error instanceof BleError) {
        if (
          error?.errorCode === 2 ||
          error?.message.includes("Operation was cancelled")
        ) {
          console.log("Retrying connection...");
          return ensureDeviceConnected(device); // Retry on cancellation
        }
      }

      throw error; // Rethrow if not recoverable
    }
  };

  /**
   * Initialize BLE on mount
   */
  useEffect(() => {
    // Initialize BLE only once
    if (isInitialized.current) {
      console.log("Already initialized...");
      return;
    }

    isInitialized.current = true;

    const initializeBLE = async () => {
      try {
        // Request necessary permissions
        await requestPermissions();

        console.log("Initializing BLE...");

        // Get current BLE state
        const state = await bleManager.state();
        console.log("BLE STATE:", state);
        setBleState(state);

        // Load connected device from storage
        const device = await loadConnectedDevice();
        if (device) {
          setConnectedDevice(device);
          const connectedDevice = await ensureDeviceConnected(device);
          await subscribeToNotifiableCharacteristics(connectedDevice);
        }
        scanForDevices();

        // Setup BLE state change listener
        subscription = handleBLEStateChange();
      } catch (error) {
        console.error("Error during BLE initialization:", error);
        setError("Failed to initialize BLE.");
      }
    };

    initializeBLE();

    // Cleanup on unmount
    return () => {
      if (subscription) {
        subscription.remove();
      }
      bleManager.stopDeviceScan();
      bleManager.destroy();
    };
  }, []);

  const contextValue: BLEContextProps = {
    bleState,
    connectedDevice,
    availableDevices,
    // isScanning,
    error,
    scanForDevices,
    connectToDevice,
    disconnectFromDevice,
    registerPedalEventHandler,
  };

  return (
    <BLEContext.Provider value={contextValue}>{children}</BLEContext.Provider>
  );
};

/**
 * Save connected device IDs to AsyncStorage
 */
//   const saveConnectedDevice = useCallback(
//     async (device: Device): Promise<void> => {
//       try {
//         const existing = await getItem("connectedDevices");
//         let devices: string[] = existing ? JSON.parse(existing) : [];
//         if (!devices.includes(device.id)) {
//           devices.push(device.id);
//           await saveItem("connectedDevices", JSON.stringify(devices));
//         }
//       } catch (err) {
//         console.error("Error saving connected device:", err);
//       }
//     },
//     []
//   );

/**
 * Remove connected device ID from AsyncStorage
 */
//   const removeConnectedDevice = useCallback(
//     async (deviceId: string): Promise<void> => {
//       try {
//         const existing = await getItem("connectedDevices");
//         let devices: string[] = existing ? JSON.parse(existing) : [];
//         devices = devices.filter((id) => id !== deviceId);
//         await saveItem("connectedDevices", JSON.stringify(devices));
//       } catch (err) {
//         console.error("Error removing connected device:", err);
//       }
//     },
//     []
//   );

/**
 * Reconnect to previously connected devices
 */
//   const reconnectDevices = useCallback(async (): Promise<void> => {
//     try {
//       const connectedDeviceIds = await getItem("connectedDevices");
//       const deviceIds: string[] = connectedDeviceIds
//         ? JSON.parse(connectedDeviceIds)
//         : [];

//       for (const deviceId of deviceIds) {
//         try {
//           const device = await bleManager.connectToDevice(deviceId);
//           await device.discoverAllServicesAndCharacteristics();
//           setConnectedDevices((prevDevices) => {
//             if (!prevDevices.find((d) => d.id === device.id)) {
//               return [...prevDevices, device];
//             }
//             return prevDevices;
//           });
//           console.log(`Reconnected to device: ${device.name}`);
//         } catch (err) {
//           console.error(`Failed to reconnect to device ${deviceId}:`, err);
//           // Optionally remove device from storage if reconnection fails
//           await removeConnectedDevice(deviceId);
//         }
//       }
//     } catch (err) {
//       console.error("Error during reconnection:", err);
//     }
//   }, [removeConnectedDevice]);
