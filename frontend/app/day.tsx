// app/day.tsx
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWorkouts, updateWorkout } from "../services/workoutService";
import { getUserKey } from '../services/storageKeys';

export default function Day() {
  const { dayId, weekId } = useLocalSearchParams();
  const router = useRouter();

  const [tasks, setTasks] = useState<{ id: string | number; title: string; done: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const allDone = tasks.length > 0 && tasks.every(task => task.done);

  // Persist day completion when all tasks done
  useEffect(() => {
    const saveDayCompletion = async () => {
      if (allDone) {
        try {
          const dayKey = await getUserKey(`week${weekId}-day${dayId}-done`);
          await AsyncStorage.setItem(dayKey, 'true');

          // Check all days for week
          const daysStatus = await Promise.all(
            [1, 2, 3, 4, 5].map(async (dayNum) => {
              const key = await getUserKey(`week${weekId}-day${dayNum}-done`);
              const isDone = await AsyncStorage.getItem(key);
              return isDone === 'true';
            })
          );

          if (daysStatus.every(Boolean)) {
            const weekKey = await getUserKey(`week${weekId}-done`);
            await AsyncStorage.setItem(weekKey, 'true');
          }
        } catch (err) {
          console.error('Error saving completion:', err);
        }
      }
    };

    saveDayCompletion();
  }, [allDone, dayId, weekId]);

  // Fetch the tasks for this week/day from backend or AsyncStorage
  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const weekNum = Number(weekId);
      const dayNum = Number(dayId);
      
      // First try to load from AsyncStorage (generated plan)
      const planRaw = await AsyncStorage.getItem('generatedPlan');
      if (planRaw) {
        const plan = JSON.parse(planRaw);
        // Filter tasks for this week and day
        const filtered = plan.filter((t: any) => t.week === weekNum && t.day === dayNum);
        
        if (filtered.length > 0) {
          const mapped = filtered.map((t: any, idx: number) => ({
            id: t.id || t._id || String(idx + 1),
            title: t.description || `Feladat ${t.taskNumber || idx + 1}`,
            done: false, // Will load from user-specific storage below
          }));
          
          // Load completion status from user-specific storage
          const withStatus = await Promise.all(mapped.map(async (task) => {
            const key = await getUserKey(`task-${weekNum}-${dayNum}-${task.id}`);
            const isDone = await AsyncStorage.getItem(key);
            return { ...task, done: isDone === 'true' };
          }));
          
          setTasks(withStatus);
          setLoading(false);
          return;
        }
      }
      
      // Fallback: try backend
      const data = await fetchWorkouts(weekNum, dayNum);
      console.log('loadTasks: backend data', data);
      
      const mapped = data.map((t: any, idx: number) => ({
        id: t.id ? String(t.id) : (t._id ? String(t._id) : String(idx + 1)),
        title: t.description || `Feladat ${t.taskNumber || idx + 1}`,
        done: !!t.completed,
      }));

      setTasks(mapped);
    } catch (err: any) {
      console.error('Error loading tasks:', err);
      setError(err?.message || 'Nincs elérhető feladat erre a napra');
    } finally {
      setLoading(false);
    }
  }, [weekId, dayId]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // If all tasks done, show a success then navigate back
  useEffect(() => {
    if (allDone) {
      const timer = setTimeout(() => {
        alert(`🎉 ${dayId}. nap teljesítve! Gratulálok!`);
        router.back();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [allDone, router, dayId]);

  const toggleTask = async (taskId: string | number) => {
    if (allDone) {
      alert("Ez a nap már teljesítve van! A feladatokat nem lehet módosítani.");
      return;
    }

    // Optimistic update
    const prev = tasks;
    const updated = tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t);
    setTasks(updated);

    try {
      const task = updated.find(t => t.id === taskId);
      if (task) {
        // Save to user-specific AsyncStorage
        const weekNum = Number(weekId);
        const dayNum = Number(dayId);
        const key = await getUserKey(`task-${weekNum}-${dayNum}-${task.id}`);
        await AsyncStorage.setItem(key, task.done ? 'true' : 'false');
        console.log('Task status saved:', key, task.done);
      }
    } catch (err) {
      console.error('Error saving task status:', err);
      setTasks(prev);
      Alert.alert('Hiba', 'Nem sikerült menteni a feladat állapotát');
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>✅ {dayId}. nap feladatai</Text>

      {allDone && (
        <View style={{
          backgroundColor: "#4caf50",
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
        }}>
          <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>
            ✅ Ez a nap teljesítve! Gratulálok! 🎉
          </Text>
        </View>
      )}

      {loading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2196f3" />
          <Text style={{ marginTop: 10 }}>Betöltés...</Text>
        </View>
      )}

      {error && (
        <View style={{ padding: 10, backgroundColor: '#ffdddd', borderRadius: 8, marginBottom: 10 }}>
          <Text style={{ color: '#900' }}>{error}</Text>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => toggleTask(item.id)}
              style={{
                padding: 20,
                marginBottom: 10,
                backgroundColor: item.done ? "#4caf50" : "#f44336",
                borderRadius: 10,
                opacity: allDone ? 0.7 : 1,
              }}
              disabled={allDone}
            >
              <Text style={{ fontSize: 18, color: "#fff" }}>
                {item.done ? "✅ " : "⬜ "} {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {allDone && (
        <Text style={{ textAlign: "center", marginTop: 20, color: "#4caf50", fontWeight: "bold" }}>
          ✅ Minden feladat teljesítve! Visszatérés...
        </Text>
      )}

      <Text style={{ 
        marginTop: 20, 
        textAlign: "center", 
        color: "#666",
        fontSize: 14 
      }}>
        {tasks.filter(t => t.done).length} / {tasks.length} feladat teljesítve
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});