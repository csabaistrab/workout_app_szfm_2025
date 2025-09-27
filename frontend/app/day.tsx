// app/day.tsx
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchWorkouts, updateWorkout } from "../services/workoutService";

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
          await AsyncStorage.setItem(`week${weekId}-day${dayId}-done`, 'true');

          // Check all days for week
          const daysStatus = await Promise.all(
            [1, 2, 3, 4, 5].map(async (dayNum) => {
              const isDone = await AsyncStorage.getItem(`week${weekId}-day${dayNum}-done`);
              return isDone === 'true';
            })
          );

          if (daysStatus.every(Boolean)) {
            await AsyncStorage.setItem(`week${weekId}-done`, 'true');
          }
        } catch (err) {
          console.error('Error saving completion:', err);
        }
      }
    };

    saveDayCompletion();
  }, [allDone, dayId, weekId]);

  // Fetch the tasks for this week/day from backend
  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const weekNum = Number(weekId);
      const dayNum = Number(dayId);
      const data = await fetchWorkouts(weekNum, dayNum);

      console.log('loadTasks: backend data', data);
      const mapped = data.map((t: any, idx: number) => ({
        // backend transforms _id -> id in toJSON; prefer t.id then t._id
        id: t.id ? String(t.id) : (t._id ? String(t._id) : String(idx + 1)),
        title: t.description || `Feladat ${t.taskNumber || idx + 1}`,
        done: !!t.completed,
      }));

      setTasks(mapped);
    } catch (err: any) {
      console.error('Error loading tasks:', err);
      setError(err?.message || 'Hiba a feladatok betöltésekor');
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
    // Debug
    console.log('toggleTask pressed', { taskId, prev, updated });

    // If taskId looks like a MongoDB ObjectId (24 hex chars), persist change
    try {
      const task = updated.find(t => t.id === taskId);
      const idStr = task ? String(task.id) : null;
      if (task && idStr) {
        console.log('Sending updateWorkout for', idStr, 'completed=', task.done);
        const res = await updateWorkout(idStr, { completed: task.done });
        console.log('updateWorkout response', res);
        // re-load tasks to reflect DB state (and id may have changed shape)
        await loadTasks();
      } else {
        console.log('No backend id present, skipping network update for', idStr);
      }
    } catch (err) {
      console.error('Error updating task on server, reverting UI:', err);
      // revert
      setTasks(prev);
      Alert.alert('Hiba', 'Nem sikerült menteni a feladat állapotát');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 24, marginBottom: 20, fontWeight: "bold" }}>
        {dayId}. nap feladatai
        {allDone && " ✅"}
      </Text>

      {allDone && (
        <View style={{
          backgroundColor: "#4caf50",
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
        }}>
          <Text style={{ color: "#fff", fontSize: 16, textAlign: "center" }}>
            ✅ Ez a nap teljesítve van! A feladatokat nem lehet módosítani.
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