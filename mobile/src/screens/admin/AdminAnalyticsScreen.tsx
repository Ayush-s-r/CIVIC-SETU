import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const AdminAnalyticsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analytics</Text>
      <Text style={styles.body}>This will connect to /api/admin/analytics for charts and metrics.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
  title: { fontSize: 24, fontWeight: "700" },
  body: { fontSize: 16, color: "#4b5563" },
});

