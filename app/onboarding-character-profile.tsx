import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const { width: screenWidth } = Dimensions.get('window');

export default function OnboardingCharacterProfile() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  // Get character data from params
  const characterId = params.characterId as string;
  const characterName = params.characterName as string;
  const characterDescription = params.characterDescription as string;
  const characterVibes = params.characterVibes ? JSON.parse(params.characterVibes as string) : [];
  const characterTagline = params.characterTagline as string;
  const avatarSource = params.avatarSource as string;

  const handleBack = () => {
    router.back();
  };

  const handleChooseCharacter = () => {
    // Navigate to notification preview with selected character data
    router.push({
      pathname: '/notification-preview-user',
      params: {
        characterType: 'character',
        characterName: characterName,
        characterDescription: characterDescription,
        characterVibes: JSON.stringify(characterVibes),
        characterTagline: characterTagline,
        characterId: characterId, // Pass character ID for proper avatar handling
        // Pass through any notification data if it exists (empty strings if no notification)
        notificationHeader: params.notificationHeader || '',
        notificationDetails: params.notificationDetails || '',
        startDate: params.startDate || new Date().toISOString(),
        time: params.time || '2:00 PM'
      }
    });
  };

  const getAvatarSource = () => {
    if (characterId === 'demo-muffin-1') {
      return require('../assets/images/pink bunny copy copy.jpg');
    } else if (characterId === 'demo-aria-2') {
      return require('../assets/images/20250706_1541_Futuristic Spacecraft Cockpit_simple_compose_01jzgyc3yserjtsrq38jpjn75t copy copy.png');
    } else if (characterId === 'demo-rave-addict-3') {
      return require('../assets/images/20250706_2138_Festival Fun_remix_01jzhjrj5xejnvemxvax2k067h.png');
    }
    return require('../assets/images/20250616_1452_Diverse Character Ensemble_simple_compose_01jxxbhwf0e8qrb67cd6e42xf8.png');
  };

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
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Character profile</Text>
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Text style={styles.sectionLabel}>AVATAR</Text>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarImageContainer}>
              <Image 
                source={getAvatarSource()}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        {/* Character Name */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>CHARACTER NAME</Text>
          <Text style={styles.readOnlyText}>{characterName}</Text>
        </View>

        {/* Character Description */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>CHARACTER DESCRIPTION</Text>
          <Text style={styles.readOnlyTextDescription}>
            {characterId === 'demo-aria-2' 
              ? 'ARIA (Automated Reminder & Instruction Assistant) - I AM THE AI SYSTEM OF YOUR SPACECRAFT. MY PRIMARY FUNCTION IS TO PROVIDE NOTIFICATIONS AND INSTRUCTIONS TO ENSURE OPTIMAL MISSION PERFORMANCE.'
              : characterDescription
            }
          </Text>
        </View>

        {/* Character Vibes - Show selected vibes plus "serious" for ARIA */}
        {(characterVibes.length > 0 || characterId === 'demo-aria-2') && (
          <View style={styles.vibesSection}>
            <Text style={styles.sectionLabel}>CHARACTER VIBES</Text>
            <View style={styles.vibesGrid}>
              {characterVibes.map((vibe: string, index: number) => (
                <View
                  key={`${vibe}-${index}`}
                  style={styles.vibeButtonSelected}
                >
                  <Text style={styles.vibeButtonTextSelected}>
                    {vibe}
                  </Text>
                </View>
              ))}
              {/* Add "serious" and "robotic" vibes for ARIA */}
              {characterId === 'demo-aria-2' && (
                <>
                  <View style={styles.vibeButtonSelected}>
                    <Text style={styles.vibeButtonTextSelected}>
                      serious
                    </Text>
                  </View>
                  <View style={styles.vibeButtonSelected}>
                    <Text style={styles.vibeButtonTextSelected}>
                      robotic
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        )}

        {/* Character Tagline */}
        {characterTagline && (
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>CHARACTER TAGLINE</Text>
            <Text style={styles.readOnlyText}>{characterTagline}</Text>
          </View>
        )}

        {/* Extra spacing for floating button */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Choose Character Button */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity 
          style={styles.chooseCharacterButton}
          onPress={handleChooseCharacter}
          activeOpacity={0.8}
        >
          <Text style={styles.chooseCharacterButtonText}>Choose character</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#19162A',
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 36,
    letterSpacing: -0.28,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 17.5,
    fontFamily: 'Inter',
  },
  avatarSection: {
    marginBottom: 32,
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
  avatarImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: '#374151',
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
  readOnlyText: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    lineHeight: 17.5,
    color: '#FFF',
    marginBottom: 16,
  },
  readOnlyTextDescription: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    lineHeight: 17.5,
    color: '#FFF',
    marginBottom: 16,
  },
  vibesSection: {
    marginBottom: 32,
  },
  vibesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  vibeButtonSelected: {
    backgroundColor: '#4A3A7B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
    minHeight: 36,
    justifyContent: 'center',
  },
  vibeButtonTextSelected: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 120, // Extra space for floating button
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 10,
  },
  chooseCharacterButton: {
    backgroundColor: '#F3CC95',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 200,
  },
  chooseCharacterButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1830',
    fontFamily: 'Inter',
  },
});