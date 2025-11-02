import { View, Text, StyleSheet } from 'react-native';

interface StatsCardProps {
  bmi: number;
  workoutsCompleted?: number;
  currentWeek?: number;
}

export default function StatsCard({ bmi, workoutsCompleted = 0, currentWeek = 1 }: StatsCardProps) {
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistics</Text>
      
      <View style={styles.statRow}>
        <Text style={styles.label}>BMI:</Text>
        <Text style={styles.value}>{bmi.toFixed(1)}</Text>
        <Text style={styles.category}>({getBMICategory(bmi)})</Text>
      </View>
      
      <View style={styles.statRow}>
        <Text style={styles.label}>Workouts Completed:</Text>
        <Text style={styles.value}>{workoutsCompleted}</Text>
      </View>
      
      <View style={styles.statRow}>
        <Text style={styles.label}>Current Week:</Text>
        <Text style={styles.value}>{currentWeek}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#333',
    flex: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    flex: 1,
    textAlign: 'right',
  },
  category: {
    fontSize: 14,
    color: '#666',
    flex: 2,
    textAlign: 'right',
  },
});