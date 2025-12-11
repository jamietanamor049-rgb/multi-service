import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Multi-Service Station</Text>

      {/* Weather Monitoring */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🌦 Weather Monitoring</Text>
        <Text style={styles.info}>• Temperature: -- °C</Text>
        <Text style={styles.info}>• Humidity: -- %</Text>
        <Text style={styles.info}>• Rain Status: --</Text>
      </View>

      {/* Smart Charging */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔌 Smart Charging</Text>
        <Text style={styles.info}>• USB Output: Ready</Text>
        <Text style={styles.info}>• Battery Status: -- %</Text>
      </View>

      {/* Umbrella Dock */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>☂ Umbrella Dock</Text>
        <Text style={styles.info}>Slot 1: --</Text>
        <Text style={styles.info}>Slot 2: --</Text>
        <Text style={styles.info}>Slot 3: --</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 4,
  },
});
