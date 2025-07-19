import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const { width: screenWidth } = Dimensions.get('window');

export default function CharacterSelectionNew() {
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [generatedVibes, setGeneratedVibes] = useState<string[]>([]);
  const [generateClickCount, setGenerateClickCount] = useState(0);
  const router = useRouter();
  const params = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  const characterVibes = [
    'bubbly', 'mellow', 'witty',
    'fiery', 'stern', 'brooding',
    'dramatic', 'sassy', 'derpy',
    'deadpan', 'eccentric', 'practical'
  ];

  // Extended pool of character vibes for AI generation
  const allVibeOptions = [
    'bubbly', 'mellow', 'witty', 'fiery', 'stern', 'brooding',
    'dramatic', 'sassy', 'derpy', 'deadpan', 'eccentric', 'practical',
    'mysterious', 'cheerful', 'grumpy', 'wise', 'playful', 'serious',
    'optimistic', 'cynical', 'energetic', 'calm', 'rebellious', 'loyal',
    'ambitious', 'laid-back', 'curious', 'cautious', 'bold', 'shy',
    'confident', 'humble', 'creative', 'logical', 'spontaneous', 'methodical',
    'compassionate', 'ruthless', 'patient', 'impulsive', 'charming', 'awkward',
    'sophisticated', 'quirky', 'intense', 'gentle', 'fierce', 'tender',
    'analytical', 'intuitive', 'adventurous', 'homebody', 'social', 'introverted'
  ];

  const interests = [
    { id: 'fitness', label: 'fitness', emoji: '💪' },
    { id: 'nutrition', label: 'nutrition', emoji: '🥗' },
    { id: 'concerts', label: 'concerts', emoji: '🎵' },
    { id: 'sci-fi', label: 'sci-fi', emoji: '🚀' },
    { id: 'fantasy', label: 'fantasy', emoji: '🧙‍♀️' },
    { id: 'history', label: 'history', emoji: '📚' },
    { id: 'board-games', label: 'board games', emoji: '🎲' },
    { id: 'finance', label: 'finance', emoji: '💰' },
    { id: 'film', label: 'film', emoji: '🎬' },
    { id: 'art', label: 'art', emoji: '🎨' },
    { id: 'crafting', label: 'crafting', emoji: '✂️' },
    { id: 'cars', label: 'cars', emoji: '🚗' },
    { id: 'books', label: 'books', emoji: '📖' },
    { id: 'gaming', label: 'gaming', emoji: '🎮' },
    { id: 'pop-culture', label: 'pop culture', emoji: '⭐' },
    { id: 'productivity', label: 'productivity', emoji: '📝' }
  ];

  const handleBack = () => {
    router.back();
  };

  const handleVibeSelect = (vibe: string) => {
    if (selectedVibes.includes(vibe)) {
      setSelectedVibes(selectedVibes.filter(v => v !== vibe));
    } else {
      setSelectedVibes([...selectedVibes, vibe]);
    }
  };

  const handleInterestSelect = (interestId: string) => {
    if (selectedInterests.includes(interestId)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interestId));
    } else {
      setSelectedInterests([...selectedInterests, interestId]);
    }
  };

  const generateVibesBasedOnSelection = () => {
    // Get currently displayed vibes (initial + generated)
    const currentVibes = [...characterVibes, ...generatedVibes];
    
    // Filter out already displayed vibes
    const availableVibes = allVibeOptions.filter(vibe => !currentVibes.includes(vibe));
    
    if (selectedVibes.length > 0) {
      // Generate vibes similar to selected ones
      const similarVibes = [];
      
      // Define vibe categories for better AI-like suggestions
      const vibeCategories = {
        energetic: ['bubbly', 'fiery', 'dramatic', 'energetic', 'playful', 'bold', 'spontaneous', 'adventurous'],
        calm: ['mellow', 'stern', 'deadpan', 'calm', 'patient', 'methodical', 'gentle', 'wise'],
        humorous: ['witty', 'sassy', 'derpy', 'playful', 'quirky', 'charming', 'eccentric'],
        serious: ['brooding', 'practical', 'serious', 'analytical', 'logical', 'intense', 'ambitious'],
        social: ['bubbly', 'charming', 'social', 'confident', 'optimistic', 'cheerful'],
        mysterious: ['mysterious', 'brooding', 'intense', 'sophisticated', 'intuitive']
      };
      
      // Find categories that match selected vibes
      const matchingCategories = [];
      for (const [category, vibes] of Object.entries(vibeCategories)) {
        if (selectedVibes.some(selected => vibes.includes(selected))) {
          matchingCategories.push(category);
        }
      }
      
      // Generate suggestions from matching categories
      for (const category of matchingCategories) {
        const categoryVibes = vibeCategories[category as keyof typeof vibeCategories];
        const availableCategoryVibes = categoryVibes.filter(vibe => 
          availableVibes.includes(vibe) && !similarVibes.includes(vibe)
        );
        similarVibes.push(...availableCategoryVibes.slice(0, 2));
      }
      
      // Fill remaining slots with random available vibes
      while (similarVibes.length < 3 && availableVibes.length > similarVibes.length) {
        const randomVibe = availableVibes[Math.floor(Math.random() * availableVibes.length)];
        if (!similarVibes.includes(randomVibe)) {
          similarVibes.push(randomVibe);
        }
      }
      
      return similarVibes.slice(0, 3);
    } else {
      // Generate random vibes if no selection
      const randomVibes = [];
      while (randomVibes.length < 3 && availableVibes.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableVibes.length);
        const randomVibe = availableVibes[randomIndex];
        if (!randomVibes.includes(randomVibe)) {
          randomVibes.push(randomVibe);
          availableVibes.splice(randomIndex, 1);
        }
      }
      return randomVibes;
    }
  };

  const handleGenerateMoreVibes = () => {
    // Check if we've reached the limit of 3 clicks (9 new vibes total)
    if (generateClickCount >= 3) {
      return;
    }
    
    const newVibes = generateVibesBasedOnSelection();
    setGeneratedVibes([...generatedVibes, ...newVibes]);
    setGenerateClickCount(generateClickCount + 1);
  };

  const handleNextStep = () => {
    // Navigate to browse characters with selected preferences
    router.push({
      pathname: '/browse-characters',
      params: {
        selectedVibes: JSON.stringify(selectedVibes),
        selectedInterests: JSON.stringify(selectedInterests),
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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
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

      {/* Title and Description */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Browse characters</Text>
        <Text style={styles.description}>
          Select what vibes you'd like your character{'\n'}
          to have and your interests. We'll use that{'\n'}
          info to suggest some characters that you{'\n'}
          might enjoy.
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Character Vibes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CHARACTER VIBES</Text>
          <View style={styles.vibesGrid}>
            {[...characterVibes, ...generatedVibes].map((vibe, index) => (
              <TouchableOpacity
                key={`${vibe}-${index}`}
                style={[
                  styles.vibeButton,
                  selectedVibes.includes(vibe) && styles.vibeButtonSelected
                ]}
                onPress={() => handleVibeSelect(vibe)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.vibeButtonText,
                  selectedVibes.includes(vibe) && styles.vibeButtonTextSelected
                ]}>
                  {vibe}
                </Text>
              </TouchableOpacity>
            ))}
            
            {/* Generate More Button - only show if under limit of 3 clicks */}
            {generateClickCount < 3 && (
              <TouchableOpacity
                style={styles.generateMoreButton}
                onPress={handleGenerateMoreVibes}
                activeOpacity={0.7}
              >
                <Image 
                  source={require('../assets/images/20250629_2206_Dark Gold Sparkle_simple_compose_01jyzknxm0f04vtfmz59seta4x 1.png')}
                  style={styles.sparkleImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Your Interests Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>YOUR INTERESTS</Text>
          <View style={styles.interestsGrid}>
            {interests.map((interest) => (
              <TouchableOpacity
                key={interest.id}
                style={[
                  styles.interestButton,
                  selectedInterests.includes(interest.id) && styles.interestButtonSelected
                ]}
                onPress={() => handleInterestSelect(interest.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.interestEmoji}>{interest.emoji}</Text>
                <Text style={[
                  styles.interestButtonText,
                  selectedInterests.includes(interest.id) && styles.interestButtonTextSelected
                ]}>
                  {interest.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Extra spacing for floating button */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Next Step Button */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity 
          style={styles.nextStepButton}
          onPress={handleNextStep}
          activeOpacity={0.8}
        >
          <Text style={styles.nextStepButtonText}>Next step</Text>
          <ArrowRight size={16} color="#1D1B20" />
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
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
    letterSpacing: 0.5,
  },
  titleSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 20,
    fontFamily: 'Inter',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
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
  vibesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  vibeButton: {
    backgroundColor: '#BEC0ED',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
    minHeight: 36,
    justifyContent: 'center',
  },
  vibeButtonSelected: {
    backgroundColor: '#4A3A7B',
  },
  vibeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1D1B20',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  vibeButtonTextSelected: {
    color: '#FFFFFF',
  },
  generateMoreButton: {
    backgroundColor: '#BEC0ED',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  sparkleImage: {
    width: 16,
    height: 16,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  interestButton: {
    backgroundColor: '#BEC0ED',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 36,
  },
  interestButtonSelected: {
    backgroundColor: '#4A3A7B',
  },
  interestEmoji: {
    fontSize: 14,
  },
  interestButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1D1B20',
    fontFamily: 'Inter',
  },
  interestButtonTextSelected: {
    color: '#FFFFFF',
  },
  bottomSpacing: {
    height: 100,
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
    backgroundColor: '#F3CC95',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 160,
  },
  nextStepButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1B20',
    fontFamily: 'Inter',
  },
});