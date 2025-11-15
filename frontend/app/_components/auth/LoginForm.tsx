import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import CustomButton from '../ui/CustomButton';
import InputField from '../ui/InputField';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    console.log('Login attempt:', { email, password });
    // Navigate to tabs - explicit módon
    router.push('/(tabs)');
  };

  const handleGuestLogin = async () => {
    try {
      // create a random guest display name
      const guestName = `Guest${Math.floor(Math.random() * 9000) + 1000}`;
      await AsyncStorage.setItem('userName', guestName);
      await AsyncStorage.setItem('isGuest', 'true');
      console.log('Guest login as', guestName);
      // Replace navigation so user can't go back to login
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