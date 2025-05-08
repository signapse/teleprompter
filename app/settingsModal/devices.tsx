import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useBLE } from "../../components/providers/ble/BLEContext";
import { Pressable } from "react-native";
import { useCallback, useState } from "react";
import { Device, State } from "react-native-ble-plx";
import Button from "@/components/ui/button/Button";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";

interface IDeviceItemProps {
  device: Device;
  connectToDevice: (id: string) => Promise<void>;
  disconnectFromDevice: (id: string) => Promise<void>;
  withBorderBottom: boolean;
  isConnected: boolean;
}

const DeviceItem = ({
  device,
  connectToDevice,
  disconnectFromDevice,
  withBorderBottom,
  isConnected,
}: IDeviceItemProps) => {
  const [connecting, setConnecting] = useState(false);

  const onPress = async () => {
    setConnecting(true);
    if (isConnected) {
      await disconnectFromDevice(device.id);
    } else {
      await connectToDevice(device.id);
    }
    setConnecting(false);
  };

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        withBorderBottom && {
          borderBottomWidth: 1,
          borderColor: "#D8DEE4",
        },
      ]}
    >
      <Text style={styles.buttonTitle}>{device.name}</Text>
      <Text>
        {connecting ? (
          <ActivityIndicator size="small" />
        ) : isConnected ? (
          "Disconnect"
        ) : (
          "Connect"
        )}
      </Text>
    </Pressable>
  );
};

export default function Test() {
  const {
    availableDevices,
    bleState,
    connectedDevice,
    connectToDevice,
    disconnectFromDevice,
    scanForDevices,
  } = useBLE();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
              }}
            >
              Status:{" "}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {bleState === State.PoweredOn ? "On" : "Off"}
            </Text>
          </View>
          <Pressable style={styles.scanButton} onPress={scanForDevices}>
            <TabBarIcon name="scan" color="white" size={26} />
          </Pressable>
        </View>
        {availableDevices?.length > 0 ? (
          <View style={styles.section}>
            {availableDevices.map((device, index) => (
              <DeviceItem
                key={device.id}
                device={device}
                connectToDevice={connectToDevice}
                disconnectFromDevice={disconnectFromDevice}
                withBorderBottom={index !== availableDevices.length - 1}
                isConnected={connectedDevice?.id === device.id}
              />
            ))}
          </View>
        ) : (
          <Text>
            No available devices. Make sure your device is turned on and in
            range.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#E5E9EF",
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 12,
    gap: 22,
  },
  section: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FBFCFE",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    height: 60,
  },
  buttonTitle: {
    fontSize: 16,
    color: "black",
  },
  scanButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#595DBA",
    borderRadius: 8,
    width: 40,
    height: 40,
  },
});
