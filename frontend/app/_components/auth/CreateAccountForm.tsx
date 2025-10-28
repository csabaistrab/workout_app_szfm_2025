import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '../ui/CustomButton';
import InputField from '../ui/InputField';

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

  const handleCreateAccount = () => {
    // TODO: Implement create account logic
    console.log('Create account:', formData);
    
    // Generate workout plan based on weight and height
    // Then navigate to tabs
    router.push('/(tabs)');
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