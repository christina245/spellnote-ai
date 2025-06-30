import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function SwitchToAIModeScreen() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  const handleBack = () => {
    router.back();
  };

  const handleViewDashboard = () => {
    // Navigate to dashboard with AI mode enabled
    // In a real app, this would update the user's mode preference to 'character' or 'spellbot'
    router.push('/(tabs)');
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
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
        {/* Title */}
        <Text style={styles.title}>New adventures await!</Text>

        {/* AI Chat Bubbles Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.chatBubblesContainer}>
            {/* Purple chat bubble with sparkle */}
            <View style={styles.purpleBubble}>
              <Image 
                source={require('../assets/images/20250629_2206_Dark Gold Sparkle_simple_compose_01jyzknxm0f04vtfmz59seta4x 1.png')}
                style={styles.sparkleIcon}
                resizeMode="contain"
              />
            </View>
            
            {/* Teal chat bubble */}
            <View style={styles.tealBubble}>
              {/* Empty bubble for visual balance */}
            </View>
          </View>
        </View>

        {/* Description Text */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            You've decided to switch to AI Mode, which means you'll be able to use Spellnote with our generic Spellbot or with your own original characters!
          </Text>

          <Text style={styles.descriptionText}>
            That means you can now set reminders to drink water or to try out that new workout routine in the gym as if they were sent to you by one of your own (non-copyrighted!) plushies or fictional novel protagonists!
          </Text>

          <Text style={styles.descriptionText}>
            Of course, you can ALWAYS send any note without AI. Your character or Spellbot's name will still appear, but the message will only consist of your original input.
          </Text>
        </View>

        {/* View Dashboard Button */}
        <TouchableOpacity 
          style={styles.dashboardButton}
          onPress={handleViewDashboard}
          activeOpacity={0.8}
        >
          <Text style={styles.dashboardButtonText}>View dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D2B4A', // Dark purple background matching the design
  },
  header: {
    paddingTop: 60,
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
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: -0.28,
    marginBottom: 48, // Increased spacing to match design
  },
  illustrationContainer: {
    marginBottom: 48, // Increased spacing to match design
    alignItems: 'center',
    justifyContent: 'center',
    height: 120, // Adjusted height for better proportions
  },
  chatBubblesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: -16, // Slight overlap for the chat bubbles
    position: 'relative',
  },
  purpleBubble: {
    width: 88, // Slightly larger to match design proportions
    height: 88,
    backgroundColor: '#B794F6', // Light purple matching the design
    borderRadius: 24, // More rounded corners
    borderBottomLeftRadius: 6, // Chat bubble tail effect
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  tealBubble: {
    width: 88, // Slightly larger to match design proportions
    height: 88,
    backgroundColor: '#4FD1C7', // Teal color matching the design
    borderRadius: 24, // More rounded corners
    borderBottomRightRadius: 6, // Chat bubble tail effect
    zIndex: 1,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  sparkleIcon: {
    width: 36, // Slightly larger sparkle icon
    height: 36,
  },
  descriptionContainer: {
    marginBottom: 48, // Increased spacing to match design
    paddingHorizontal: 8,
    maxWidth: screenWidth - 48, // Ensure proper text width
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 22, // Improved line height for better readability
    fontFamily: 'Inter',
    textAlign: 'center',
    marginBottom: 20,
  },
  dashboardButton: {
    width: 200,
    height: 56,
    backgroundColor: '#F3CC95', // Golden yellow button
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 40,
  },
  dashboardButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1830', // Dark text on light button
    fontFamily: 'Inter',
  },
});