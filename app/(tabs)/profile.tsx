import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Settings } from 'lucide-react-native';

export default function ProfileTab() {
  const router = useRouter();

  const handleEditProfile = () => {
    router.push('/user-profile');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>Manage your account and preferences</Text>
      
      <TouchableOpacity 
        style={styles.profileButton}
        onPress={handleEditProfile}
        activeOpacity={0.7}
      >
        <User size={24} color="#F3CC95" />
        <Text style={styles.profileButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#1C1830',
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(243, 204, 149, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 32,
    borderWidth: 1,
    borderColor: 'rgba(243, 204, 149, 0.3)',
  },
  profileButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F3CC95',
    fontFamily: 'Inter',
  },
});