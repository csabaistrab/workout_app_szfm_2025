// app/_layout.tsx
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ title: "Főoldal" }} />
      <Stack.Screen name="week" options={{ title: "Hét" }} />
      <Stack.Screen name="day" options={{ title: "Nap" }} />
    </Stack>
  );
}