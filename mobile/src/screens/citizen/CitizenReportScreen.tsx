import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Button } from "../../ui/Button";
import { BACKEND_BASE_URL } from "../../api/client";

export const CitizenReportScreen: React.FC = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [annotatedUri, setAnnotatedUri] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Please allow access to your photos.");
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });

    if (!res.canceled) {
      setImageUri(res.assets[0]?.uri ?? null);
      setAnnotatedUri(null);
    }
  };

  const runDetection = async () => {
    if (!imageUri) return;
    setBusy(true);
    try {
      const form = new FormData();
      form.append(
        "image",
        {
          uri: imageUri,
          name: "evidence.jpg",
          type: "image/jpeg",
        } as any
      );

      const response = await fetch(`${BACKEND_BASE_URL}/api/detection/image`, {
        method: "POST",
        body: form,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "Detection failed");
      }

      if (data.annotatedImage) {
        setAnnotatedUri(`${BACKEND_BASE_URL}${data.annotatedImage}`);
      }
    } catch (e) {
      Alert.alert("Detection error", e instanceof Error ? e.message : "Unknown error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report Issue</Text>
      <Text style={styles.body}>This is the mobile equivalent of /complaint and /citizen/report.</Text>

      <Button title="Pick evidence image" onPress={pickImage} />
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : null}

      <Button
        title={busy ? "Running detection..." : "Run damage detection"}
        onPress={runDetection}
        disabled={!imageUri || busy}
      />

      {annotatedUri ? (
        <>
          <Text style={styles.subtitle}>Detected damage</Text>
          <Image source={{ uri: annotatedUri }} style={styles.image} />
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
  title: { fontSize: 24, fontWeight: "700" },
  subtitle: { fontSize: 18, fontWeight: "600", marginTop: 8 },
  body: { fontSize: 16, color: "#4b5563" },
  image: { width: "100%", height: 240, borderRadius: 12, backgroundColor: "#e5e7eb" },
});

