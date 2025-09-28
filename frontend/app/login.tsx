// app/login.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateWorkoutPlan } from "../services/workoutService";

export default function LoginScreen() {
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(false);
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

    if (parsedHeight < 100 || parsedHeight > 250) {
      Alert.alert("Hiba", "A magasságnak 100 és 250 cm között kell lennie");
      return;
    }

    if (parsedWeight < 30 || parsedWeight > 200) {
      Alert.alert("Hiba", "A testsúlynak 30 és 200 kg között kell lennie");
      return;
    }

    setLoading(true);

    try {
      // Clear previous data
      await clearPreviousData();

      console.log('Login: sending generateWorkoutPlan', { 
        weight: parsedWeight, 
        height: parsedHeight 
      });

      // Timeout hozzáadása a hálózati kéréshez
      const result = await Promise.race([
        generateWorkoutPlan(parsedWeight, parsedHeight),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Időtúllépés: a szerver nem válaszol")), 10000)
        )
      ]);

      console.log('Login: received result from backend', result);

      if (result && result.plan) {
        await AsyncStorage.setItem("workoutPlan", JSON.stringify(result.plan));
        await AsyncStorage.setItem("userBmi", String(result.bmi || ""));
        await AsyncStorage.setItem("userCategory", String(result.category || ""));
        
        // Sikeres bejelentkezés
        router.replace(`/home?name=${encodeURIComponent(name)}`);
      } else {
        throw new Error("Érvénytelen válasz a szervertől");
      }

    } catch (error: any) {
      console.error("Error generating plan:", error);
      
      let errorMessage = "Nem sikerült kapcsolódni a szerverhez";
      
      if (error.message.includes("Network request failed")) {
        errorMessage = "Hálózati hiba: Ellenőrizd az internetkapcsolatot";
      } else if (error.message.includes("Időtúllépés")) {
        errorMessage = error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Hiba", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearPreviousData = async () => {
    try {
      await AsyncStorage.multiRemove([
        'workoutPlan',
        'userBmi', 
        'userCategory'
      ]);
      
      // Töröljük a completion flag-eket
      const keysToRemove = [];
      for (let w = 1; w <= 8; w++) {
        keysToRemove.push(`week${w}-done`);
        for (let d = 1; d <= 5; d++) {
          keysToRemove.push(`week${w}-day${d}-done`);
        }
      }
      
      await AsyncStorage.multiRemove(keysToRemove);
    } catch (e) {
      console.warn('Error clearing storage:', e);
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
          editable={!loading}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Magasság (cm)</Text>
        <TextInput
          style={styles.input}
          placeholder="pl. 180"
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
          editable={!loading}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Testsúly (kg)</Text>
        <TextInput
          style={styles.input}
          placeholder="pl. 75"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
          editable={!loading}
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Belépés</Text>
        )}
      </TouchableOpacity>

      {loading && (
        <Text style={styles.loadingText}>
          Edzésterv generálása...
        </Text>
      )}
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
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 14,
  },
});