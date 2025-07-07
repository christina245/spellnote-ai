import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const { width: screenWidth } = Dimensions.get('window');

interface Interest {
  id: string;
  label: string;
}

interface CharacterTrait {
  id: string;
  label: string;
}

export default function CharacterSelection() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const router = useRouter();
  const params = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  const interests: Interest[] = [
    { id: 'fitness', label: 'Fitness & Health' },
    { id: 'cooking', label: 'Cooking & Food' },
    { id: 'travel', label: 'Travel & Adventure' },
    { id: 'reading', label: 'Reading & Learning' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'music', label: 'Music & Arts' },
    { id: 'technology', label: 'Technology' },
    { id: 'nature', label: 'Nature & Outdoors' },
    { id: 'fashion', label: 'Fashion & Style' },
    { id: 'productivity', label: 'Productivity' },
    { id: 'mindfulness', label: 'Mindfulness & Meditation' },
    { id: 'social', label: 'Social & Relationships' },
  ];

  const characterTraits: CharacterTrait[] = [
    { id: 'encouraging', label: 'Encouraging' },
    { id: 'witty', label: 'Witty' },
    { id: 'calm', label: 'Calm' },
    { id: 'energetic', label: 'Energetic' },
    { id: 'wise', label: 'Wise' },
    { id: 'playful', label: 'Playful' },
    { id: 'serious', label: 'Serious' },
    { id: 'gentle', label: 'Gentle' },
    { id: 'motivational', label: 'Motivational' },
    { id: 'humorous', label: 'Humorous' },
    { id: 'supportive', label: 'Supportive' },
    { id: 'direct', label: 'Direct' },
    { id: 'creative', label: 'Creative' },
    { id: 'analytical', label: 'Analytical' },
    { id: 'empathetic', label: 'Empathetic' },
    { id: 'confident', label: 'Confident' },
  ];

  const handleBack = () => {
    router.back();
  };

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleTraitToggle = (traitId: string) => {
    setSelectedTraits(prev => 
      prev.includes(traitId) 
        ? prev.filter(id => id !== traitId)
        : [...prev, traitId]
    );
  };

  const handleNextStep = () => {
    // Navigate to browse characters with selected preferences
    router.push({
      pathname: '/browse-characters',
      params: {
        selectedInterests: JSON.stringify(selectedInterests),
        selectedTraits: JSON.stringify(selectedTraits),
        // Pass through any notification data if it exists
        notificationHeader: params.notificationHeader,
        notificationDetails: params.notificationDetails,
        startDate: params.startDate,
        endDate: params.endDate,
        time: params.time,
        isRepeat: params.isRepeat,
        isTextItToMe: params.isTextItToMe
      }
    });
  };

  // Check if user has made at least some selections
  const canProceed = selectedInterests.length > 0 || selectedTraits.length > 0;

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#F3CC95" />
          <Text style={styles.backText}>BACK</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title and Description */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>
            Tell us about yourself
          </Text>
          <Text style={styles.subtitle}>
            Select your interests and preferred character traits to help us recommend the perfect characters for you.
          </Text>
        </View>

        {/* Interests Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>YOUR INTERESTS</Text>
          <View style={styles.buttonGrid}>
            {interests.map((interest) => (
              <TouchableOpacity
                key={interest.id}
                style={[
                  styles.selectionButton,
                  selectedInterests.includes(interest.id) && styles.selectionButtonSelected
                ]}
                onPress={() => handleInterestToggle(interest.id)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.selectionButtonText,
                  selectedInterests.includes(interest.id) && styles.selectionButtonTextSelected
                ]}>
                  {interest.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Character Traits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERRED CHARACTER TRAITS</Text>
          <View style={styles.buttonGrid}>
            {characterTraits.map((trait) => (
              <TouchableOpacity
                key={trait.id}
                style={[
                  styles.selectionButton,
                  selectedTraits.includes(trait.id) && styles.selectionButtonSelected
                ]}
                onPress={() => handleTraitToggle(trait.id)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.selectionButtonText,
                  selectedTraits.includes(trait.id) && styles.selectionButtonTextSelected
                ]}>
                  {trait.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom spacing for floating button */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Next Step Button */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity 
          style={[
            styles.nextStepButton,
            !canProceed && styles.nextStepButtonDisabled
          ]}
          onPress={handleNextStep}
          disabled={!canProceed}
          activeOpacity={canProceed ? 0.8 : 1}
        >
          <Text style={[
            styles.nextStepButtonText,
            !canProceed && styles.nextStepButtonTextDisabled
          ]}>
            Next step
          </Text>
          <ArrowRight 
            size={16} 
            color={!canProceed ? "#9CA3AF" : "#1D1B20"} 
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1830',
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F3CC95',
    fontFamily: 'Inter',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 36,
    letterSpacing: -0.28,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 22,
    fontFamily: 'Inter',
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8DD3C8',
    fontFamily: 'Inter',
    letterSpacing: 0.7,
    marginBottom: 20,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  selectionButton: {
    backgroundColor: '#BEC0ED', // Unselected state
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 1,
  },
  selectionButtonSelected: {
    backgroundColor: '#4A3A7B', // Selected state
  },
  selectionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1D1B20', // Dark text for unselected
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  selectionButtonTextSelected: {
    color: '#FFFFFF', // White text for selected
  },
  bottomSpacing: {
    height: 100, // Space for floating button
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  nextStepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: 160,
    height: 56,
    backgroundColor: '#F3CC95', // Yellow button
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  nextStepButtonDisabled: {
    backgroundColor: '#6B7280', // Gray when disabled
    shadowOpacity: 0,
    elevation: 0,
  },
  nextStepButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1B20',
    fontFamily: 'Inter',
  },
  nextStepButtonTextDisabled: {
    color: '#9CA3AF', // Gray text when disabled
  },
});