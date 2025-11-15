import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import ProfileHeader from '../_components/profile/ProfileHeader';
import StatsCard from '../_components/profile/StatsCard';
import CustomButton from '../_components/ui/CustomButton';

export default function ProfileScreen(): React.ReactElement {
  const router = useRouter();
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

  const handleLogout = () => {
    // Replace navigation so user can't go back to protected screens
    router.replace('/login');
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.container}>
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

      <View style={styles.footer}>
        <CustomButton title="Log out" onPress={handleLogout} variant="secondary" style={styles.logoutButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    padding: 20,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    paddingHorizontal: 20,
  },
  logoutButton: {
    width: '100%',
  },
});