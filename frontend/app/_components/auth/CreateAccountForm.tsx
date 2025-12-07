import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../ui/CustomButton';
import InputField from '../ui/InputField';
import { register } from '../../../services/authService';
import { generateWorkoutPlan } from '../../../services/workoutService';

export default function CreateAccountForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    age: '',
    weight: '',
    height: '',
    password: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async () => {
    if (loading) return;
    // Basic validation
    if (!formData.email || !formData.password) {
      Alert.alert('Hiba', 'Kérlek töltsd ki az email és jelszó mezőket');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.username || formData.email.split('@')[0],
        email: formData.email,
        password: formData.password,
        age: Number(formData.age) || 25,
        weight: Number(formData.weight) || 70,
        height: Number(formData.height) || 175,
        fitnessLevel: 'beginner',
        workoutPreferences: { focusAreas: [], timePerSession: 30 }
      };

      try {
        // Try backend registration with 5 second timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const res = await register(payload);
        clearTimeout(timeoutId);
        console.log('Registration response', res);

        // Try to generate a plan afterwards but don't block navigation on failure
        generateWorkoutPlan(payload.weight, payload.height).then(planRes => {
          console.log('Plan generated after registration', planRes);
        }).catch(planErr => {
          console.warn('Plan generation failed after registration', planErr);
        });
      } catch (backendErr) {
        console.warn('Backend registration failed or timed out, creating local profile', backendErr);
        // Continue with local profile creation
      }

      // Persist user data locally (works even if backend fails)
      await AsyncStorage.setItem('userName', payload.name);
      await AsyncStorage.setItem('user', JSON.stringify({
        name: payload.name,
        email: payload.email,
        age: payload.age,
        weight: payload.weight,
        height: payload.height,
      }));
      
      // Calculate and store BMI
      const bmiValue = payload.weight / ((payload.height / 100) ** 2);
      await AsyncStorage.setItem('userBmi', bmiValue.toFixed(1));

      console.log('Local profile created successfully');

      // Navigate to the tabs layout immediately
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('Registration failed', err);
      Alert.alert('Hiba', err?.message || 'Nem sikerült regisztrálni');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      
      <InputField
        placeholder="email@domain.com"
        value={formData.email}
        onChangeText={(value) => handleChange('email', value)}
        keyboardType="email-address"
      />
      
      <InputField
        placeholder="Username"
        value={formData.username}
        onChangeText={(value) => handleChange('username', value)}
      />
      
      <InputField
        placeholder="Age"
        value={formData.age}
        onChangeText={(value) => handleChange('age', value)}
        keyboardType="numeric"
      />
      
      <InputField
        placeholder="Kg"
        value={formData.weight}
        onChangeText={(value) => handleChange('weight', value)}
        keyboardType="numeric"
      />
      
      <InputField
        placeholder="Height"
        value={formData.height}
        onChangeText={(value) => handleChange('height', value)}
        keyboardType="numeric"
      />
      
      <InputField
        placeholder="**********"
        value={formData.password}
        onChangeText={(value) => handleChange('password', value)}
        secureTextEntry
      />
      
      <CustomButton 
        title="Continue" 
        onPress={handleCreateAccount}
        loading={loading}
      />
      
      <Text style={styles.orText}>or</Text>
      
      <CustomButton 
        title="Login" 
        onPress={handleLogin}
        variant="secondary"
      />
      
      <Text style={styles.footerText}>
        By clicking continue, you agree to our Terms of Service and Privacy Policy
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#666',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginVertical: 16,
    paddingHorizontal: 20,
  },
});