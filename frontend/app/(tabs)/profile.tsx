import { View, ScrollView, StyleSheet } from 'react-native';
import ProfileHeader from '../_components/profile/ProfileHeader';
import StatsCard from '../_components/profile/StatsCard';

export default function ProfileScreen() {
  // Mock data - később helyettesíted valós adatokkal
  const userData = {
    name: "Jimmy Zambo",
    age: 56,
    weight: 78,
    height: 178,
    bmi: 24.6,
    workoutsCompleted: 124,
    currentWeek: 3
  };

  return (
    <ScrollView style={styles.container}>
      <ProfileHeader 
        name={userData.name}
        age={userData.age}
        weight={userData.weight}
        height={userData.height}
      />
      
      <StatsCard 
        bmi={userData.bmi}
        workoutsCompleted={userData.workoutsCompleted}
        currentWeek={userData.currentWeek}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});