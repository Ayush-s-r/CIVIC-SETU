import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { apiRequest } from "../../api/client";

type CitizenStats = {
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  inProgressComplaints: number;
};

type CitizenComplaint = {
  id: string;
  title: string;
  location?: string;
  status: string;
  date?: string;
};

export const CitizenDashboardScreen: React.FC = () => {
  const [stats, setStats] = useState<CitizenStats | null>(null);
  const [recent, setRecent] = useState<CitizenComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiRequest<{
          stats: CitizenStats;
          recentComplaints: any[];
        }>("/citizen/dashboard");
        setStats(data.stats);
        setRecent(
          data.recentComplaints.map((c) => ({
            id: c._id ?? c.id,
            title: c.title,
            location: c.location?.address ?? c.location ?? "",
            status: c.status,
            date: c.createdAt?.slice(0, 10),
          }))
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load dashboard.");
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
        <Text style={styles.title}>Citizen Dashboard</Text>
        <Text style={styles.body}>{error ?? "No data available."}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Citizen Dashboard</Text>
      <Text style={styles.body}>Your complaints at a glance.</Text>

      <View style={styles.statsRow}>
        <StatCard label="Total" value={stats.totalComplaints} />
        <StatCard label="Resolved" value={stats.resolvedComplaints} />
        <StatCard label="In Progress" value={stats.inProgressComplaints} />
        <StatCard label="Pending" value={stats.pendingComplaints} />
      </View>

      <Text style={styles.sectionTitle}>Recent Complaints</Text>
      <FlatList
        data={recent}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <View style={styles.complaintCard}>
            <Text style={styles.complaintTitle}>{item.title}</Text>
            {item.location ? <Text style={styles.complaintMeta}>{item.location}</Text> : null}
            <Text style={styles.complaintMeta}>
              {item.status.toUpperCase()} {item.date ? `• ${item.date}` : ""}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.body}>No complaints yet.</Text>}
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
  statsRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 4 },
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
  complaintCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
  },
  complaintTitle: { fontSize: 16, fontWeight: "600" },
  complaintMeta: { fontSize: 12, color: "#6b7280", marginTop: 2 },
});

