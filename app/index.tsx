import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";

const weeks = [
  { id: 1, title: "1. hét", unlocked: true },
  { id: 2, title: "2. hét", unlocked: false },
];

export default function Home() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 24, marginBottom: 20, fontWeight: "bold" }}>
        Elérhető hetek
      </Text>

      <FlatList
        data={weeks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              item.unlocked && router.push(`/week?weekId=${item.id}`)
            }
            style={{
              padding: 20,
              marginBottom: 10,
              backgroundColor: item.unlocked ? "#4caf50" : "#ccc",
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 18, color: "#fff" }}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
