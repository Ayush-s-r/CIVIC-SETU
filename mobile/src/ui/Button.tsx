import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
};

export const Button: React.FC<Props> = ({ title, onPress, disabled, variant = "primary" }) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.text, textVariantStyles[variant]]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.5 },
  text: { fontSize: 16, fontWeight: "600" },
});

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: "#2563eb" },
  secondary: { backgroundColor: "#374151" },
  ghost: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#d1d5db" },
});

const textVariantStyles = StyleSheet.create({
  primary: { color: "#fff" },
  secondary: { color: "#fff" },
  ghost: { color: "#111827" },
});

