import { View, StyleSheet } from 'react-native';
import CreateAccountForm from './_components/auth/CreateAccountForm';

export default function CreateAccountScreen() {
  return (
    <View style={styles.container}>
      <CreateAccountForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});