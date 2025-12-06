import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace this with your PC's LAN IP so physical devices can reach the backend.
// You provided: 192.168.56.1
const PC_HOST = '192.168.56.1';

// Notes:
// - Android emulators (older) use 10.0.2.2 to reach host localhost.
// - For physical devices, use your PC LAN IP (PC_HOST).
export const API_URL = `http://${PC_HOST}:3000/api`;

export async function register(data: {
  name: string;
  email: string;
  password: string;
  age: number;
  weight: number;
  height: number;
  fitnessLevel?: string;
  workoutPreferences?: any;
}) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Registration failed');
  }

  const body = await res.json();
  // store token + user
  if (body.token) await AsyncStorage.setItem('authToken', body.token);
  if (body.user) await AsyncStorage.setItem('user', JSON.stringify(body.user));
  // Compute and store BMI and category for frontend display
  try {
    const weight = Number(data.weight);
    const height = Number(data.height);
    if (!Number.isNaN(weight) && !Number.isNaN(height) && height > 0) {
      const bmi = +(weight / ((height / 100) * (height / 100))).toFixed(1);
      await AsyncStorage.setItem('userBmi', String(bmi));
      let category = 'normal';
      if (bmi < 18.5) category = 'underweight';
      else if (bmi < 25) category = 'normal';
      else if (bmi < 30) category = 'overweight';
      else category = 'obese';
      await AsyncStorage.setItem('userCategory', category);
    }
  } catch {
    // ignore
  }
  return body;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Login failed');
  }

  const body = await res.json();
  if (body.token) await AsyncStorage.setItem('authToken', body.token);
  if (body.user) await AsyncStorage.setItem('user', JSON.stringify(body.user));
  // Compute and store BMI and category
  try {
    const weight = Number(body.user?.weight ?? 0);
    const height = Number(body.user?.height ?? 0);
    if (!Number.isNaN(weight) && !Number.isNaN(height) && height > 0) {
      const bmi = +(weight / ((height / 100) * (height / 100))).toFixed(1);
      await AsyncStorage.setItem('userBmi', String(bmi));
      let category = 'normal';
      if (bmi < 18.5) category = 'underweight';
      else if (bmi < 25) category = 'normal';
      else if (bmi < 30) category = 'overweight';
      else category = 'obese';
      await AsyncStorage.setItem('userCategory', category);
    }
  } catch {
    // ignore
  }
  return body;
}

export async function logout() {
  await AsyncStorage.removeItem('authToken');
  await AsyncStorage.removeItem('user');
}
