import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';
import ProfileHeader from '../_components/profile/ProfileHeader';
import StatsCard from '../_components/profile/StatsCard';
import CustomButton from '../_components/ui/CustomButton';
import { getUserKey } from '../../services/storageKeys';

export default function ProfileScreen(): React.ReactElement {
  const router = useRouter();
  const [user, setUser] = React.useState<any>(null);
  const [userName, setUserName] = React.useState<string | null>(null);
  const [bmi, setBmi] = React.useState<number>(0);
  const [workoutsCompleted, setWorkoutsCompleted] = React.useState<number>(0);
  const [currentWeek, setCurrentWeek] = React.useState<number>(1);
  const [loading, setLoading] = React.useState<boolean>(true);

  const loadProfile = React.useCallback(async () => {
    setLoading(true);
    try {
      const raw = await AsyncStorage.getItem('user');
      const parsed = raw ? JSON.parse(raw) : null;
      setUser(parsed);

      const storedName = await AsyncStorage.getItem('userName');
      setUserName(storedName);

      const storedBmi = await AsyncStorage.getItem('userBmi');
      setBmi(storedBmi ? Number(storedBmi) : 0);

      // Count completed days across a simple 5x5 plan (weeks 1..5, days 1..5)
      const weeks = [1, 2, 3, 4, 5];
      const days = [1, 2, 3, 4, 5];
      let dayCount = 0;
      const weekDoneFlags: boolean[] = [];

      for (const w of weeks) {
        for (const d of days) {
          const key = await getUserKey(`week${w}-day${d}-done`);
          const v = await AsyncStorage.getItem(key);
          if (v === 'true') dayCount++;
        }
        const weekKey = await getUserKey(`week${w}-done`);
        const wk = await AsyncStorage.getItem(weekKey);
        weekDoneFlags.push(wk === 'true');
      }

      setWorkoutsCompleted(dayCount);
      const firstNotDoneIndex = weekDoneFlags.findIndex(done => !done);
      const cw = firstNotDoneIndex === -1 ? weeks[weeks.length - 1] : weeks[firstNotDoneIndex];
      setCurrentWeek(cw);
    } catch (e) {
      console.warn('Failed to load profile data', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('userName');
      await AsyncStorage.removeItem('isGuest');
    } catch (e) {
      console.warn('Failed to clear storage on logout', e);
    }
    router.replace('/login');
  };

  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Betöltés...</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
        <ProfileHeader 
          name={user?.name ?? userName ?? 'Felhasználó'}
          age={user?.age ?? 0}
          weight={user?.weight ?? 0}
          height={user?.height ?? 0}
        />

        <StatsCard 
          bmi={bmi}
          workoutsCompleted={workoutsCompleted}
          currentWeek={currentWeek}
        />
      </ScrollView>

      <View style={styles.footer}>
        <CustomButton title="Edit profile" onPress={() => router.push('/profile/edit')} style={{ marginBottom: 8 }} />
        <CustomButton title="Log out" onPress={handleLogout} variant="secondary" style={styles.logoutButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    padding: 20,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    paddingHorizontal: 20,
  },
  logoutButton: {
    width: '100%',
  },
});