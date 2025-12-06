import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface WeekCardProps {
  weekNumber: number;
  isCompleted?: boolean;
  onPress: () => void;
}

export default function WeekCard({ weekNumber, isCompleted = false, onPress }: WeekCardProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        isCompleted && styles.completedContainer
      ]} 
      onPress={onPress}
    >
      <Text style={styles.weekText}>{weekNumber}. hét</Text>
      <View style={[
        styles.statusIndicator,
        isCompleted ? styles.completed : styles.pending
      ]}>
        <Text style={styles.statusText}>
          {isCompleted ? '✓' : '→'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedContainer: {
    backgroundColor: '#F0F8F0',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  weekText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  statusIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pending: {
    backgroundColor: '#007AFF',
  },
  completed: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});