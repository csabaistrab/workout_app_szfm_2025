// frontend/services/workoutService.ts
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use your PC LAN IP for physical devices. You provided: 192.168.56.1
const PC_HOST = '192.168.56.1';
// For emulator use 10.0.2.2, but physical devices should use PC_HOST
export const API_URL = `http://${PC_HOST}:3000/api`;

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