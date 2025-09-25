// app/home.tsx
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const weeks = [
  { id: 1, title: "1. hét", done: true },
  { id: 2, title: "2. hét", done: false },
  { id: 3, title: "3. hét", done: false },
  { id: 4, title: "4. hét", done: false },
  { id: 5, title: "5. hét", done: false },
];

export default function Home() {
  const router = useRouter();
  const { name } = useLocalSearchParams(); // Név átvéve a paraméterből

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

      <FlatList
        data={weeks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/week?weekId=${item.id}`)}
            style={{
              padding: 20,
              marginBottom: 10,
              backgroundColor: "#2196f3",
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
    </View>
  );
}