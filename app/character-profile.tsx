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
        // Set default vibes based on character name if parsing fails
        if (params.characterName === 'ARIA') {
          setSelectedVibes(['practical', 'deadpan', 'systematic']);
        } else if (params.characterName === 'Muffin the fluffy bunny') {
          setSelectedVibes(['bubbly', 'gentle', 'caring']);
        }
      }
    } else {
      // Set default vibes based on character name if no vibes provided
      if (params.characterName === 'ARIA') {
        setSelectedVibes(['practical', 'deadpan', 'systematic']);
      } else if (params.characterName === 'Muffin the fluffy bunny') {
        setSelectedVibes(['bubbly', 'gentle', 'caring']);
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
    
    // Handle specific character names with their correct avatars
    const characterName = params.characterName as string;
    if (characterName === 'ARIA') {
      return require('../assets/images/20250706_1541_Futuristic Spacecraft Cockpit_simple_compose_01jzgyc3yserjtsrq38jpjn75t copy copy.png');
    } else if (characterName === 'Muffin the fluffy bunny') {
      return require('../assets/images/pink bunny copy.jpg');
    }
    
    // Check if user has uploaded avatar from params
    if (params.userAvatarUri) {
      return { uri: params.userAvatarUri as string };
    }
    
    // Default fallback
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
          <Text style={styles.readOnlyTextDescription}>{characterDescription}</Text>
        </View>

        {/* Character Vibes */}
        <View style={styles.vibesSection}>
          <Text style={styles.sectionLabel}>CHARACTER VIBES</Text>
          <View style={styles.vibesGrid}>
            {selectedVibes.length > 0 && selectedVibes.map((vibe: string, index: number) => (
              <View
                key={`${vibe}-${index}`}
                style={[
                  styles.vibeButtonSelected
                ]}
              >
                <Text style={[
                  styles.vibeButtonTextSelected
                ]}>
                  {vibe}
                </Text>
              </View>
            ))}
          </View>
              {/* Add "robotic" vibe for ARIA */}
              {params.characterName === 'ARIA' && (
                <View style={styles.vibeButtonSelected}>
                  <Text style={styles.vibeButtonTextSelected}>
                    robotic
                  </Text>
                </View>
              )}
        </View>

        {/* Character Tagline */}
        <View style={styles.inputSection}>
          <View style={styles.taglineHeader}>
            <Text style={styles.inputLabel}>CHARACTER TAGLINE</Text>
          </View>
          <Text style={styles.readOnlyText}>{characterTagline || 'No tagline set'}</Text>
        </View>

        {/* Delete Character Button */}
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

        {/* Extra spacing for bottom padding */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

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
  taglineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deleteButtonContainer: {
    marginTop: 40,
    marginBottom: 32,
    paddingHorizontal: 40,
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
    width: '100%',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    fontFamily: 'Inter',
  },
  bottomSpacing: {
    height: 40,
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