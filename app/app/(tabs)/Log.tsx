import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Platform,
  Image,
  ScrollView
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import axiosInstance from "@/axiosConfig";
import loadingOverlay from "../components/LoadingOverlay";
import logo from "../../assets/images/logo.png";

/* ================= TABLE HEADER ================= */
const renderTableHeading = () => (
  <View className="flex-row py-2 bg-slate-500 rounded-t-lg">
    <Text className="w-24 text-center text-white text-xs">Date</Text>
    <Text className="w-14 text-center text-white text-xs">Temp</Text>
    <Text className="w-14 text-center text-white text-xs">Hum</Text>
    <Text className="w-16 text-center text-white text-xs">Rain</Text>
    <Text className="w-20 text-center text-white text-xs">Weather</Text>
    <Text className="w-24 text-center text-white text-xs">Umbrellas</Text>
    <Text className="w-18 text-center text-white text-xs">RFID</Text>
    <Text className="w-20 text-center text-white text-xs">Charging</Text>
    <Text className="w-20 text-center text-white text-xs">Time</Text>
  </View>
);

/* ================= TABLE ROW ================= */
const renderTableData = ({ item }) => {
  if (!item) return null;

  const umbrellaStatus = `${item.umbrella1 ? "A" : "B"} | ${
    item.umbrella2 ? "A" : "B"
  } | ${item.umbrella3 ? "A" : "B"}`;

  return (
    <View className="flex-row py-2 border-b border-gray-100">
      <Text className="w-24 text-center text-xs">
        {new Date(item.eventDate).toLocaleDateString()}
      </Text>

      <Text className="w-14 text-center text-xs">{item.temperature}°</Text>
      <Text className="w-14 text-center text-xs">{item.humidity}%</Text>
      <Text className="w-16 text-center text-xs">{item.rainSensorValue}</Text>
      <Text className="w-20 text-center text-xs">{item.weatherStatus}</Text>

      <Text className="w-24 text-center text-xs">{umbrellaStatus}</Text>
      <Text className="w-18 text-center text-xs">{item.rfidAction}</Text>

      <Text className="w-20 text-center text-xs">
        {item.isCharging ? "YES" : "NO"}
      </Text>

      <Text className="w-20 text-center text-xs">
        {item.chargingTimeRemaining} min
      </Text>
    </View>
  );
};

/* ================= MAIN PAGE ================= */
const ProfileTab = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [deviceIDs, setDeviceIDs] = useState([]);
  const [selectedDeviceID, setSelectedDeviceID] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const loadDevices = async () => {
    try {
      const res = await axiosInstance.get("/device/get-my-devices", {
        withCredentials: true
      });

      if (res.data.success) {
        setDeviceIDs(res.data.data.map(d => d.deviceID));
      }
    } catch {
      Toast.show({ type: "error", text1: "Error loading devices" });
    }
  };

  useEffect(() => {
    loadDevices();
  }, []);

  const searchEvents = async () => {
    setIsLoading(true);
    try {
      const payload = { startDate, endDate };
      if (selectedDeviceID) payload.deviceID = selectedDeviceID;

      const res = await axiosInstance.post(
        "/event/sensor-records",
        payload,
        { withCredentials: true }
      );

      setData(res.data.success ? res.data.data : []);
    } catch {
      Toast.show({ type: "error", text1: "Failed to load logs" });
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {isLoading && loadingOverlay()}

      {/* HEADER */}
      <View className="flex-row items-center gap-4 px-5 py-4 bg-white shadow-sm pt-10">
        <Image source={logo} style={{ width: 50, height: 50 }} />
        <Text className="text-3xl font-extrabold text-green-700">Logs</Text>
      </View>

      {/* FILTERS */}
      <View className="mx-5 my-5 p-4 bg-white rounded-lg shadow-sm">
        <Text className="text-gray-600 mb-2">Device</Text>
        <Picker selectedValue={selectedDeviceID} onValueChange={setSelectedDeviceID}>
          <Picker.Item label="All Devices" value="" />
          {deviceIDs.map(id => (
            <Picker.Item key={id} label={id} value={id} />
          ))}
        </Picker>

        <View className="flex-row gap-3 mt-4">
          <TouchableOpacity
            className="flex-1 border p-3 rounded-lg"
            onPress={() => setShowStartPicker(true)}
          >
            <Text>Start: {startDate.toLocaleDateString()}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 border p-3 rounded-lg"
            onPress={() => setShowEndPicker(true)}
          >
            <Text>End: {endDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>

        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            onChange={(e, d) => {
              setShowStartPicker(false);
              d && setStartDate(d);
            }}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            minimumDate={startDate}
            onChange={(e, d) => {
              setShowEndPicker(false);
              d && setEndDate(d);
            }}
          />
        )}

        <TouchableOpacity
          onPress={searchEvents}
          className="bg-blue-600 mt-4 py-3 rounded-lg"
        >
          <Text className="text-white text-center font-semibold">
            Search Logs
          </Text>
        </TouchableOpacity>
      </View>

      {/* ✅ SCROLLABLE TABLE */}
      {data.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <View className="mx-2 bg-white rounded-lg shadow-sm min-w-[900px]">
            <FlatList
              data={data}
              keyExtractor={item => item._id}
              ListHeaderComponent={renderTableHeading}
              renderItem={renderTableData}
              stickyHeaderIndices={[0]}
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default ProfileTab;
