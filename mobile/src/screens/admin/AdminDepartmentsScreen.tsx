import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const AdminDepartmentsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Departments</Text>
      <Text style={styles.body}>
        This corresponds to /admin/departments in the web app and to /api/admin/departments in the backend.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
  title: { fontSize: 24, fontWeight: "700" },
  body: { fontSize: 16, color: "#4b5563" },
});

