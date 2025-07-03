import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
  Modal
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Camera, Trash2 } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import PhotoUploadModal from '@/components/PhotoUploadModal';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CharacterProfile() {
  const [characterName, setCharacterName] = useState('');
  const [characterDescription, setCharacterDescription] = useState('');
  const [characterTagline, setCharacterTagline] = useState('');
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBetaModal, setShowBetaModal] = useState(false);
  const [betaModalType, setBetaModalType] = useState<'public' | 'avatar'>('public');
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  const allVibeOptions = [
    'bubbly', 'mellow', 'witty', 'fiery', 'stern', 'brooding',
    'dramatic', 'sassy', 'derpy', 'deadpan', 'eccentric', 'practical',
    'mysterious', 'cheerful', 'grumpy', 'wise', 'playful', 'serious',
    'optimistic', 'cynical', 'energetic', 'calm', 'rebellious', 'loyal'
  ];

  useEffect(() => {
    // Populate form with character data from params
    setCharacterName(params.characterName as string || '');
    setCharacterDescription(params.characterDescription as string || '');
    setCharacterTagline(params.characterTagline as string || '');
    
    // Parse character vibes if available
    if (params.characterVibes) {
      try {
        const vibes = JSON.parse(params.characterVibes as string);
        setSelectedVibes(vibes);
      } catch (error) {
        console.log('Error parsing character vibes:', error);
      }
    }

    // Check if user has uploaded avatar
    if (params.userAvatarUri) {
      setAvatarUri(params.userAvatarUri as string);
    }
  }, [params]);

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

  const handleSaveChanges = () => {
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

    Alert.alert(
      'Changes Saved',
      'Your character has been updated successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to home with updated character data
            router.push({
              pathname: '/(tabs)',
              params: {
                userMode: 'character',
                characterType: 'character',
                characterName: characterName,
                characterDescription: characterDescription,
                characterTagline: characterTagline,
                characterVibes: JSON.stringify(selectedVibes),
                userAvatarUri: avatarUri || undefined
              }
            });
          }
        }
      ]
    );
  };

  const handleDeleteCharacter = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteCharacter = () => {
    setShowDeleteModal(false);
    Alert.alert(
      'Character Deleted',
      'Your character has been deleted successfully.',
      [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to home with character deleted flag
            router.push({
              pathname: '/(tabs)',
              params: {
                characterDeleted: 'true'
              }
            });
          }
        }
      ]
    );
  };

  const togglePublicPrivate = () => {
    if (!isPublic) {
      setBetaModalType('public');
      setShowBetaModal(true);
    } else {
      setIsPublic(false);
    }
  };

  const closeBetaModal = () => {
    setShowBetaModal(false);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const getAvatarSource = () => {
    if (avatarUri) {
      return { uri: avatarUri };
    }
    if (params.userAvatarUri) {
      return { uri: params.userAvatarUri as string };
    }
    return require('../assets/images/20250616_1452_Diverse Character Ensemble_simple_compose_01jxxbhwf0e8qrb67cd6e42xf8.png');
  };

  // Check if all required fields are filled for Save button
  const canSaveChanges = () => {
    return characterName.trim() !== '' && 
           characterDescription.trim() !== '' && 
           characterDescription.length >= 75;
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header with Back Button and Privacy Toggle */}
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
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Character Profile</Text>
          <Text style={styles.subtitle}>Edit your character's details</Text>
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
            {allVibeOptions.map((vibe, index) => (
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
          </View>
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
            placeholder="A brief tagline for your character"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            maxLength={75}
          />
        </View>

        {/* CRITICAL: Delete Character Button - ALWAYS positioned below all content */}
        <View style={styles.deleteButtonContainer}>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDeleteCharacter}
            activeOpacity={0.8}
          >
            <Trash2 size={16} color="#EF4444" />
            <Text style={styles.deleteButtonText}>Delete Character</Text>
          </TouchableOpacity>
        </View>

        {/* Extra spacing to ensure delete button is never covered by floating save button */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* CRITICAL: Floating Save Button - ALWAYS positioned above delete button */}
      <View style={styles.floatingSaveContainer}>
        <TouchableOpacity 
          style={[
            styles.floatingSaveButton,
            !canSaveChanges() && styles.floatingSaveButtonDisabled
          ]}
          onPress={handleSaveChanges}
          disabled={!canSaveChanges()}
          activeOpacity={canSaveChanges() ? 0.8 : 1}
        >
          <Text style={[
            styles.floatingSaveButtonText,
            !canSaveChanges() && styles.floatingSaveButtonTextDisabled
          ]}>
            Save Changes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Photo Upload Modal */}
      <PhotoUploadModal
        visible={showPhotoUploadModal}
        onClose={() => setShowPhotoUploadModal(false)}
        onPhotoSelected={handlePhotoSelected}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeDeleteModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Delete Character?</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete this character? This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={closeDeleteModal}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalDeleteButton}
                onPress={confirmDeleteCharacter}
                activeOpacity={0.8}
              >
                <Text style={styles.modalDeleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Beta Feature Modal */}
      <Modal
        visible={showBetaModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeBetaModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {betaModalType === 'public' ? 'Public Characters Unavailable' : 'Avatar Upload Unavailable'}
            </Text>
            <Text style={styles.modalMessage}>
              {betaModalType === 'public' 
                ? 'Public character sharing is currently unavailable in beta mode. We\'re working on it!'
                : 'Avatar upload is currently unavailable in beta mode. We\'re working on it!'
              }
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
  // CRITICAL: Delete button container - positioned at the very bottom of content
  deleteButtonContainer: {
    marginTop: 40, // Extra space above delete button
    marginBottom: 32, // Space below delete button
    paddingHorizontal: 40, // UPDATED: Maximum 40px padding on left and right
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    width: '100%', // Full width within the container (which now has 40px padding)
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    fontFamily: 'Inter',
  },
  // CRITICAL: Extra spacing to ensure delete button is never covered by floating save
  bottomSpacing: {
    height: 120, // Generous spacing to ensure delete button is always visible above floating save
  },
  // CRITICAL: Floating save container - positioned above delete button
  floatingSaveContainer: {
    position: 'absolute',
    bottom: 40, // Fixed distance from bottom
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 10, // Ensure it floats above content
  },
  floatingSaveButton: {
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
  floatingSaveButtonDisabled: {
    backgroundColor: '#6B7280',
    shadowOpacity: 0,
    elevation: 0,
  },
  floatingSaveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1830',
    fontFamily: 'Inter',
  },
  floatingSaveButtonTextDisabled: {
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
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    fontFamily: 'Inter',
  },
  modalDeleteButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalDeleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
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