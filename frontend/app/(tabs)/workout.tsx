import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, Alert } from 'react-native';
import CustomButton from '../_components/ui/CustomButton';
import { useFocusEffect, useRouter } from 'expo-router';
import { fetchWorkouts, generateWorkoutPlan } from '../../services/workoutService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WorkoutScreen() {
  const router = useRouter();
  const [workouts, setWorkouts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [aiPlan, setAiPlan] = React.useState<string | null>(null);
  const [hasPlan, setHasPlan] = React.useState(false);

  const load = async () => {
    setLoading(true);
    try {
      // Try to fetch workouts from backend (week 1 as sample)
      const res = await fetchWorkouts(1).catch(() => null);
      if (res && Array.isArray(res) && res.length > 0) {
        setWorkouts(res);
        setHasPlan(true);
        
        // Check if we have stored AI plan text
        const storedAI = await AsyncStorage.getItem('aiPlanText');
        console.log('Stored AI plan text:', storedAI?.substring(0, 100));
        if (storedAI) setAiPlan(storedAI);
        
        setLoading(false);
        return;
      }

      // No workouts found - check if plan was generated before
      setWorkouts([]);
      setHasPlan(false);
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
      // Get user data from storage
      const userRaw = await AsyncStorage.getItem('user');
      const user = userRaw ? JSON.parse(userRaw) : null;
      
      const weight = user?.weight || 70;
      const height = user?.height || 175;
      const age = user?.age || 25;
      const fitnessLevel = user?.fitnessLevel || 'beginner';
      
      console.log('Generating AI plan with:', { weight, height, age, fitnessLevel });
      
      const res = await generateWorkoutPlan(weight, height);
      console.log('AI Plan generated:', res);
      
      // backend returns { bmi, category, plan, aiRaw }
      if (res?.plan && Array.isArray(res.plan)) {
        await AsyncStorage.setItem('generatedPlan', JSON.stringify(res.plan));
        setWorkouts(res.plan);
        setHasPlan(true);
        
        // Store AI text if available
        if (res.aiRaw) {
          await AsyncStorage.setItem('aiPlanText', res.aiRaw);
          setAiPlan(res.aiRaw);
        }
        
        Alert.alert('Siker', `Új edzésterv generálva! BMI: ${res.bmi}, Kategória: ${res.category}`);
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

  return (
    <ScrollView style={styles.wrapper} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>🏋️ Edzésterv</Text>

      {!hasPlan ? (
        <View style={styles.empty}>
          <Text style={styles.subtitle}>Még nincs generált edzésterved</Text>
          <Text style={{ marginBottom: 20, textAlign: 'center', color: '#666' }}>
            Generálj egy személyre szabott AI edzéstervet a profilod alapján!
          </Text>
          <CustomButton 
            title="🤖 AI Terv Generálása" 
            onPress={handleGenerate} 
            loading={loading} 
          />
        </View>
      ) : (
        <>
          {/* AI Generated Plan Text */}
          {aiPlan && (
            <View style={styles.aiSection}>
              <Text style={styles.aiTitle}>🤖 AI Javaslat</Text>
              <ScrollView 
                style={styles.aiTextContainer}
                nestedScrollEnabled={true}
              >
                <Text style={styles.aiText}>{aiPlan}</Text>
              </ScrollView>
            </View>
          )}

          {/* Workout List */}
          <View style={styles.workoutList}>
            <Text style={styles.sectionTitle}>
              📋 Feladatok (1. hét példa)
            </Text>
            {workouts.length > 0 ? (
              <FlatList
                data={workouts.slice(0, 10)} 
                scrollEnabled={false}
                keyExtractor={(item, idx) => item.id ?? idx.toString()}
                renderItem={({ item }) => (
                  <View style={styles.item}>
                    <Text style={styles.itemTitle}>
                      {item.taskNumber ? `${item.taskNumber}. ` : ''}
                      {item.description || item.title || 'Feladat'}
                    </Text>
                    <Text style={styles.itemMeta}>
                      {item.week ? `Hét: ${item.week}` : ''} 
                      {item.day ? `, Nap: ${item.day}` : ''}
                    </Text>
                  </View>
                )}
              />
            ) : (
              <Text style={{ textAlign: 'center', color: '#999', marginTop: 10 }}>
                Nincs feladat betöltve
              </Text>
            )}
          </View>

          <CustomButton 
            title="🔄 Új Terv Generálása" 
            onPress={handleGenerate} 
            loading={loading}
            variant="secondary"
            style={{ marginTop: 20 }}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8, paddingHorizontal: 20, paddingTop: 20 },
  subtitle: { fontSize: 18, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
  empty: { alignItems: 'center', marginTop: 60, paddingHorizontal: 20 },
  aiSection: { 
    marginHorizontal: 20, 
    marginTop: 12,
    padding: 16, 
    backgroundColor: '#E8F5E9', 
    borderRadius: 12,
    marginBottom: 20
  },
  aiTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8, color: '#2E7D32' },
  aiTextContainer: { maxHeight: 200 },
  aiText: { fontSize: 14, lineHeight: 20, color: '#333' },
  workoutList: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  item: { 
    padding: 14, 
    borderRadius: 8, 
    backgroundColor: '#F5F5F5', 
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3'
  },
  itemTitle: { fontWeight: '600', marginBottom: 4, fontSize: 15 },
  itemMeta: { fontSize: 12, color: '#666' },
});