import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Octicons } from '@expo/vector-icons';

const MetricCard = ({ title, value, unit = "", iconName, color }) => (
  <View className="w-1/2 p-2">
    <View className={`flex-row items-center p-3 rounded-xl shadow-sm border border-gray-100 ${color}`}>
      <MaterialCommunityIcons name={iconName} size={24} color="#374151" />
      <View className="ml-3">
        <Text className="text-lg font-bold text-gray-800">
          {typeof value === "boolean" ? (value ? "YES" : "NO") : `${value}${unit}`}
        </Text>
        <Text className="text-xs text-gray-500">{title}</Text>
      </View>
    </View>
  </View>
);

const DeviceCard = ({ device, pressEventHandler }) => {
  return (
    <TouchableOpacity
      className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-md border border-gray-100"
      onPress={() => pressEventHandler(device)}
      activeOpacity={0.8}
    >
      {/* HEADER */}
      <View className="flex-row justify-between items-start pb-3 mb-3 border-b border-gray-100">
        <View>
          <Text className="text-xl font-extrabold text-gray-900">
            {device.deviceID}
          </Text>
          <Text className="text-xs text-gray-500">
            Owner: {device.owner?.username || device.owner}
          </Text>
        </View>
        <Octicons
          name="dot-fill"
          size={30}
          color={device.isOnline ? "green" : "red"}
        />
      </View>

      {/* 🌦 WEATHER MONITORING */}
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
          unit=""
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

      {/* 🌂 UMBRELLA DOCK SYSTEM */}
      {[1, 2, 3].map((dock) => (
        <View key={dock} className="mx-3 mt-2 border border-gray-200 rounded-lg">
          <Text className="text-lg font-extrabold text-gray-900 mx-3 my-2">
            Umbrella Dock {dock}
          </Text>
          <View className="flex-row">
            <MetricCard
              title="Availability"
              value={device[`umbrella${dock}`] ? "AVAILABLE" : "BORROWED"}
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

      {/* 🔌 COIN-BASED SMART CHARGING */}
      <View className="mx-3 mt-2 border border-gray-200 rounded-lg">
        <Text className="text-lg font-extrabold text-gray-900 mx-3 my-2">
          Coin-Based Smart Charging
        </Text>

        {/* Port status */}
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
            color={device.isCharging ? "bg-emerald-50" : "bg-gray-50"}
          />
          <MetricCard
            title="Charging"
            value={device.isCharging}
            iconName="battery-charging"
            color="bg-green-50"
          />
        </View>

        {/* Coins and time */}
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

        {/* Coin detection */}
        <View className="flex-row">
          <MetricCard
            title="Coin Detected"
            value={device.coinInserted}
            iconName="cash"
            color="bg-lime-50"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DeviceCard;
