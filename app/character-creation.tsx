import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image,
  Modal
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Camera, ArrowRight } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import PhotoUploadModal from '@/components/PhotoUploadModal';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CharacterCreation() {
  const [characterName, setCharacterName] = useState('');
  const [characterDescription, setCharacterDescription] = useState('');
  const [characterTagline, setCharacterTagline] = useState('');
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [generatedVibes, setGeneratedVibes] = useState<string[]>([]);
  const [generateClickCount, setGenerateClickCount] = useState(0);
  const [showBetaModal, setShowBetaModal] = useState(false);
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  const initialCharacterVibes = [
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

  const handleAvatarUpload = () => {
    setShowPhotoUploadModal(true);
  };

  const handlePhotoSelected = (uri: string) => {
    setAvatarUri(uri);
    setShowPhotoUploadModal(false);
  };

  const generateVibesBasedOnSelection = () => {
    // Get currently displayed vibes (initial + generated)
    const currentVibes = [...initialCharacterVibes, ...generatedVibes];
    
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
        mysterious: ['mysterious', 'brooding', 'intense', 'enigmatic', 'sophisticated', 'intuitive']
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

  const handleGenerateMoreSuggestions = () => {
    // Check if we've reached the limit of 2 clicks (6 new buttons total)
    if (generateClickCount >= 2) {
      Alert.alert('Limit Reached', 'Maximum of 18 character vibes can be displayed.');
      return;
    }
    
    const newVibes = generateVibesBasedOnSelection();
    setGeneratedVibes([...generatedVibes, ...newVibes]);
    setGenerateClickCount(generateClickCount + 1);
  };

  // Check if all required fields are filled
  const areRequiredFieldsFilled = () => {
    return characterName.trim() !== '' && 
           characterDescription.trim() !== '' && 
           characterDescription.length >= 75;
  };

  const handleNextStep = () => {
    // Validate required fields
    if (!characterName.trim()) {
      Alert.alert('Error', 'Character name is required');
      return;
    }
    if (!characterDescription.trim()) {
      Alert.alert('Error', 'Character description is required');
      return;
    }
    if (characterDescription.length < 75) {
      Alert.alert('Error', 'Character description must be at least 75 characters');
      return;
    }
    
    // Check if user has notification data (came from first-notification screen)
    const hasNotificationData = params.notificationHeader || params.notificationDetails;
    
    if (hasNotificationData) {
      // Navigate to notification preview with character data AND notification data
      router.push({
        pathname: '/notification-preview',
        params: {
          characterType: 'character',
          characterName: characterName,
          characterDescription: characterDescription,
          characterVibes: JSON.stringify(selectedVibes),
          characterTagline: characterTagline,
          userAvatarUri: avatarUri || undefined,
          // Pass through the notification data from first-notification
          notificationHeader: params.notificationHeader || 'Board game night prep',
          notificationDetails: params.notificationDetails || 'Need to brush up on how to play Catan at 6 pm this Wednesday before board game night at 8. Ping me at 5 and 5:30 pm.',
          startDate: params.startDate,
          endDate: params.endDate,
          time: params.time,
          isRepeat: params.isRepeat,
          isTextItToMe: params.isTextItToMe,
          notificationTimestamp: params.notificationTimestamp
        }
      });
    } else {
      // User skipped notification creation, go directly to dashboard
      router.push({
        pathname: '/(tabs)',
        params: {
          userMode: 'character',
          characterType: 'character',
          characterName: characterName,
          characterDescription: characterDescription,
          characterVibes: JSON.stringify(selectedVibes),
          characterTagline: characterTagline,
          userAvatarUri: avatarUri || undefined,
          // Pass notification data if available
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
    }
  };

  const togglePublicPrivate = () => {
    if (!isPublic) {
      // Show beta modal when trying to enable public mode
      setShowBetaModal(true);
    } else {
      // Allow disabling without modal
      setIsPublic(false);
    }
  };

  const closeBetaModal = () => {
    setShowBetaModal(false);
  };

  const getAvatarSource = () => {
    if (avatarUri) {
      return { uri: avatarUri };
    }
    return require('../assets/images/20250616_1452_Diverse Character Ensemble_simple_compose_01jxxbhwf0e8qrb67cd6e42xf8.png');
  };

  if (!fontsLoaded) {
    return null;
  }

  // Combine initial vibes with generated vibes
  const allDisplayedVibes = [...initialCharacterVibes, ...generatedVibes];

  // Check if button should be disabled
  const isButtonDisabled = !areRequiredFieldsFilled();

  return (
    <View style={styles.container}>
      {/* Header with Back Button and Private/Public Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#F3CC95" />
          <Text style={styles.backText}>BACK</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.privacyButton,
            isPublic && styles.privacyButtonPublic
          ]}
          onPress={togglePublicPrivate}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.privacyButtonText,
            isPublic && styles.privacyButtonTextPublic
          ]}>
            {isPublic ? 'Public' : 'Private'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title and Subtitle */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Choose your character!</Text>
          <Text style={styles.subtitle}>Let's create your first character!</Text>
          <Text style={styles.disclaimer}>
            At this time, characters cannot represent any real people or offensive caricatures. All users get 3 characters free.
          </Text>
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Text style={styles.sectionLabel}>AVATAR</Text>
          <View style={styles.avatarContainer}>
            <TouchableOpacity 
              style={styles.avatarUpload}
              onPress={handleAvatarUpload}
              activeOpacity={0.7}
            >
              <View style={styles.avatarCircle}>
                {avatarUri ? (
                  <Image 
                    source={{ uri: avatarUri }}
                    style={styles.uploadedAvatar}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.uploadText}>UPLOAD IMAGE</Text>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cameraIcon}
              onPress={handleAvatarUpload}
              activeOpacity={0.7}
            >
              <Camera size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Character Name */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>
            CHARACTER NAME<Text style={styles.asterisk}>*</Text>
          </Text>
          <TextInput
            style={styles.textInput}
            value={characterName}
            onChangeText={setCharacterName}
            placeholder="e.g: Xaden the Destroyer"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
          />
        </View>

        {/* Character Description */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>
            CHARACTER DESCRIPTION<Text style={styles.asterisk}>*</Text>
          </Text>
          <TextInput
            style={[styles.textInput, styles.textInputMultiline]}
            value={characterDescription}
            onChangeText={setCharacterDescription}
            placeholder="Describe the character's personality, sense of humor, how they talk, backstory, age, motivations, quirks, etc.

Give as much description as you can!"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            multiline={true}
            numberOfLines={6}
            textAlignVertical="top"
          />
          {/* Character Counter */}
          <View style={styles.characterCounterContainer}>
            <Text style={styles.characterCounter}>
              <Text style={[
                styles.characterCountNumber,
                characterDescription.length >= 75 && styles.characterCountNumberValid
              ]}>
                {characterDescription.length}
              </Text>
              /75 characters minimum
            </Text>
          </View>
        </View>

        {/* Character Vibes */}
        <View style={styles.vibesSection}>
          <Text style={styles.sectionLabel}>CHARACTER VIBES</Text>
          <View style={styles.vibesGrid}>
            {allDisplayedVibes.map((vibe, index) => (
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
            
            {/* Generate More Button - only show if under limit of 2 clicks */}
            {generateClickCount < 2 && (
              <TouchableOpacity
                style={styles.generateMoreButton}
                onPress={handleGenerateMoreSuggestions}
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
          <Text style={styles.generateMoreLabel}>
            Tap <Image 
              source={require('../assets/images/20250629_2206_Dark Gold Sparkle_simple_compose_01jyzknxm0f04vtfmz59seta4x 1.png')}
              style={styles.sparkleImageInline}
              resizeMode="contain"
            /> to generate more suggestions
          </Text>
        </View>

        {/* Character Tagline */}
        <View style={styles.inputSection}>
          <View style={styles.taglineHeader}>
            <Text style={styles.inputLabel}>CHARACTER TAGLINE</Text>
            <Text style={styles.characterLimit}>75 characters max</Text>
          </View>
          <TextInput
            style={styles.textInput}
            value={characterTagline}
            onChangeText={setCharacterTagline}
            placeholder=""
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            maxLength={75}
          />
        </View>

        {/* Public Toggle */}
        <View style={styles.toggleSection}>
          <TouchableOpacity 
            style={styles.toggleContainer}
            onPress={togglePublicPrivate}
            activeOpacity={0.7}
          >
            <View style={[styles.toggleTrack, isPublic && styles.toggleTrackActive]}>
              <View style={[styles.toggleThumb, isPublic && styles.toggleThumbActive]} />
            </View>
            <Text style={styles.toggleLabel}>Available for other users to select</Text>
          </TouchableOpacity>
        </View>

        {/* Next Step Button */}
        <TouchableOpacity 
          style={[
            styles.nextStepButton,
            isButtonDisabled && styles.nextStepButtonDisabled
          ]}
          onPress={handleNextStep}
          disabled={isButtonDisabled}
          activeOpacity={isButtonDisabled ? 1 : 0.8}
        >
          <Text style={[
            styles.nextStepButtonText,
            isButtonDisabled && styles.nextStepButtonTextDisabled
          ]}>
            Next step
          </Text>
          <ArrowRight 
            size={16} 
            color={isButtonDisabled ? "#9CA3AF" : "#1D1B20"} 
          />
        </TouchableOpacity>
      </ScrollView>

      {/* Photo Upload Modal */}
      <PhotoUploadModal
        visible={showPhotoUploadModal}
        onClose={() => setShowPhotoUploadModal(false)}
        onPhotoSelected={handlePhotoSelected}
      />

      {/* Beta Modal */}
      <Modal
        visible={showBetaModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeBetaModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Public User-Generated Characters Unavailable</Text>
            <Text style={styles.modalMessage}>
              Public character sharing is currently unavailable in beta mode. We're working on it!
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
    backgroundColor: '#19162A',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  privacyButton: {
    backgroundColor: '#6B7280',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 70,
    alignItems: 'center',
  },
  privacyButtonPublic: {
    backgroundColor: '#4A3A7B',
  },
  privacyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  privacyButtonTextPublic: {
    color: '#FFFFFF',
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
    marginBottom: 16,
  },
  disclaimer: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 18,
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
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  avatarUpload: {
    alignItems: 'center',
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  uploadText: {
    fontSize: 12,
    fontWeight: '300',
    color: '#6B7280',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  uploadedAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraIcon: {
    position: 'absolute',
    right: screenWidth / 2 - 60 - 16,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4B5563',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#19162A',
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
  asterisk: {
    color: '#E64646',
  },
  textInput: {
    backgroundColor: 'rgba(60, 60, 67, 0.30)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    lineHeight: 17.5,
    color: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  textInputMultiline: {
    minHeight: 120,
    paddingTop: 12,
  },
  characterCounterContainer: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  characterCounter: {
    fontSize: 10,
    fontFamily: 'Inter',
    fontWeight: '400',
    color: '#9CA3AF',
  },
  characterCountNumber: {
    color: '#E64646',
  },
  characterCountNumberValid: {
    color: '#9CA3AF',
  },
  vibesSection: {
    marginBottom: 32,
  },
  vibesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
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
  generateMoreLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Inter',
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sparkleImageInline: {
    width: 12,
    height: 12,
    marginHorizontal: 2,
  },
  taglineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  characterLimit: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.343)',
    fontFamily: 'Inter',
  },
  toggleSection: {
    marginBottom: 40,
    alignItems: 'flex-start',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleTrack: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleTrackActive: {
    backgroundColor: '#4A3A7B',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  nextStepButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: 160,
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
  },
  nextStepButtonDisabled: {
    backgroundColor: '#6B7280',
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
    color: '#9CA3AF',
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