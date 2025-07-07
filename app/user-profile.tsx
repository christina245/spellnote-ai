import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, Trash2 } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import PhotoUploadModal from '@/components/PhotoUploadModal';

const { width: screenWidth } = Dimensions.get('window');

export default function UserProfile() {
  const [firstName, setFirstName] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('Email@gmail.com');
  const [birthdate, setBirthdate] = useState('MM/DD/YYYY');
  const [receiveMessages, setReceiveMessages] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  const handleBack = () => {
    router.back();
  };

  const handleAvatarUpload = () => {
    setShowPhotoUploadModal(true);
  };

  const handlePhotoSelected = (uri: string) => {
    setAvatarUri(uri);
    setShowPhotoUploadModal(false);
  };

  const handleDisconnectSMS = () => {
    Alert.alert(
      'SMS Integration Unavailable',
      'SMS integration is currently unavailable in beta mode. We\'re working on it!',
      [{ text: 'OK' }]
    );
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = () => {
    setShowDeleteModal(false);
    Alert.alert(
      'Delete Account Unavailable',
      'Account deletion is currently unavailable in beta mode. We\'re working on it!',
      [{ text: 'OK' }]
    );
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const toggleReceiveMessages = () => {
    setReceiveMessages(!receiveMessages);
  };

  const getAvatarSource = () => {
    if (avatarUri) {
      return { uri: avatarUri };
    }
    // Default avatar placeholder
    return require('../assets/images/placeholder-profile-icon-8qmjk1094ijhbem9 copy.png');
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
        
        <Text style={styles.title}>Edit profile</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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

        {/* Your Name Section */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>YOUR NAME</Text>
          <TextInput
            style={styles.textInput}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="First Name"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
          />
        </View>

        {/* Bio Section */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>BIO</Text>
          <TextInput
            style={[styles.textInput, styles.textInputMultiline]}
            value={bio}
            onChangeText={setBio}
            placeholder="Enter details you'd like your characters to know about you! They might bring this up in their messages."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Email Section */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>
            EMAIL<Text style={styles.asterisk}>*</Text>
          </Text>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            placeholder="Email@gmail.com"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Birthdate Section */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>BIRTHDATE</Text>
          <View style={styles.birthdateContainer}>
            <TextInput
              style={[styles.textInput, styles.birthdateInput]}
              value={birthdate}
              onChangeText={setBirthdate}
              placeholder="MM/DD/YYYY"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
            <View style={styles.birthdateToggleContainer}>
              <TouchableOpacity 
                style={styles.birthdateToggle}
                onPress={toggleReceiveMessages}
                activeOpacity={0.7}
              >
                <View style={[styles.toggleTrack, receiveMessages && styles.toggleTrackActive]}>
                  <View style={[styles.toggleThumb, receiveMessages && styles.toggleThumbActive]} />
                </View>
              </TouchableOpacity>
              <Text style={styles.birthdateToggleText}>
                Receive birthday messages{'\n'}from all active characters 🎂
              </Text>
            </View>
          </View>
        </View>

        {/* SMS Integration Section */}
        <View style={styles.smsSection}>
          <Text style={styles.sectionLabel}>SMS INTEGRATION</Text>
          <View style={styles.smsContainer}>
            <Text style={styles.smsPhoneNumber}>+X 555-123-4567</Text>
            <Text style={styles.smsDescription}>
              If you change your phone number, we'll have you enter a verification code sent to that number.
            </Text>
            <TouchableOpacity 
              style={styles.disconnectButton}
              onPress={handleDisconnectSMS}
              activeOpacity={0.8}
            >
              <Text style={styles.disconnectButtonText}>DISCONNECT</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Language Section */}
        <View style={styles.languageSection}>
          <Text style={styles.inputLabel}>
            LANGUAGE<Text style={styles.asterisk}>*</Text>
          </Text>
          <View style={styles.languageContainer}>
            <Text style={styles.languageText}>Beta only available in English (US) 🇺🇸</Text>
          </View>
        </View>

        {/* Delete Account Button */}
        <View style={styles.deleteButtonContainer}>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
            activeOpacity={0.8}
          >
            <Trash2 size={16} color="#EF4444" />
            <Text style={styles.deleteButtonText}>DELETE ACCOUNT</Text>
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
            <Text style={styles.modalTitle}>Delete Account?</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
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
                onPress={confirmDeleteAccount}
                activeOpacity={0.8}
              >
                <Text style={styles.modalDeleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
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
    alignItems: 'flex-start',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F3CC95',
    fontFamily: 'Inter',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 36,
    letterSpacing: -0.28,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
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
    minHeight: 100,
    paddingTop: 12,
  },
  birthdateContainer: {
    gap: 16,
  },
  birthdateInput: {
    marginBottom: 0,
  },
  birthdateToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  birthdateToggle: {
    // Toggle button styling
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
  birthdateToggleText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    lineHeight: 18,
    flex: 1,
  },
  smsSection: {
    marginBottom: 32,
  },
  smsContainer: {
    gap: 12,
  },
  smsPhoneNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    textDecorationLine: 'underline',
  },
  smsDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Inter',
    lineHeight: 18,
  },
  disconnectButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  disconnectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
    fontFamily: 'Inter',
    letterSpacing: 0.5,
  },
  languageSection: {
    marginBottom: 40,
  },
  languageContainer: {
    backgroundColor: 'rgba(60, 60, 67, 0.30)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  languageText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Inter',
    lineHeight: 17.5,
  },
  deleteButtonContainer: {
    alignItems: 'center',
    marginBottom: 32,
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
    minWidth: 200,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    fontFamily: 'Inter',
    letterSpacing: 0.5,
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
});