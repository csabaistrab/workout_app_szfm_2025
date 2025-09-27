// app/home.tsx
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useState, useCallback, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Week } from './types';

export default function Home() {
  const router = useRouter();
  const { name } = useLocalSearchParams();
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [loading, setLoading] = useState(true);
  const [bmi, setBmi] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadWeekStatuses = async () => {
        try {
          setLoading(true);
          const weekNumbers = [1, 2, 3, 4, 5];
          const updatedWeeks = await Promise.all(
            weekNumbers.map(async (weekNum) => {
                  const isDone = await AsyncStorage.getItem(`week${weekNum}-done`);
              return { 
                id: weekNum, 
                    title: `${weekNum}. hét`, 
                done: isDone === 'true' 
              };
            })
          );
          setWeeks(updatedWeeks);
        } catch (error) {
          console.error('Error loading week statuses:', error);
        } finally {
          setLoading(false);
        }
      };

      loadWeekStatuses();
    }, [])
  );

  useEffect(() => {
    const loadBmi = async () => {
      try {
        const stored = await AsyncStorage.getItem('userBmi');
        if (stored) setBmi(stored);
      } catch (err) {
        console.error('Error loading BMI:', err);
      }
    };

    loadBmi();
  }, []);
if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <Text>Betöltés...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 24, marginBottom: 10, fontWeight: "bold" }}>
        Edzésprogram
      </Text>

      {name && (
        <Text style={{ fontSize: 16, marginBottom: 20, color: "#666" }}>
          Üdvözöllek, {name}!
        </Text>
      )}

      {bmi && (
        <Text style={{ fontSize: 16, marginBottom: 10, color: "#333" }}>
          Jelenlegi BMI: {bmi}
        </Text>
      )}

      <FlatList
        data={weeks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/week?weekId=${item.id}`)}
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
          {weeks.filter(w => w.done).length} / {weeks.length} hét teljesítve
        </Text>
      </View>
    </View>
  );
}
