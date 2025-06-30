import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ExploreTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Characters</Text>
      <Text style={styles.subtitle}>Browse and discover amazing characters created by the community</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2D2B4A',
    paddingHorizontal: 20,
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
});