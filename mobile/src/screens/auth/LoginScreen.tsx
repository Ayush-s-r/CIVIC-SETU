import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { PublicStackParamList } from "../../navigation/PublicStack";
import { Button } from "../../ui/Button";
import { login } from "../../api/auth";

type Props = NativeStackScreenProps<PublicStackParamList, "Login"> & {
  onAuthenticated: (role: "citizen" | "admin") => void;
};

export const LoginScreen: React.FC<Props> = ({ navigation, onAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      const role = await login(email.trim(), password);
      onAuthenticated(role);
    } catch (e) {
      Alert.alert("Login failed", e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />

      <Button title={loading ? "Logging in..." : "Login"} onPress={submit} disabled={loading} />
      <Button title="Create account" variant="ghost" onPress={() => navigation.navigate("Signup")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
});

