import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '../ui/CustomButton';  // ✅ Relatív útvonal
import InputField from '../ui/InputField';      // ✅ Relatív útvonal
import { login } from '../../../services/authService';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    (async () => {
      try {
        const res = await login(email, password);
        console.log('Login success', res);
        router.replace(`/home?name=${encodeURIComponent(res.user?.name || email)}`);
      } catch (err: any) {
        console.error('Login failed', err);
        Alert.alert('Hiba', err?.message || 'Bejelentkezés sikertelen');
      }
    })();
  };

  const handleGuestLogin = () => {
    console.log('Guest login');
    router.replace('/(tabs)');
  };

  const handleCreateAccount = () => {
    router.push('/create-account' as unknown as any);  // bypass strict route typings
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