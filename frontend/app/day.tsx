import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";

const tasks = [
  { id: 1, title: "20 fekvőtámasz" },
  { id: 2, title: "30 guggolás" },
  { id: 3, title: "15 felülés" },
  { id: 4, title: "10 burpee" },
  { id: 5, title: "1 km futás" },
];

export default function Day() {
  const { dayId } = useLocalSearchParams();
  const [completed, setCompleted] = useState<number[]>([]);

  const toggleTask = (id: number) => {
    setCompleted((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 24, marginBottom: 20, fontWeight: "bold" }}>
        {dayId}. nap - Feladatok
      </Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleTask(item.id)}
            style={{
              padding: 15,
              marginBottom: 10,
              borderRadius: 10,
              backgroundColor: completed.includes(item.id)
                ? "#4caf50"
                : "#f44336",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18 }}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
