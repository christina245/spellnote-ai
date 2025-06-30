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
import { ArrowLeft, Star } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function SwitchToAIFreeScreen() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  const handleBack = () => {
    router.back();
  };

  const handleViewDashboard = () => {
    // Navigate to dashboard with AI-free mode
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
            You've selected the AI-Free Mode, which means you'll only be receiving your notes as push notifications and texts as you've written them with zero AI modification.
          </Text>

          <Text style={styles.descriptionText}>
            You can switch back to AI Mode in the navigation with "Switch to AI Mode". If you do switch back to AI Mode, you'll still have the options to receive any notification you select AI-free.
          </Text>

          <Text style={styles.descriptionText}>
            You'll still be able to view your past notes sent with AI, if any.
          </Text>

          <View style={styles.importantNoteContainer}>
            <Star size={16} color="#F3CC95" style={styles.starIcon} />
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
      </ScrollView>
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
    marginBottom: 40,
  },
  symbolContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noAISymbol: {
    width: 144,
    height: 144,
  },
  descriptionContainer: {
    marginBottom: 45,
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
    fontWeight: '600',
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