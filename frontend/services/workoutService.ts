// frontend/services/workoutService.ts
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Pick a sensible default depending on runtime.
// - Android emulators need 10.0.2.2 to reach host machine's localhost
// - iOS simulator and web can use localhost
// - Real devices should replace with PC LAN IP (e.g. http://192.168.1.100:3000/api)
export const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';

async function getAuthHeaders() {
  const token = await AsyncStorage.getItem('authToken');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export async function generateWorkoutPlan(weight: number, height: number) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/workouts/generate`, {
    method: "POST",
    headers,
    body: JSON.stringify({ weight, height }),
  });

  if (!res.ok) throw new Error("Failed to fetch workout plan");

  return res.json(); // backend returns { bmi, plan }
}

export async function fetchWorkouts(week: number, day?: number) {
  const url = `${API_URL}/workouts?week=${week}${day ? `&day=${day}` : ""}`;
  const headers = await getAuthHeaders();
  const res = await fetch(url, { headers });

  if (!res.ok) throw new Error("Failed to fetch workouts");

  return res.json(); // returns array of tasks
}

export async function updateWorkout(id: string, update: object) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/workouts/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(update),
  });

  if (!res.ok) throw new Error('Failed to update workout');
  return res.json();
}