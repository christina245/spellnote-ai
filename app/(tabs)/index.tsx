import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
  Alert,
  Modal
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Bell, Plus, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import NavigationMenu from '@/components/NavigationMenu';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface NotificationEntry {
  id: string;
  header: string;
  details: string;
  date: string;
  time: string;
  characterName: string;
  characterType: 'character' | 'spellbot' | 'ai-free';
  avatarSource: any;
  isFirst?: boolean;
  sendWithoutAI?: boolean;
  createdAt: number; // Timestamp for sorting
}

interface CharacterInfo {
  id: string;
  name: string;
  type: 'character' | 'spellbot' | 'ai-free';
  avatarSource: any;
  description?: string;
  vibes?: string[];
  tagline?: string;
  isDemo?: boolean;
}

// CRITICAL: Global notification storage to persist across navigation
let globalNotifications: NotificationEntry[] = [];
let globalProcessedIds: Set<string> = new Set();

export default function HomeTab() {
  // ... [rest of the code remains exactly the same]
}

const styles = StyleSheet.create({
  // ... [styles remain exactly the same]
});