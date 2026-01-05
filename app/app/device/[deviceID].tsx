import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView
} from "react-native";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  AntDesign,
  Octicons
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import axiosInstance from "@/axiosConfig";
import Toast from "react-native-toast-message";
import loadingOverlay from "../components/LoadingOverlay";

/* ================= METRIC CARD (SHARED STYLE) ================= */
const MetricCard = ({ title, value, unit = "", iconName, color }) => (
  <View className="w-1/2 p-2">
    <View
      className={`flex-row items-center p-3 rounded-xl shadow-sm border border-gray-100 ${color}`}
    >
      <MaterialCommunityIcons name={iconName} size={24} color="#374151" />
      <View className="ml-3">
        <Text className="text-lg font-bold text-gray-800">
          {typeof value === "boolean"
            ? value
              ? "YES"
              : "NO"
            : `${value}${unit}`}
        </Text>
        <Text className="text-xs text-gray-500">{title}</Text>
      </View>
    </View>
  </View>
);

/* ================= DEVICE DETAILS ================= */
const DeviceDetails = () => {
  const { deviceID } = useLocalSearchParams();
  const [device, setDevice] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newDeviceID, setNewDeviceID] = useState("");

  /* AUTO REFRESH */
  useEffect(() => {
    reloadData();
    const interval = setInterval(reloadData, 20000);
    return () => clearInterval(interval);
  }, []);

  /* LOAD DEVICE */
  const reloadData = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get(
        `/device/get-a-device/${deviceID}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setDevice(res.data.data[0]);
      } else {
        Toast.show({ type: "error", text1: "Failed to load device" });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error loading device",
        text2: err.message
      });
    }
    setIsLoading(false);
  };

  /* RENAME */
  const confirmRenamePress = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.put(
        `/device/update/${device._id}`,
        { deviceID: newDeviceID },
        { withCredentials: true }
      );

      if (res.data.success) {
        Toast.show({ type: "success", text1: "Device ID updated" });
        setDevice(res.data.data[0]);
        setShowRenameModal(false);
        setNewDeviceID("");
      } else {
        Toast.show({ type: "error", text1: res.data.message });
      }
    } catch (err) {
      Toast.show({ type: "error", text1: err.message });
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {isLoading && loadingOverlay()}

      {Object.keys(device).length > 0 && (
        <ScrollView>
          {/* HEADER */}
          <View className="bg-white p-4 pt-10 shadow-sm border-b border-gray-100">
            <View className="flex-row justify-between items-center">
              <Text className="text-3xl font-extrabold text-green-700">
                {device.deviceID}
              </Text>

              <TouchableOpacity
                onPress={() => setShowRenameModal(true)}
                className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center"
              >
                <MaterialIcons name="edit" size={16} color="white" />
                <Text className="text-white ml-2 font-semibold">Edit</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center mt-2">
              <Text className="text-gray-500 mr-2">Status:</Text>
              <Octicons
                name="dot-fill"
                size={26}
                color={device.isOnline ? "green" : "red"}
              />
            </View>
          </View>

          {/* 🌦 WEATHER */}
          <View className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-md">
            <Text className="text-lg font-extrabold mb-2">Weather Monitoring</Text>
            <View className="flex-row flex-wrap -m-2">
              <MetricCard
                title="Temperature"
                value={device.temperature}
                unit="°C"
                iconName="temperature-celsius"
                color="bg-red-50"
              />
              <MetricCard
                title="Humidity"
                value={device.humidity}
                unit="%"
                iconName="water-percent"
                color="bg-blue-50"
              />
              <MetricCard
                title="Rain Sensor"
                value={device.rainSensorValue}
                iconName="weather-rainy"
                color="bg-sky-50"
              />
              <MetricCard
                title="Weather Status"
                value={device.weatherStatus}
                iconName={
                  device.weatherStatus === "RAINING"
                    ? "weather-rainy"
                    : "weather-sunny"
                }
                color="bg-indigo-50"
              />
            </View>
          </View>

          {/* 🌂 UMBRELLA DOCK */}
          {[1, 2, 3].map((dock) => (
            <View
              key={dock}
              className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-md"
            >
              <Text className="text-lg font-extrabold mb-2">
                Umbrella Dock {dock}
              </Text>
              <View className="flex-row">
                <MetricCard
                  title="Availability"
                  value={device[`umbrella${dock}`]}
                  iconName="umbrella"
                  color="bg-cyan-50"
                />
                <MetricCard
                  title="RFID Action"
                  value={device.rfidAction}
                  iconName="card-account-details"
                  color="bg-purple-50"
                />
              </View>
            </View>
          ))}

          {/* 🔌 SMART CHARGING */}
          <View className="bg-white mx-4 mt-4 mb-10 p-4 rounded-xl shadow-md">
            <Text className="text-lg font-extrabold mb-2">
              Coin-Based Smart Charging
            </Text>

            <View className="flex-row">
              <MetricCard
                title="Port Status"
                value={
                  device.isCharging
                    ? "CHARGING"
                    : device.portAvailable
                    ? "AVAILABLE"
                    : "PHONE DETECTED"
                }
                iconName="power-plug"
                color="bg-emerald-50"
              />
              <MetricCard
                title="Charging"
                value={device.isCharging}
                iconName="battery-charging"
                color="bg-green-50"
              />
            </View>

            <View className="flex-row">
              <MetricCard
                title="Coins Inserted"
                value={device.coinCount}
                unit=" × ₱5"
                iconName="currency-php"
                color="bg-yellow-50"
              />
              <MetricCard
                title="Time Remaining"
                value={device.chargingTimeRemaining}
                unit=" min"
                iconName="timer"
                color="bg-orange-50"
              />
            </View>

            <View className="flex-row">
              <MetricCard
                title="Coin Detected"
                value={device.coinInserted}
                iconName="cash"
                color="bg-lime-50"
              />
            </View>
          </View>
        </ScrollView>
      )}

      {/* RENAME MODAL */}
      <Modal visible={showRenameModal} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="bg-white p-6 rounded-lg w-80">
            <Text className="text-lg font-bold text-center mb-4">
              New Device ID
            </Text>

            <View className="flex-row border rounded-lg mb-6">
              <View className="px-3 justify-center">
                <AntDesign name="barcode" size={24} color="green" />
              </View>
              <TextInput
                className="flex-1 px-3 py-2"
                placeholder="Device ID"
                value={newDeviceID}
                onChangeText={setNewDeviceID}
              />
            </View>

            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setShowRenameModal(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmRenamePress}
                className="bg-blue-600 px-4 py-2 rounded-lg"
              >
                <Text className="text-white">Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DeviceDetails;
