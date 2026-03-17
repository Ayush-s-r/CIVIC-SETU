import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { apiRequest } from "../../api/client";

type AdminStats = {
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  inProgressComplaints: number;
  totalUsers: number;
  activeDepartments: number;
};

export const AdminDashboardScreen: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiRequest<{
          stats: AdminStats;
          recentComplaints: any[];
        }>("/admin/dashboard");
        setStats(data.stats);
        setRecent(data.recentComplaints);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load admin dashboard.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.body}>Loading dashboard...</Text>
      </View>
    );
  }

  if (error || !stats) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.body}>{error ?? "No data available."}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.body}>Monitor complaints, users, and departments.</Text>

      <View style={styles.statsRow}>
        <StatCard label="Total Complaints" value={stats.totalComplaints} />
        <StatCard label="Resolved" value={stats.resolvedComplaints} />
        <StatCard label="In Progress" value={stats.inProgressComplaints} />
        <StatCard label="Pending" value={stats.pendingComplaints} />
        <StatCard label="Users" value={stats.totalUsers} />
        <StatCard label="Departments" value={stats.activeDepartments} />
      </View>

      <Text style={styles.sectionTitle}>Recent Complaints</Text>
      <FlatList
        data={recent}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardMeta}>
              {item.department} • {item.status.toUpperCase()}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20, gap: 8 },
  title: { fontSize: 24, fontWeight: "700" },
  body: { fontSize: 14, color: "#4b5563", textAlign: "center" },
  statsRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statCard: {
    flexBasis: "47%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  statValue: { fontSize: 20, fontWeight: "700" },
  statLabel: { fontSize: 12, color: "#6b7280" },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginTop: 12 },
  separator: { height: 8 },
  card: { backgroundColor: "#ffffff", borderRadius: 12, padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  cardMeta: { fontSize: 12, color: "#6b7280", marginTop: 2 },
});

