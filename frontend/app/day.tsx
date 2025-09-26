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
          
          // Ellenőrizzük, hogy az összes nap kész van-e
          const allDaysDone = await checkIfAllDaysDone();
          if (allDaysDone) {
            await AsyncStorage.setItem(`week${weekId}-done`, 'true');
          }
        } catch (error) {
          console.error('Error saving completion:', error);
        }
      }
    };

    const checkIfAllDaysDone = async () => {
      try {
        const daysStatus = await Promise.all(
          [1, 2, 3, 4, 5].map(async (dayNum) => {
            const isDone = await AsyncStorage.getItem(`week${weekId}-day${dayNum}-done`);
            return isDone === 'true';
          })
        );
        return daysStatus.every(status => status);
      } catch (error) {
        return false;
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
    // HA MÁR MINDEN FELADAT KÉSZ, AKKOR NE LEHESSEN VISSZAVONNI
    if (allDone) {
      alert("Ez a nap már teljesítve van! A feladatokat nem lehet módosítani.");
      return;
    }
    
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, done: !t.done } : t
    ));
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
              opacity: allDone ? 0.7 : 1, // Halványabb ha kész
            }}
            disabled={allDone} // Letiltjuk ha kész
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