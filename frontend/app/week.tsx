// app/week.tsx - egyszerűbb
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialDays = [
  { id: 1, title: "1. nap", done: false },
  { id: 2, title: "2. nap", done: false },
  { id: 3, title: "3. nap", done: false },
  { id: 4, title: "4. nap", done: false },
  { id: 5, title: "5. nap", done: false },
];

export default function Week() {
  const router = useRouter();
  const { weekId } = useLocalSearchParams();
  const [days, setDays] = useState(initialDays);

  // Mindig frissít amikor a képernyő aktívvá válik
  useFocusEffect(
    useCallback(() => {
      const loadDayStatuses = async () => {
        try {
          const updatedDays = await Promise.all(
            initialDays.map(async (day) => {
              const isDone = await AsyncStorage.getItem(`week${weekId}-day${day.id}-done`);
              return { ...day, done: isDone === 'true' };
            })
          );
          setDays(updatedDays);
        } catch (error) {
          console.error('Error loading day statuses:', error);
        }
      };

      loadDayStatuses();
    }, [weekId])
  );

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 24, marginBottom: 20, fontWeight: "bold" }}>
        {weekId}. hét napjai
      </Text>

      <FlatList
        data={days}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/day?dayId=${item.id}&weekId=${weekId}`)}
            style={{
              padding: 20,
              marginBottom: 10,
              backgroundColor: item.done ? "#4caf50" : "#2196f3",
              borderRadius: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, color: "#fff" }}>{item.title}</Text>
            <Text style={{ fontSize: 20 }}>{item.done ? "✅" : "⬜"}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={{ marginTop: 20, alignItems: "center" }}>
        <Text style={{ color: "#666" }}>
          {days.filter(d => d.done).length} / {days.length} nap teljesítve
        </Text>
      </View>
    </View>
  );
}