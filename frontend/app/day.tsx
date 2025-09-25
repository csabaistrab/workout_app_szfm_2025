import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

export default function Day() {
  const { dayId } = useLocalSearchParams();

  const [tasks, setTasks] = useState([
    { id: 1, title: "20 fekvőtámasz", done: false },
    { id: 2, title: "15 guggolás", done: false },
    { id: 3, title: "10 felülés", done: false },
    { id: 4, title: "30 mp plank", done: false },
    { id: 5, title: "5 burpee", done: false },
  ]);

  const toggleTask = (taskId: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, done: !t.done } : t
      )
    );
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
    </View>
  );
}
