import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const CitizenProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.body}>This will connect to /api/citizen/profile for viewing and editing user details.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
  title: { fontSize: 24, fontWeight: "700" },
  body: { fontSize: 16, color: "#4b5563" },
});

