import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Choose host depending on platform:
// - On web (localhost dev server) use localhost
// - On devices/emulator use the machine LAN IP that Metro reported
const DEFAULT_LAN_IP = '192.168.31.150';
const PC_HOST = Platform.OS === 'web' ? 'localhost' : DEFAULT_LAN_IP;

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
    const text = await res.text().catch(() => '');
    console.error('Register failed status', res.status, 'body:', text);
    const err = (() => {
      try { return JSON.parse(text); } catch { return { message: text || 'Registration failed' }; }
    })();
    throw new Error(err.message || 'Registration failed');
  }

  const bodyText = await res.text().catch(() => '');
  const body = (() => { try { return JSON.parse(bodyText); } catch { return bodyText || {}; } })();
  console.log('authService.register response', body);
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
    const text = await res.text().catch(() => '');
    console.error('Login failed status', res.status, 'body:', text);
    const err = (() => {
      try { return JSON.parse(text); } catch { return { message: text || 'Login failed' }; }
    })();
    throw new Error(err.message || 'Login failed');
  }

  const bodyText = await res.text().catch(() => '');
  const body = (() => { try { return JSON.parse(bodyText); } catch { return bodyText || {}; } })();
  console.log('authService.login response', body);
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
