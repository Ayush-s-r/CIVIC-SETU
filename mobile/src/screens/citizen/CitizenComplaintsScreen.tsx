import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { apiRequest } from "../../api/client";

type Complaint = {
  id: string;
  title: string;
  status: string;
  priority?: string;
  location?: string;
  date?: string;
};

export const CitizenComplaintsScreen: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<{
        complaints: any[];
      }>("/citizen/complaints" + (search ? `?search=${encodeURIComponent(search)}` : ""));
      setComplaints(
        data.complaints.map((c) => ({
          id: c._id ?? c.id,
          title: c.title,
          status: c.status,
          priority: c.priority,
          location: c.location?.address ?? c.location ?? "",
          date: c.createdAt?.slice(0, 10),
        }))
      );
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load complaints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadComplaints();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Complaints</Text>
      <Text style={styles.body}>Search and track all your submitted complaints.</Text>

      <View style={styles.searchRow}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search by title, tracking number, location..."
          style={styles.searchInput}
        />
        <View style={styles.searchButtonWrapper}>
          <Text style={styles.searchLabel} onPress={loadComplaints}>
            Go
          </Text>
        </View>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="small" />
        </View>
      )}

      {error ? <Text style={[styles.body, { color: "#b91c1c" }]}>{error}</Text> : null}

      <FlatList
        data={complaints}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 24, gap: 8 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            {item.location ? <Text style={styles.cardMeta}>{item.location}</Text> : null}
            <Text style={styles.cardMeta}>
              {item.status.toUpperCase()} {item.priority ? `• ${item.priority.toUpperCase()}` : ""}{" "}
              {item.date ? `• ${item.date}` : ""}
            </Text>
          </View>
        )}
        ListEmptyComponent={!loading ? <Text style={styles.body}>No complaints found.</Text> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 8 },
  title: { fontSize: 24, fontWeight: "700" },
  body: { fontSize: 14, color: "#4b5563" },
  center: { paddingVertical: 8, alignItems: "center" },
  searchRow: { flexDirection: "row", gap: 8, marginTop: 4 },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  searchButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#2563eb",
  },
  searchLabel: { color: "#ffffff", fontWeight: "600" },
  separator: { height: 8 },
  card: { backgroundColor: "#ffffff", borderRadius: 12, padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  cardMeta: { fontSize: 12, color: "#6b7280", marginTop: 2 },
});

