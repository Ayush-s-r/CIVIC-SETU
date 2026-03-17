import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type Props = {
  label?: string;
};

export const LoadingScreen: React.FC<Props> = ({ label = "Loading..." }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 12,
  },
  text: {
    fontSize: 16,
    color: "#4b5563",
  },
});

