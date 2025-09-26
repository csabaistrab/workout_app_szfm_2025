// app/day.tsx
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Day() {
  const { dayId, weekId } = useLocalSearchParams();
  const router = useRouter();

  const [tasks, setTasks] = useState([
    { id: 1, title: "20 fekvőtámasz", done: false },
    { id: 2, title: "15 guggolás", done: false },
    { id: 3, title: "10 felülés", done: false },
    { id: 4, title: "30 mp plank", done: false },
    { id: 5, title: "5 burpee", done: false },
  ]);

  const allDone = tasks.every(task => task.done);

  // Amikor minden feladat kész, mentjük hogy ez a nap kész
  useEffect(() => {
    const saveDayCompletion = async () => {
      if (allDone) {
        try {
          await AsyncStorage.setItem(`week${weekId}-day${dayId}-done`, 'true');
        } catch (error) {
          console.error('Error saving day completion:', error);
        }
      }
    };

    saveDayCompletion();
  }, [allDone, dayId, weekId]);

  // Visszatérés a napok listájára
  useEffect(() => {
    if (allDone) {
      const timer = setTimeout(() => {
        alert(`🎉 ${dayId}. nap teljesítve! Gratulálok!`);
        router.back();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [allDone, router, dayId]);

  const toggleTask = (taskId: number) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, done: !t.done } : t
    ));
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 24, marginBottom: 20, fontWeight: "bold" }}>
        {dayId}. nap feladatai
      </Text>

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
            }}
          >
            <Text style={{ fontSize: 18, color: "#fff" }}>
              {item.done ? "✅ " : "⬜ "} {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />

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