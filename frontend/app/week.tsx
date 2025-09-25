import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const days = [
  { id: 1, title: "1. nap" },
  { id: 2, title: "2. nap" },
  { id: 3, title: "3. nap" },
  { id: 4, title: "4. nap" },
  { id: 5, title: "5. nap" },
];

export default function Week() {
  const router = useRouter();
  const { weekId } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 24, marginBottom: 20, fontWeight: "bold" }}>
        {weekId}. hét - Napok
      </Text>

      <FlatList
        data={days}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/day?dayId=${item.id}`)}
            style={{
              padding: 20,
              marginBottom: 10,
              backgroundColor: "#2196f3",
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
