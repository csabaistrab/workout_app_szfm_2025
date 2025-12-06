import { View, ScrollView, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PlanGenerator from '../_components/plan/PlanGenerator';
import WeekCard from '../_components/plan/WeekCard';
import { generateWorkoutPlan } from '../../services/workoutService';
import { getUserKey } from '../../services/storageKeys';

export default function PlanScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [weeks, setWeeks] = useState<{ number: number; completed: boolean }[]>([]);

  // Load week completion status from storage
  const loadWeeks = useCallback(async () => {
    const weekData = await Promise.all(
      Array.from({ length: 8 }, (_, i) => i + 1).map(async (num) => {
        const key = await getUserKey(`week${num}-done`);
        const isDone = await AsyncStorage.getItem(key);
        return { number: num, completed: isDone === 'true' };
      })
    );
    setWeeks(weekData);
  }, []);

  useEffect(() => {
    loadWeeks();
  }, [loadWeeks]);

  const handleGenerateAI = async () => {
    setLoading(true);
    try {
      // Get user data from storage
      const userRaw = await AsyncStorage.getItem('user');
      const user = userRaw ? JSON.parse(userRaw) : null;
      
      const weight = user?.weight || 70;
      const height = user?.height || 175;
      
      console.log('Generating AI plan with:', { weight, height });
      
      const res = await generateWorkoutPlan(weight, height);
      console.log('AI Plan generated:', res);
      console.log('AI Raw text:', res.aiRaw);
      console.log('AI Raw length:', res.aiRaw?.length);
      
      if (res?.plan && Array.isArray(res.plan)) {
        await AsyncStorage.setItem('generatedPlan', JSON.stringify(res.plan));
        
        // Store AI text if available
        if (res.aiRaw) {
          await AsyncStorage.setItem('aiPlanText', res.aiRaw);
        }
        
        Alert.alert('Siker! 🎉', `Új edzésterv generálva!\n\nBMI: ${res.bmi}\nKategória: ${res.category}`, [
          { text: 'Megnézem', onPress: () => router.push('/(tabs)/workout') }
        ]);
      } else {
        Alert.alert('Hiba', 'Nem sikerült tervet generálni');
      }
    } catch (e: any) {
      console.error('Generate plan failed', e);
      Alert.alert('Hiba', e?.message || 'Nem sikerült tervet generálni');
    } finally {
      setLoading(false);
    }
  };

  const handleGetStaticPlan = async () => {
    // Navigate to workout tab to show existing plan
    router.push('/(tabs)/workout');
  };

  const handleWeekPress = (weekNumber: number) => {
    router.push(`/week?week=${weekNumber}`);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 12, fontSize: 16 }}>🤖 AI terv generálása...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <PlanGenerator 
        onGenerateAI={handleGenerateAI}
        onGetStaticPlan={handleGetStaticPlan}
      />
      
      <View style={styles.weeksSection}>
        <Text style={styles.sectionTitle}>Edzéstervem</Text>
        {weeks.map(week => (
          <WeekCard
            key={week.number}
            weekNumber={week.number}
            isCompleted={week.completed}
            onPress={() => handleWeekPress(week.number)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  weeksSection: {
    marginTop: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 16,
    color: '#333',
  },
});