import { View, Text, StyleSheet } from 'react-native';

interface ProfileHeaderProps {
  name: string;
  age: number;
  weight: number;
  height: number;
}

export default function ProfileHeader({ name, age, weight, height }: ProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.statsContainer}>
        <Text style={styles.stat}>{age} yrs</Text>
        <Text style={styles.stat}>{weight} kg</Text>
        <Text style={styles.stat}>{height} cm</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    margin: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  stat: {
    fontSize: 16,
    color: '#666',
  },
});