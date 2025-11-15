import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '../ui/CustomButton';

interface PlanGeneratorProps {
  onGenerateAI: () => void;
  onGetStaticPlan: () => void;
}

export default function PlanGenerator({ onGenerateAI, onGetStaticPlan }: PlanGeneratorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Generate your plan</Text>
      
      <CustomButton 
        title="Generate with AI" 
        onPress={onGenerateAI}
      />
      
      <Text style={styles.orText}>or</Text>
      
      <CustomButton 
        title="Get static plan" 
        onPress={onGetStaticPlan}
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
    marginBottom: 32,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#666',
  },
});