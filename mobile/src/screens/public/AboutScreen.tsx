import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const AboutScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About CivicSetu</Text>
      <Text style={styles.body}>
        CivicSetu helps citizens report local issues, ensures they reach the right authority, and allows tracking until
        resolution.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
  title: { fontSize: 24, fontWeight: "700" },
  body: { fontSize: 16, color: "#4b5563", lineHeight: 22 },
});

