import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
  Modal
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ChevronLeft } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function SMSIntegration() {
  const [showBetaModal, setShowBetaModal] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  // Use generic character data to keep page static
  const characterName = 'Character name';
  const avatarSource = require('../assets/images/20250616_1452_Diverse Character Ensemble_simple_compose_01jxxbhwf0e8qrb67cd6e42xf8.png');

  const handleBack = () => {
    router.back();
  };

  const handleSetupSMS = () => {
    setShowBetaModal(true);
  };

  const handleSkipForNow = () => {
    // Navigate to main app dashboard with the correct user mode and notification data
    router.push({
      pathname: '/(tabs)',
      params: {
        userMode: params.characterType || 'character', // Pass the character type to set the correct mode
        characterType: params.characterType || 'character',
        characterName: params.characterName || 'Character Name',
        userAvatarUri: params.userAvatarUri,
        characterDescription: params.characterDescription,
        characterVibes: params.characterVibes,
        characterTagline: params.characterTagline,
        // Pass through notification data to homepage
        notificationHeader: params.notificationHeader,
        notificationDetails: params.notificationDetails,
        time: params.time,
        startDate: params.startDate,
        endDate: params.endDate,
        isRepeat: params.isRepeat,
        isTextItToMe: params.isTextItToMe
      }
    });
  };

  const closeBetaModal = () => {
    setShowBetaModal(false);
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
        {/* Title and Description */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>
            Want to set up SMS{'\n'}
            notification setting?
          </Text>
          <Text style={styles.description}>
            Do you ever encounter ideas or{'\n'}
            recommendations you want to jot down{'\n'}
            immediately? You can text your character to{'\n'}
            remind you of it later at a specified date and{'\n'}
            time! <Text style={styles.boldText}>Modify the reminder by text anytime.</Text>
          </Text>
        </View>

        {/* SMS Preview Section */}
        <View style={styles.smsPreviewContainer}>
          {/* SMS Header with Avatar */}
          <View style={styles.smsHeader}>
            <ChevronLeft size={20} color="#007AFF" />
            <View style={styles.headerContent}>
              <View style={styles.avatarContainer}>
                <Image 
                  source={avatarSource}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.smsHeaderText}>{characterName}</Text>
            </View>
          </View>

          {/* SMS Messages */}
          <View style={styles.messagesContainer}>
            {/* User message */}
            <View style={styles.userMessageContainer}>
              <View style={styles.userMessage}>
                <Text style={styles.userMessageText}>
                  text me to look up the show demon slayer at 7 pm tonight
                </Text>
              </View>
            </View>

            {/* Character response */}
            <View style={styles.characterMessageContainer}>
              <View style={styles.characterMessage}>
                <Text style={styles.characterMessageText}>
                  Got it! I'll text you a reminder to look up the TV series Demon Slayer at 7 pm tonight. You better get to it!
                </Text>
              </View>
            </View>

            {/* User follow-up */}
            <View style={styles.userMessageContainer}>
              <View style={styles.userMessage}>
                <Text style={styles.userMessageText}>wait make that 8 pm</Text>
              </View>
            </View>

            {/* Character confirmation */}
            <View style={styles.characterMessageContainer}>
              <View style={styles.characterMessage}>
                <Text style={styles.characterMessageText}>
                  Alright, 8 pm it is! It's a great show, you might like it! It's one of the most popular animes of all time.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.setupButton}
            onPress={handleSetupSMS}
            activeOpacity={0.8}
          >
            <Text style={styles.setupButtonText}>Set up SMS</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.skipButton}
            onPress={handleSkipForNow}
            activeOpacity={0.7}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Beta Modal */}
      <Modal
        visible={showBetaModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeBetaModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>SMS Integration Unavailable</Text>
            <Text style={styles.modalMessage}>
              SMS integration is currently unavailable in beta mode. We're working on it!
            </Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={closeBetaModal}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1830',
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
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 20,
    fontFamily: 'Inter',
  },
  boldText: {
    fontWeight: '600',
  },
  smsPreviewContainer: {
    backgroundColor: '#E5E7EB',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 40,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  smsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 4,
    marginLeft: -20, // Offset the back arrow width to center content in the remaining space
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  smsHeaderText: {
    fontSize: 11, // Increased from 10px to 11px
    fontWeight: '400',
    color: '#1F2937',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  messagesContainer: {
    padding: 16,
    gap: 12,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  userMessage: {
    backgroundColor: '#007AFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '80%',
  },
  userMessageText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    lineHeight: 20,
  },
  characterMessageContainer: {
    alignItems: 'flex-start',
  },
  characterMessage: {
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '80%',
  },
  characterMessageText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#1F2937',
    fontFamily: 'Inter',
    lineHeight: 20,
  },
  actionButtons: {
    gap: 16,
    alignItems: 'center',
  },
  setupButton: {
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
  },
  setupButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1830',
    fontFamily: 'Inter',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6B7280',
    fontFamily: 'Inter',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#F3CC95',
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1830',
    fontFamily: 'Inter',
  },
});