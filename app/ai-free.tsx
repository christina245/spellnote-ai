import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function AIFreeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  const handleBack = () => {
    router.back();
  };

  const handleViewDashboard = () => {
    // Navigate to dashboard with AI-free mode and notification data
    router.push({
      pathname: '/(tabs)',
      params: {
        userMode: 'ai-free',
        characterType: 'ai-free',
        characterName: 'AI-Free Mode',
        // Pass through notification data to homepage
        notificationHeader: params.notificationHeader,
        notificationDetails: params.notificationDetails,
        time: params.time,
        startDate: params.startDate,
        endDate: params.endDate,
        isRepeat: params.isRepeat,
        isTextItToMe: params.isTextItToMe,
        notificationTimestamp: params.notificationTimestamp
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

      {/* Main Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>No AI, no problem.</Text>

        {/* No AI Symbol */}
        <View style={styles.symbolContainer}>
          <Image 
            source={require('../assets/images/20250629_2006_No AI Symbol_simple_compose_01jyzcradxfyjrsjerpkw5regx 2.png')}
            style={styles.noAISymbol}
            resizeMode="contain"
          />
        </View>

        {/* Description Text */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            You've selected the AI-free version, which means you'll only be receiving your notes as push notifications and texts as you've written them with zero AI modification.
          </Text>

          <Text style={styles.descriptionText}>
            You can switch to character or Spellbot mode anytime in the navigation with "Switch to AI mode". If you do switch to AI, you still have the options to receive any notification you select AI-free.
          </Text>

          <View style={styles.importantNoteContainer}>
            <Text style={styles.starIcon}>‼️</Text>
            <Text style={styles.importantNoteText}>
              <Text style={styles.importantNoteLabel}>Important note:</Text> in AI-free mode, you won't be able to configure notifications by SMS, only directly in the app.
            </Text>
          </View>
        </View>

        {/* View Dashboard Button */}
        <TouchableOpacity 
          style={styles.dashboardButton}
          onPress={handleViewDashboard}
          activeOpacity={0.8}
        >
          <Text style={styles.dashboardButtonText}>View dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D2B4A',
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
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
    marginBottom: 40,
  },
  symbolContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noAISymbol: {
    width: 144, // Increased by 20% from 120px to 144px
    height: 144, // Increased by 20% from 120px to 144px
  },
  descriptionContainer: {
    marginBottom: 45, // Reduced from 60px to 45px (moved button up by 15px)
    paddingHorizontal: 8,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 20,
    fontFamily: 'Inter',
    textAlign: 'center',
    marginBottom: 20,
  },
  importantNoteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 8,
  },
  starIcon: {
    fontSize: 16,
    marginTop: 2,
    flexShrink: 0,
  },
  importantNoteText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 20,
    fontFamily: 'Inter',
    flex: 1,
  },
  importantNoteLabel: {
    fontWeight: '600', // Added 200 more font weight (was 400, now 600)
  },
  dashboardButton: {
    width: 200,
    height: 56,
    backgroundColor: '#F3CC95',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 40,
  },
  dashboardButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1830',
    fontFamily: 'Inter',
  },
});