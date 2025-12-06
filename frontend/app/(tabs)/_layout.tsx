// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

import CustomTabBar from '@/components/custom-tab-bar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...(props as any)} />}
      screenOptions={{
        // set active/inactive tint globally so tabBarIcon receives correct color
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        headerShown: false,
        tabBarShowLabel: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={focused ? 34 : 28} name="house.fill" color={color} />
          ),
        }}
      />
      {/* Explore tab removed — not used in this app */}
      <Tabs.Screen
        name="plan"
        options={{
          title: 'Plan',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={focused ? 34 : 28} name="list.bullet" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Workout',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={focused ? 30 : 28} name="dumbbell.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={focused ? 34 : 28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}