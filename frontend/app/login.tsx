import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (!height || !weight) {
      alert("Kérlek add meg a magasságot és a testsúlyt!");
      return;
    }
    // Itt lehetne menteni backendbe vagy context-be az adatokat
    router.replace("/home"); // átirányítás a home.tsx képernyőre
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bejelentkezés vendégként</Text>

      <TextInput
        style={styles.input}
        placeholder="Magasság (cm)"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />

      <TextInput
        style={styles.input}
        placeholder="Testsúly (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

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
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
