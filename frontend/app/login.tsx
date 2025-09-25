// app/login.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (!name || !height || !weight) {
      alert("Kérlek add meg a neved, magasságot és testsúlyt!");
      return;
    }
    router.replace(`/home?name=${encodeURIComponent(name)}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bejelentkezés vendégként</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Neved</Text>
        <TextInput
          style={styles.input}
          placeholder="Add meg a neved"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Magasság</Text>
        <TextInput
          style={styles.input}
          placeholder="Magasság cm-ben"
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Testsúly</Text>
        <TextInput
          style={styles.input}
          placeholder="Testsúly kg-ban"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Belépés</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});