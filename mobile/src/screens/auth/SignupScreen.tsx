import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { PublicStackParamList } from "../../navigation/PublicStack";
import { Button } from "../../ui/Button";
import { signup } from "../../api/auth";

type Props = NativeStackScreenProps<PublicStackParamList, "Signup"> & {
  onAuthenticated: (role: "citizen" | "admin") => void;
};

export const SignupScreen: React.FC<Props> = ({ navigation, onAuthenticated }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (password !== confirm) {
      Alert.alert("Signup", "Passwords do not match");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Signup", "Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const role = await signup(name.trim(), email.trim(), password);
      onAuthenticated(role);
    } catch (e) {
      Alert.alert("Signup failed", e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput value={name} onChangeText={setName} placeholder="Full name" style={styles.input} />
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry style={styles.input} />
      <TextInput
        value={confirm}
        onChangeText={setConfirm}
        placeholder="Confirm password"
        secureTextEntry
        style={styles.input}
      />

      <Button title={loading ? "Creating..." : "Create account"} onPress={submit} disabled={loading} />
      <Button title="Back to login" variant="ghost" onPress={() => navigation.navigate("Login")} />
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

