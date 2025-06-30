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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CharacterSelection() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const router = useRouter();
  const params = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  const handleBack = () => {
    router.back();
  };

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    // Navigate based on selected option
    setTimeout(() => {
      if (option === 'ai-free') {
        router.push({
          pathname: '/ai-free',
          params: {
            // Pass notification data to ai-free screen
            notificationHeader: params.notificationHeader,
            notificationDetails: params.notificationDetails,
            startDate: params.startDate,
            endDate: params.endDate,
            time: params.time,
            isRepeat: params.isRepeat,
            isTextItToMe: params.isTextItToMe
          }
        });
      } else if (option === 'character') {
        router.push({
          pathname: '/character-creation',
          params: {
            // Pass notification data to character creation
            notificationHeader: params.notificationHeader,
            notificationDetails: params.notificationDetails,
            startDate: params.startDate,
            endDate: params.endDate,
            time: params.time,
            isRepeat: params.isRepeat,
            isTextItToMe: params.isTextItToMe
          }
        });
      } else if (option === 'spellbot') {
        router.push({
          pathname: '/spellbot',
          params: {
            // Pass notification data to spellbot screen
            notificationHeader: params.notificationHeader,
            notificationDetails: params.notificationDetails,
            startDate: params.startDate,
            endDate: params.endDate,
            time: params.time,
            isRepeat: params.isRepeat,
            isTextItToMe: params.isTextItToMe
          }
        });
      } else {
        // For other modes, navigate to main app tabs for now
        router.push('/(tabs)');
      }
    }, 300);
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
        
        <Text style={styles.headerTitle}>Now, who's sending it?</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Introduction Text */}
        <View style={styles.introSection}>
          <Text style={styles.introText}>
            We originally created Spellnote so you could enjoy receiving texts from your original characters, but we understand that's not for everybody.
          </Text>
          
          <Text style={styles.introText}>
            You can use Spellnote with or without a character and even without AI, ensuring your notes are delivered to you exactly as you've written them.
          </Text>
        </View>

        {/* Character Mode Option */}
        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => handleOptionSelect('character')}
          activeOpacity={0.8}
        >
          <View style={styles.optionContainer}>
            <View style={styles.optionImageContainer}>
              <Image 
                source={require('../assets/images/20250616_1452_Diverse Character Ensemble_simple_compose_01jxxbhwf0e8qrb67cd6e42xf8.png')}
                style={styles.optionImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>CHARACTER MODE</Text>
              <Text style={styles.optionDescription}>
                Hear from your original characters! Max 3 free, $10/month each additional.
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Spellbot Option */}
        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => handleOptionSelect('spellbot')}
          activeOpacity={0.8}
        >
          <View style={styles.optionContainer}>
            <View style={styles.optionImageContainer}>
              <Image 
                source={require('../assets/images/square logo (2).png')}
                style={styles.optionImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>SPELLBOT</Text>
              <Text style={styles.optionDescription}>
                Just our generic app bot giving similar vibes to ChatGPT. Lawful neutral.
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* AI-Free Option */}
        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => handleOptionSelect('ai-free')}
          activeOpacity={0.8}
        >
          <View style={styles.optionContainer}>
            <View style={styles.optionImageContainer}>
              <Image 
                source={require('../assets/images/20250629_2006_No AI Symbol_simple_compose_01jyzcradxfyjrsjerpkw5regx.png')}
                style={styles.optionImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.optionContent}>
              <View style={styles.titleWithIcon}>
                <Text style={styles.optionTitle}>AI-FREE</Text>
                <Text style={styles.prohibitedIcon}>🚫</Text>
              </View>
              <Text style={styles.optionDescription}>
                Just text me whatever I write whenever I say so. Nothing more.
              </Text>
            </View>
          </View>
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
    marginBottom: 30, // Minimum 30px between Back button and header text
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F3CC95',
    fontFamily: 'Inter',
  },
  headerTitle: {
    color: '#FFF',
    fontFamily: 'Montserrat_700Bold', // Using the properly loaded font
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 31.2, // 130% of 24px
    letterSpacing: -0.24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  introSection: {
    marginBottom: 32,
  },
  introText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 20,
    fontFamily: 'Inter',
    marginBottom: 16,
  },
  optionCard: {
    marginBottom: 24,
  },
  optionContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.10)', // Reduced from 20% to 10% opacity
    borderRadius: 10,
    padding: 16,
    alignItems: 'center', // Vertically center contents
  },
  optionImageContainer: {
    marginRight: 16,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible', // Prevent any clipping
  },
  optionImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600', // Decreased from 700 to 600 (100 weight decrease)
    color: '#8DD3C8',
    fontFamily: 'Inter',
    marginBottom: 5, // 5px gap before white text
    letterSpacing: 0.5,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5, // 5px gap before white text
  },
  prohibitedIcon: {
    fontSize: 14.4, // Shrunk by another 10% (was 16, now 14.4)
    marginLeft: 8,
    // Perfect inline alignment with AI-FREE text
    lineHeight: 16, // Match the title line height
    height: 16, // Explicit height to ensure proper alignment
    textAlignVertical: 'center',
    includeFontPadding: false, // Remove extra font padding on Android
  },
  optionDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 18,
    fontFamily: 'Inter',
  },
});