import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const AdminUsersScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users</Text>
      <Text style={styles.body}>
        The web app had this as a placeholder; backend supports /api/admin/users for listing and updating user roles.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
  title: { fontSize: 24, fontWeight: "700" },
  body: { fontSize: 16, color: "#4b5563" },
});

