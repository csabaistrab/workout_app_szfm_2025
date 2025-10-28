import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '../ui/CustomButton';  // ✅ Relatív útvonal
import InputField from '../ui/InputField';      // ✅ Relatív útvonal

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login attempt:', { email, password });
    router.push('/(tabs)');  // ✅ Módosított útvonal
  };

  const handleGuestLogin = () => {
    console.log('Guest login');
    router.push('/(tabs)');  // ✅ Módosított útvonal
  };

  const handleCreateAccount = () => {
    router.push('/create-account');  // ✅ Abszolút útvonal
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

      <View style={styles.buttonRow}>
        <CustomButton
          title="Login as Guest"
          onPress={handleGuestLogin}
          variant="secondary"
          style={{ flex: 1, marginRight: 8 }}
        />

        <CustomButton
          title="Create account"
          onPress={handleCreateAccount}
          variant="secondary"
          style={{ flex: 1, marginLeft: 8 }}
        />
      </View>

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
    justifyContent: 'flex-start',
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
    marginBottom: 4,
    color: '#c5c5c5ff',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginVertical: 16,
    paddingHorizontal: 20,
  },
});