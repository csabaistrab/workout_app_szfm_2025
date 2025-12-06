import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import CustomButton from '../_components/ui/CustomButton';
import { useFocusEffect } from 'expo-router';
import { fetchWorkouts, generateWorkoutPlan } from '../../services/workoutService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WorkoutScreen() {
  const [workouts, setWorkouts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const load = async () => {
    setLoading(true);
    try {
      // Try to fetch workouts for week 1 as an example
      const res = await fetchWorkouts(1).catch(() => null);
      if (res && Array.isArray(res)) {
        setWorkouts(res);
        return;
      }

      // Fallback: read generated plan flag from AsyncStorage
      const plan = await AsyncStorage.getItem('generatedPlan');
      if (plan) {
        setWorkouts(JSON.parse(plan));
      } else {
        setWorkouts([]);
      }
    } catch (e) {
      console.warn('Failed to load workouts', e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(React.useCallback(() => { load(); }, []));

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Use basic weight/height from storage if available
      const weight = Number(await AsyncStorage.getItem('userWeight') || 70);
      const height = Number(await AsyncStorage.getItem('userHeight') || 170);
      const res = await generateWorkoutPlan(weight, height);
      // backend returns { bmi, plan }
      if (res?.plan) {
        await AsyncStorage.setItem('generatedPlan', JSON.stringify(res.plan));
        setWorkouts(res.plan);
      }
    } catch (e) {
      console.warn('Generate plan failed', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Workouts</Text>

      {workouts.length === 0 ? (
        <View style={styles.empty}> 
          <Text style={{ marginBottom: 12 }}>No workouts yet</Text>
          <CustomButton title="Generate plan" onPress={handleGenerate} loading={loading} />
        </View>
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={(item, idx) => item.id ?? idx.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemTitle}>{item.title || item.name || 'Workout'}</Text>
              <Text>{item.description ?? ''}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  empty: { alignItems: 'center', marginTop: 40 },
  item: { padding: 12, borderRadius: 8, backgroundColor: '#f6f6f6', marginBottom: 8 },
  itemTitle: { fontWeight: '600', marginBottom: 4 },
});