import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import PlanGenerator from '../../_components/plan/PlanGenerator';
import WeekCard from '../../_components/plan/WeekCard';

export default function PlanScreen() {
  const router = useRouter();

  const handleGenerateAI = () => {
    // TODO: Implement AI plan generation
    console.log('Generate AI plan');
  };

  const handleGetStaticPlan = () => {
    // TODO: Implement static plan
    console.log('Get static plan');
  };

  const handleWeekPress = (weekNumber: number) => {
    router.push(`/week?week=${weekNumber}`);
  };

  // Mock data - weeks 1-4
  const weeks = [
    { number: 1, completed: true },
    { number: 2, completed: true },
    { number: 3, completed: false },
    { number: 4, completed: false },
  ];

  return (
    <ScrollView style={styles.container}>
      <PlanGenerator 
        onGenerateAI={handleGenerateAI}
        onGetStaticPlan={handleGetStaticPlan}
      />
      
      <View style={styles.weeksSection}>
        <Text style={styles.sectionTitle}>Your Plan</Text>
        {weeks.map(week => (
          <WeekCard
            key={week.number}
            weekNumber={week.number}
            isCompleted={week.completed}
            onPress={() => handleWeekPress(week.number)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  weeksSection: {
    marginTop: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 16,
    color: '#333',
  },
});