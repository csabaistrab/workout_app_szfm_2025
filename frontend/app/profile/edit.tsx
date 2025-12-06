import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InputField from '../_components/ui/InputField';
import CustomButton from '../_components/ui/CustomButton';
import { API_URL } from '../../services/authService';

export default function ProfileEdit() {
  const router = useRouter();
  const [name, setName] = React.useState('');
  const [age, setAge] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [height, setHeight] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('user');
        const u = raw ? JSON.parse(raw) : null;
        if (u) {
          setName(u.name || '');
          setAge(u.age ? String(u.age) : '');
          setWeight(u.weight ? String(u.weight) : '');
          setHeight(u.height ? String(u.height) : '');
        }
      } catch (e) {
        console.warn('Failed to load user for edit', e);
      }
    })();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const body: any = {};
      if (name) body.name = name;
      if (age) body.age = Number(age);
      if (weight) body.weight = Number(weight);
      if (height) body.height = Number(height);
      // send to backend if token present
      let updatedUser = null;
      if (token) {
        const res = await fetch(`${API_URL}/auth/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(body)
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Failed to update profile');
        }
        const json = await res.json();
        updatedUser = json.user;
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        if (updatedUser.name) {
          await AsyncStorage.setItem('userName', updatedUser.name);
        }
      } else {
        // offline / guest: update local storage only
        const raw = await AsyncStorage.getItem('user');
        const u = raw ? JSON.parse(raw) : {};
        const merged = { ...u, name: body.name ?? u.name, age: body.age ?? u.age, weight: body.weight ?? u.weight, height: body.height ?? u.height };
        updatedUser = merged;
        await AsyncStorage.setItem('user', JSON.stringify(merged));
        if (merged.name) {
          await AsyncStorage.setItem('userName', merged.name);
        }
      }

      // recompute BMI and store
      try {
        const w = Number(updatedUser.weight || weight || 0);
        const h = Number(updatedUser.height || height || 0);
        if (w && h) {
          const bmi = +(w / ((h / 100) * (h / 100))).toFixed(1);
          await AsyncStorage.setItem('userBmi', String(bmi));
          let category = 'normal';
          if (bmi < 18.5) category = 'underweight';
          else if (bmi < 25) category = 'normal';
          else if (bmi < 30) category = 'overweight';
          else category = 'obese';
          await AsyncStorage.setItem('userCategory', category);
        }
      } catch (e) {
        // ignore
      }

      Alert.alert('Siker', 'Profil mentve');
      router.back();
    } catch (e: any) {
      console.error('Profile save error', e);
      Alert.alert('Hiba', e?.message || 'Nem sikerült menteni');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Edit Profile</Text>

      <InputField label="Name" placeholder="Name" value={name} onChangeText={setName} />
      <InputField label="Age" placeholder="Age" value={age} onChangeText={setAge} keyboardType="numeric" />
      <InputField label="Weight (kg)" placeholder="Weight" value={weight} onChangeText={setWeight} keyboardType="numeric" />
      <InputField label="Height (cm)" placeholder="Height" value={height} onChangeText={setHeight} keyboardType="numeric" />

      <View style={{ marginTop: 16 }}>
        <CustomButton title="Save" onPress={handleSave} loading={loading} />
        <CustomButton title="Cancel" onPress={() => router.back()} variant="secondary" style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
});
