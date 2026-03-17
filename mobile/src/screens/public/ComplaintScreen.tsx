import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "../../ui/Button";
import { apiRequest } from "../../api/client";
import { loadSession } from "../../services/session";

export const ComplaintScreen: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!fullName || !email || !mobile || !address || !category || !description) {
      Alert.alert("Complaint", "Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      const session = await loadSession();
      const isCitizen = session.user?.role === "citizen";

      const payload: any = {
        title: `${category} issue`,
        description,
        category,
        department: category === "road" ? "pwd" : category,
        location: { address },
      };

      if (isCitizen) {
        // Logged-in citizen: backend will populate citizen fields from JWT
        await apiRequest("/citizen/complaints", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      } else {
        // Public complaint: pass citizen details explicitly
        await apiRequest("/complaints", {
          method: "POST",
          auth: false,
          body: JSON.stringify({
            ...payload,
            citizen: {
              name: fullName,
              email,
              phone: mobile,
            },
          }),
        });
      }

      Alert.alert("Complaint", "Complaint submitted successfully.");
      setFullName("");
      setEmail("");
      setMobile("");
      setAddress("");
      setCategory("");
      setDescription("");
    } catch (e) {
      Alert.alert("Complaint", e instanceof Error ? e.message : "Failed to submit complaint.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>File a Complaint</Text>
      <Text style={styles.body}>
        Provide details about the civic issue. Attach evidence from the Report screen if needed.
      </Text>

      <TextInput
        value={fullName}
        onChangeText={setFullName}
        placeholder="Full Name"
        style={styles.input}
      />
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        value={mobile}
        onChangeText={setMobile}
        placeholder="Mobile"
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Address / Location"
        style={styles.input}
      />
      <TextInput
        value={category}
        onChangeText={setCategory}
        placeholder="Category (road, garbage, streetlight, water, etc.)"
        style={styles.input}
      />
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Describe the issue"
        multiline
        numberOfLines={4}
        style={[styles.input, styles.textarea]}
      />

      <Button title={submitting ? "Submitting..." : "Submit Complaint"} onPress={submit} disabled={submitting} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, gap: 12 },
  title: { fontSize: 24, fontWeight: "700" },
  body: { fontSize: 14, color: "#4b5563", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textarea: { height: 140, textAlignVertical: "top" },
});

