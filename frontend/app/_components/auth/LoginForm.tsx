import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import CustomButton from '../ui/CustomButton';
import InputField from '../ui/InputField';
import { login } from '../../../services/authService';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (loading) return;
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting login for', email);
      const res = await login(email, password);
      console.log('Login success', res);
      // persist display name if present
      const displayName = res.user?.name || res.user?.username || email.split('@')[0];
      try {
        await AsyncStorage.setItem('userName', displayName);
      } catch (e) {
        console.warn('Failed to persist userName', e);
      }
      // Navigate to the app home immediately (alert can block navigation on some devices)
      console.log('Navigating to tabs after login');
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('Login failed', err);
      Alert.alert('Error', err?.message || 'Unable to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      // create a random guest display name
      const guestName = `Guest${Math.floor(Math.random() * 9000) + 1000}`;
      console.log('Attempting guest login as', guestName);
      await AsyncStorage.setItem('userName', guestName);
      await AsyncStorage.setItem('isGuest', 'true');
      console.log('Guest login persisted as', guestName);
      // Navigate immediately to home for guest users
      console.log('Navigating to tabs after guest login');
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Failed to login as guest', err);
      Alert.alert('Error', 'Unable to continue as guest. Please try again.');
    }
  };

  const handleCreateAccount = () => {
    router.push('/create-account');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Enter your Email and Password to login</Text>
      
      <InputField
        placeholder="email@domain.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      
      <InputField
        placeholder="**********"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <CustomButton 
        title="Continue" 
        onPress={handleLogin}
        loading={loading}
      />
      
      <Text style={styles.orText}>or</Text>
      
      <CustomButton 
        title="Login as Guest" 
        onPress={handleGuestLogin}
        variant="secondary"
      />
      
      <Text style={styles.footerText}>
        By clicking continue, you agree to our Terms of Service and Privacy Policy
      </Text>
      
      <CustomButton 
        title="Create account" 
        onPress={handleCreateAccount}
        variant="secondary"
      />
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
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