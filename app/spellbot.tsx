import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function SpellbotScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  const handleBack = () => {
    router.back();
  };

  const handleViewNotificationPreview = () => {
    // Navigate to notification preview screen with Spellbot data AND notification data
    router.push({
      pathname: '/notification-preview',
      params: {
        characterType: 'spellbot',
        characterName: 'Spellnote.ai',
        // Pass through the notification data from first-notification
        notificationHeader: params.notificationHeader || 'Board game night prep',
        notificationDetails: params.notificationDetails || 'Need to brush up on how to play Catan at 6 pm this Wednesday before board game night at 8. Ping me at 5 and 5:30 pm.',
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
        <Text style={styles.title}>Meet Spellbot.</Text>
        
        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Selecting Spellbot will take up 1/3 of your free character slots. This means you can still add 2 characters whenever you'd like!
        </Text>
        
        <Text style={styles.subtitle}>
          As always, you'll still be able to select if you want a notification to be delivered AI-free.
        </Text>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Text style={styles.sectionLabel}>AVATAR</Text>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('../assets/images/square logo 2.png')}
              style={styles.avatarImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Character Name Section */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>CHARACTER NAME</Text>
          <View style={styles.staticInputContainer}>
            <Text style={styles.staticInputText}>Spellnote.ai</Text>
          </View>
        </View>

        {/* Character Description Section */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>CHARACTER DESCRIPTION</Text>
          <View style={[styles.staticInputContainer, styles.staticInputMultiline]}>
            <Text style={styles.staticInputTextDescription}>
              Hello! I'm the generic Spellnote bot. I'll be texting you your notifications in typical AI bot language, just like what you're used to on ChatGPT and other non-character bots.
            </Text>
          </View>
        </View>

        {/* Character Vibes Section */}
        <View style={styles.vibesSection}>
          <Text style={styles.sectionLabel}>CHARACTER VIBES</Text>
          <View style={styles.vibesContainer}>
            <View style={styles.vibeButton}>
              <Text style={styles.vibeButtonText}>practical</Text>
            </View>
            <View style={styles.vibeButton}>
              <Text style={styles.vibeButtonText}>calm</Text>
            </View>
          </View>
        </View>

        {/* Character Tagline Section */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>CHARACTER TAGLINE</Text>
          <View style={styles.staticInputContainer}>
            <Text style={styles.staticInputTextTagline}>The official Spellnote.ai bot.</Text>
          </View>
        </View>

        {/* View Notification Preview Button */}
        <TouchableOpacity 
          style={styles.previewButton}
          onPress={handleViewNotificationPreview}
          activeOpacity={0.8}
        >
          <Text style={styles.previewButtonText}>View notification preview</Text>
          <ArrowRight size={16} color="#1D1B20" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1830', // Changed from #2D2B4A to #1C1830
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
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
    lineHeight: 20,
    fontFamily: 'Inter',
    marginBottom: 16,
  },
  avatarSection: {
    marginBottom: 32,
    marginTop: 16,
  },
  sectionLabel: {
    color: '#8DD3C8',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 17.5,
    letterSpacing: 0.7,
    marginBottom: 16,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    color: '#8DD3C8',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 17.5,
    letterSpacing: 0.7,
    marginBottom: 8,
  },
  staticInputContainer: {
    backgroundColor: '#000000', // Black background to signal non-editable
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  staticInputMultiline: {
    minHeight: 100,
    paddingTop: 12,
  },
  staticInputText: {
    fontSize: 16, // Increased from 14px to 16px (2px increase)
    fontFamily: 'Inter',
    fontWeight: '600', // Increased from 500 to 600 (100 weight increase)
    lineHeight: 17.5,
    color: '#FFFFFF',
  },
  staticInputTextDescription: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '500', // Decreased from 600 to 500 (100 weight decrease)
    lineHeight: 17.5,
    color: '#FFFFFF',
  },
  staticInputTextTagline: {
    fontSize: 14, // Changed from 12px to 14px to match character description
    fontFamily: 'Inter',
    fontWeight: '500', // Changed from 400 to 500 to match character description weight
    lineHeight: 17.5, // Adjusted line height to match character description
    color: '#FFFFFF',
  },
  vibesSection: {
    marginBottom: 32,
  },
  vibesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  vibeButton: {
    backgroundColor: '#4A3A7B', // Selected state color since these are pre-selected
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
    minHeight: 36,
    justifyContent: 'center',
  },
  vibeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF', // White text for selected state
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: 240, // Wider button to accommodate longer text
    height: 56,
    backgroundColor: '#F3CC95',
    borderRadius: 10,
    alignSelf: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 20,
    paddingHorizontal: 21, // Reverted back to original 21px padding
  },
  previewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1B20',
    fontFamily: 'Inter',
  },
});