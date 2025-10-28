import { View, StyleSheet, Text } from 'react-native';
import LoginForm from './_components/auth/LoginForm';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.hr} />
        <Text style={styles.title}>GymBroPro</Text>
        <View style={styles.hr} />
      </View>

      <LoginForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginHorizontal: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 115,
    marginBottom: 70,
    paddingHorizontal: 12,
  },
  hr: {
    flex: 1,
    height: 3,
    backgroundColor: '#000',
  },
});