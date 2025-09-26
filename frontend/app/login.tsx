// app/login.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateWorkoutPlan } from "../services/workoutService";

export default function LoginScreen() {
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!name || !height || !weight) {
      Alert.alert("Hiba", "Kérlek add meg a neved, magasságot és testsúlyt!");
      return;
    }

    const parsedHeight = Number(height);
    const parsedWeight = Number(weight);

    if (Number.isNaN(parsedHeight) || Number.isNaN(parsedWeight)) {
      Alert.alert("Hiba", "A magasságot és testsúlyt számként add meg (pl. 180, 75)");
      return;
    }

    try {
      // Clear previous plan and completion flags so login always starts fresh
      try {
        await AsyncStorage.removeItem('workoutPlan');
        await AsyncStorage.removeItem('userBmi');
        await AsyncStorage.removeItem('userCategory');
        // remove week/day completion flags
        for (let w = 1; w <= 8; w++) {
          await AsyncStorage.removeItem(`week${w}-done`);
          for (let d = 1; d <= 5; d++) {
            await AsyncStorage.removeItem(`week${w}-day${d}-done`);
          }
        }
      } catch (e) {
        console.warn('Error clearing storage on login:', e);
      }

      console.log('Login: sending generateWorkoutPlan', { parsedWeight, parsedHeight });
      const result = await generateWorkoutPlan(parsedWeight, parsedHeight);
      console.log('Login: received result from backend', result);

      if (result && result.plan) {
        await AsyncStorage.setItem("workoutPlan", JSON.stringify(result.plan));
      }
      if (result && result.bmi) {
        await AsyncStorage.setItem("userBmi", String(result.bmi));
        await AsyncStorage.setItem("userCategory", String(result.category || ""));
      }

      // Navigate only after successful generation
      router.replace(`/home?name=${encodeURIComponent(name)}`);
    } catch (error: any) {
      console.error("Error generating plan:", error);
      Alert.alert("Hiba", error?.message || "Nem sikerült kapcsolódni a szerverhez");
    }
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