import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Linking,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Phone, MessageCircle, ExternalLink } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const { width: screenWidth } = Dimensions.get('window');

export default function Resources() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  const handleBack = () => {
    router.back();
  };

  const handleCall988 = () => {
    const phoneNumber = 'tel:988';
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneNumber);
        } else {
          Alert.alert('Error', 'Phone calls are not supported on this device');
        }
      })
      .catch((err) => console.error('Error opening phone app:', err));
  };

  const handleText988 = () => {
    const smsNumber = 'sms:988';
    Linking.canOpenURL(smsNumber)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(smsNumber);
        } else {
          Alert.alert('Error', 'SMS is not supported on this device');
        }
      })
      .catch((err) => console.error('Error opening SMS app:', err));
  };

  const handleViewResources = () => {
    const url = 'https://988lifeline.org/help-yourself/additional-resources/';
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Cannot open external links on this device');
        }
      })
      .catch((err) => console.error('Error opening URL:', err));
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
        <Text style={styles.title}>
          Spellnotes aims to make{'\n'}
          your life easier, not worse.
        </Text>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.bodyText}>
            But we're aware that won't be the case for every user due to system imperfections.
          </Text>

          <Text style={styles.bodyText}>
            This app is currently in beta testing. While we're committed to creating an emotionally safe experience through ongoing user research and AI model refinement, technology may occasionally produce unexpected and unwanted responses or behaviors. This is especially likely for characters with negative traits.
          </Text>

          <Text style={styles.bodyText}>
            Spellnotes cannot substitute for professional mental health care. The AI characters cannot provide emotional support, therapy, or crisis intervention. They can only deliver pre-written reminders and messages that you create for yourself, just with their own flair.
          </Text>

          <Text style={styles.bodyText}>
            If you notice increased emotional dependence on this app, difficulty distinguishing between AI interactions and real relationships, or worsening mental health symptoms, please discontinue use and consult a mental health professional.
          </Text>

          {/* Crisis Information */}
          <View style={styles.crisisContainer}>
            <Text style={styles.crisisText}>
              <Text style={styles.crisisLabel}>If you're experiencing a mental health emergency, contact the Suicide & Crisis Lifeline at 988 immediately.</Text>
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={handleViewResources}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>View selected mental health resources</Text>
              <ExternalLink size={16} color="#2D2B4A" />
            </TouchableOpacity>

            <View style={styles.emergencyButtons}>
              <TouchableOpacity 
                style={styles.emergencyButton}
                onPress={handleText988}
                activeOpacity={0.8}
              >
                <MessageCircle size={20} color="#FFFFFF" />
                <Text style={styles.emergencyButtonText}>Text 988</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.emergencyButton}
                onPress={handleCall988}
                activeOpacity={0.8}
              >
                <Phone size={20} color="#FFFFFF" />
                <Text style={styles.emergencyButtonText}>Call 988</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  },
  title: {
    fontSize: 28,
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 36,
    letterSpacing: -0.28,
    marginBottom: 32,
  },
  contentContainer: {
    gap: 20,
  },
  bodyText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 22,
    fontFamily: 'Inter',
  },
  crisisContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  crisisText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 22,
    fontFamily: 'Inter',
  },
  crisisLabel: {
    color: '#FF6B6B', // Red color for crisis information
    fontWeight: '600',
  },
  actionButtons: {
    marginTop: 32,
    gap: 20,
    alignItems: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F3CC95',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 280,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D2B4A',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  emergencyButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#DC2626', // Red background for emergency buttons
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    minWidth: 120,
  },
  emergencyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
});