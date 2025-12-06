// app/week.tsx
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Day } from './types';
import { getUserKey } from '../services/storageKeys';

export default function Week() {
  const router = useRouter();
  const { weekId } = useLocalSearchParams();
  const [days, setDays] = useState<Day[]>([]);
  const [weekDone, setWeekDone] = useState(false);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const loadStatuses = async () => {
        try {
          setLoading(true);
          
          const dayNumbers = [1, 2, 3, 4, 5];
          const updatedDays = await Promise.all(
            dayNumbers.map(async (dayNum) => {
              const key = await getUserKey(`week${weekId}-day${dayNum}-done`);
              const isDone = await AsyncStorage.getItem(key);
              return { 
                id: dayNum, 
                title: `${dayNum}. nap`, 
                done: isDone === 'true' 
              };
            })
          );
          setDays(updatedDays);

          const weekKey = await getUserKey(`week${weekId}-done`);
          const isWeekDone = await AsyncStorage.getItem(weekKey);
          setWeekDone(isWeekDone === 'true');

          const allDaysDone = updatedDays.every(day => day.done);
          if (allDaysDone && isWeekDone !== 'true') {
            await AsyncStorage.setItem(weekKey, 'true');
            setWeekDone(true);
          }

        } catch (error) {
          console.error('Error loading statuses:', error);
        } finally {
          setLoading(false);
        }
      };

      loadStatuses();
    }, [weekId])
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <Text>Betöltés...</Text>
      </View>
    );
  }

  const allDaysDone = days.every(day => day.done);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 24, marginBottom: 10, fontWeight: "bold" }}>
        {weekId}. hét napjai
        {weekDone && " ✅"}
      </Text>

      {weekDone && (
        <Text style={{ fontSize: 16, color: "#4caf50", marginBottom: 20, fontWeight: "bold" }}>
          ✅ Ez a hét teljesítve van!
        </Text>
      )}

      <FlatList
        data={days}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              if (weekDone) {
                alert("Ez a hét már teljesítve van!");
                return;
              }
              router.push(`/day?dayId=${item.id}&weekId=${weekId}`);
            }}
            style={{
              padding: 20,
              marginBottom: 10,
              backgroundColor: item.done ? "#4caf50" : "#2196f3",
              borderRadius: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              opacity: weekDone ? 0.7 : 1,
            }}
          >
            <Text style={{ fontSize: 18, color: "#fff" }}>{item.title}</Text>
            <Text style={{ fontSize: 20 }}>{item.done ? "✅" : "⬜"}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={{ marginTop: 20, alignItems: "center" }}>
        <Text style={{ color: "#666", marginBottom: 10 }}>
          {days.filter(d => d.done).length} / {days.length} nap teljesítve
        </Text>
      </View>
    </View>
  );
}