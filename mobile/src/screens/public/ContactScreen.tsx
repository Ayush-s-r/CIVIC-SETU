import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { Button } from "../../ui/Button";
import { apiRequest } from "../../api/client";

export const ContactScreen: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async () => {
    if (!name || !email || !message) {
      Alert.alert("Contact", "Please fill in all fields.");
      return;
    }
    setSending(true);
    try {
      // Backend endpoint for contact is not defined in the Node API,
      // but we keep the same path used in the web placeholder.
      await apiRequest("/contact", {
        method: "POST",
        auth: false,
        body: JSON.stringify({ name, email, message }),
      });
      Alert.alert("Contact", "Message sent successfully.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (e) {
      Alert.alert("Contact", e instanceof Error ? e.message : "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Us</Text>
      <Text style={styles.body}>Have a question or want to report an issue? Send us a message.</Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Your name"
        style={styles.input}
      />
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Your message"
        multiline
        numberOfLines={4}
        style={[styles.input, styles.textarea]}
      />

      <Button title={sending ? "Sending..." : "Send"} onPress={submit} disabled={sending} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
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
  textarea: { height: 120, textAlignVertical: "top" },
});

