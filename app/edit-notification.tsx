import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Platform,
  Modal,
  Image,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Calendar, Clock } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import Svg, { Circle, Path } from 'react-native-svg';
import DatePickerModal from '@/components/DatePickerModal';
import TimePickerModal from '@/components/TimePickerModal';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Character {
  id: string;
  name: string;
  type: 'character' | 'spellbot' | 'ai-free' | 'empty';
  avatarSource: any;
  isEmpty: boolean;
  isSelected?: boolean;
}

export default function EditNotification() {
  const [header, setHeader] = useState('');
  const [details, setDetails] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');
  const [isRepeat, setIsRepeat] = useState(false);
  const [isTextItToMe, setIsTextItToMe] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [sendWithoutAI, setSendWithoutAI] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState<{
    header: string;
    details: string;
    startDate: number | null;
    endDate: number | null;
    time: string;
    isRepeat: boolean;
    isTextItToMe: boolean;
    selectedCharacterId: string | null;
    sendWithoutAI: boolean;
  } | null>(null);
  const router = useRouter();
  const params = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  useEffect(() => {
    // Load notification data from params for editing
    const initialHeader = (params.notificationHeader as string) || 'Board game night prep';
    const initialDetails = (params.notificationDetails as string) || 'Need to brush up on how to play Catan at 6 pm this Wednesday before board game night at 8. Ping me at 5 and 5:30 pm.';
    const initialTime = (params.notificationTime as string) || '6:30 PM';
    const initialStartDate = params.startDate ? new Date(params.startDate as string) : null;
    const initialEndDate = params.endDate ? new Date(params.endDate as string) : null;
    const initialIsRepeat = false; // Always start unchecked
    const initialIsTextItToMe = params.isTextItToMe === 'true';
    
    // Always set the values (with fallbacks if params are empty)
    setHeader(initialHeader);
    setDetails(initialDetails);
    setTime(initialTime);
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    setIsRepeat(initialIsRepeat);
    setIsTextItToMe(initialIsTextItToMe);

    // Store original data for change detection
    const originalDataToStore = {
      header: initialHeader,
      details: initialDetails,
      startDate: initialStartDate?.getTime() || null,
      endDate: initialEndDate?.getTime() || null,
      time: initialTime,
      isRepeat: initialIsRepeat,
      isTextItToMe: initialIsTextItToMe,
      selectedCharacterId: 'muffin-2', // Default selected character
      sendWithoutAI: false // Always start unchecked
    };
    
    setOriginalData(originalDataToStore);

    // Load user's characters
    loadUserCharacters();
  }, [params]);

  // Check for changes whenever any field updates
  const checkForChanges = () => {
    if (!originalData) return;
    
    const currentData = {
      header,
      details,
      startDate: startDate?.getTime() || null,
      endDate: endDate?.getTime() || null,
      time,
      isRepeat,
      isTextItToMe,
      selectedCharacterId,
      sendWithoutAI
    };

    const hasAnyChanges = 
      currentData.header !== originalData.header ||
      currentData.details !== originalData.details ||
      currentData.startDate !== originalData.startDate ||
      currentData.endDate !== originalData.endDate ||
      currentData.time !== originalData.time ||
      currentData.isRepeat !== originalData.isRepeat ||
      currentData.isTextItToMe !== originalData.isTextItToMe ||
      currentData.selectedCharacterId !== originalData.selectedCharacterId ||
      currentData.sendWithoutAI !== originalData.sendWithoutAI;

    setHasChanges(hasAnyChanges);
  };

  // Use useEffect to check for changes, but with proper dependencies
  useEffect(() => {
    checkForChanges();
  }, [header, details, startDate, endDate, time, isRepeat, isTextItToMe, selectedCharacterId, sendWithoutAI]);

  const loadUserCharacters = () => {
    // Create characters with Muffin in the middle (selected), empty slots on left and right
    const userCharacters: Character[] = [
      {
        id: 'empty-1',
        name: 'Add character',
        type: 'empty',
        avatarSource: null,
        isEmpty: true,
        isSelected: false
      },
      {
        id: 'muffin-2',
        name: 'Muffin',
        type: 'character',
        avatarSource: require('../assets/images/pink bunny.jpg'),
        isEmpty: false,
        isSelected: true // Muffin is selected by default (middle character)
      },
      {
        id: 'empty-3',
        name: 'Add character',
        type: 'empty',
        avatarSource: null,
        isEmpty: true,
        isSelected: false
      }
    ];

    setCharacters(userCharacters);
    setSelectedCharacterId('muffin-2'); // Set Muffin as selected
  };

  const handleBack = () => {
    router.back();
  };

  const handleDuplicate = () => {
    setShowDuplicateModal(true);
  };

  const handleSaveNotification = () => {
    // Check if form is complete before proceeding
    if (!canSaveNotification()) {
      Alert.alert('Required Fields', 'Please fill in all required fields before saving.');
      return;
    }

    // Show success message and navigate back
    Alert.alert(
      'Notification Updated',
      'Your notification has been updated successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            router.back();
          }
        }
      ]
    );
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'DD/MM/YYYY';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleStartDateConfirm = (date: Date) => {
    setStartDate(date);
    setShowStartDatePicker(false);
  };

  const handleEndDateConfirm = (date: Date) => {
    setEndDate(date);
    setShowEndDatePicker(false);
  };

  const handleTimeConfirm = (selectedTime: string) => {
    setTime(selectedTime);
    setShowTimePicker(false);
  };

  const handleTextItToMeToggle = () => {
    if (!isTextItToMe) {
      setShowSMSModal(true);
    } else {
      setIsTextItToMe(false);
    }
  };

  const handleCharacterSelect = (characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    if (character) {
      if (character.isEmpty) {
        // Handle empty slot press - could navigate to character creation
        Alert.alert('Add Character', 'Character creation functionality will be implemented');
        return;
      }
      
      setSelectedCharacterId(characterId);
      // Update character selection state
      setCharacters(prev => prev.map(char => ({
        ...char,
        isSelected: char.id === characterId
      })));
    }
  };

  const closeSMSModal = () => {
    setShowSMSModal(false);
  };

  const closeDuplicateModal = () => {
    setShowDuplicateModal(false);
  };

  // Check if all required fields are filled for Save button
  const canSaveNotification = () => {
    return details.trim() !== '' && 
           startDate !== null && 
           time.trim() !== '' && 
           selectedCharacterId !== null;
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
        
        <Text style={styles.title}>Edit notification</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>HEADER</Text>
          <TextInput
            style={[
              styles.headerInput,
              header.length > 0 && styles.headerInputWithText
            ]}
            value={header}
            onChangeText={setHeader}
            placeholder="Notification header"
            placeholderTextColor="rgba(255, 255, 255, 0.50)"
            multiline={false}
            autoFocus={false}
            blurOnSubmit={false}
            returnKeyType="done"
            clearButtonMode="while-editing"
          />
        </View>

        {/* Details Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>DETAILS</Text>
          <TextInput
            style={[styles.textInput, styles.textInputMultiline]}
            value={details}
            onChangeText={setDetails}
            placeholder="What do you need to remember? E.g: study habits to try, a new store you want to visit, etiquette for a certain event you keep forgetting, etc."
            placeholderTextColor="rgba(255, 255, 255, 0.50)"
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={1000}
            autoFocus={false}
            blurOnSubmit={false}
            scrollEnabled={true}
          />
        </View>

        {/* Time to Send Section */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>TIME TO SEND</Text>
          
          {/* Start Date */}
          <View style={styles.dateTimeRow}>
            <View style={styles.dateTimeField}>
              <Text style={styles.dateTimeLabel}>START DATE</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowStartDatePicker(true)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.datePickerText,
                  !startDate && styles.placeholderDateText
                ]}>
                  {formatDate(startDate)}
                </Text>
                <Calendar size={16} color="#8DD3C8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* End Date */}
          <View style={styles.dateTimeRow}>
            <View style={styles.dateTimeField}>
              <Text style={styles.dateTimeLabel}>END DATE</Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={() => setShowEndDatePicker(true)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.datePickerText,
                  !endDate && styles.placeholderDateText
                ]}>
                  {formatDate(endDate)}
                </Text>
                <Calendar size={16} color="#8DD3C8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Time */}
          <View style={styles.dateTimeRow}>
            <View style={styles.dateTimeField}>
              <Text style={styles.dateTimeLabel}>TIME</Text>
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => setShowTimePicker(true)}
                activeOpacity={0.7}
              >
                <Text style={[styles.timePickerText, !time && styles.placeholderText]}>
                  {time || "8:30 PM"}
                </Text>
                <Clock size={16} color="#8DD3C8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Repeat Checkbox with additional times */}
          <View style={styles.checkboxSection}>
            <TouchableOpacity 
              style={styles.checkbox}
              onPress={() => setIsRepeat(!isRepeat)}
              activeOpacity={0.7}
            >
              <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <Circle cx="10" cy="10" r="10" fill="#F0F3FB"/>
                {isRepeat && (
                  <Path 
                    d="M5.49994 9.5L8.99994 13L14.4999 7.5" 
                    stroke="#4A3A7B" 
                    strokeWidth="1.5"
                  />
                )}
              </Svg>
              <Text style={styles.checkboxLabel}>Repeat</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Text it to me Toggle */}
        <View style={styles.toggleSection}>
          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={handleTextItToMeToggle}
            activeOpacity={0.8}
          >
            <View style={[styles.toggleTrack, isTextItToMe && styles.toggleTrackActive]}>
              <View style={[styles.toggleThumb, isTextItToMe && styles.toggleThumbActive]} />
            </View>
            <Text style={styles.toggleLabel}>Text it to me!</Text>
          </TouchableOpacity>
        </View>

        {/* Character Selection Section */}
        <View style={styles.characterSection}>
          <Text style={styles.sectionLabel}>CHARACTER</Text>
          
          <View style={styles.characterSlots}>
            {characters.map((character) => (
              <TouchableOpacity
                key={character.id}
                style={styles.characterSlot}
                onPress={() => handleCharacterSelect(character.id)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.characterAvatarContainer,
                  character.isSelected && !character.isEmpty && styles.selectedCharacterAvatar,
                  character.isEmpty && styles.emptyCharacterSlot
                ]}>
                  {character.isEmpty ? (
                    <Text style={styles.addCharacterText}>+</Text>
                  ) : (
                    <Image 
                      source={character.avatarSource}
                      style={styles.characterAvatar}
                      resizeMode="cover"
                    />
                  )}
                </View>
                <Text style={[
                  styles.characterName,
                  character.isSelected && !character.isEmpty && styles.characterNameSelected,
                  character.isEmpty && styles.characterNameEmpty
                ]}>
                  {character.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Send without AI Checkbox */}
        <View style={styles.aiCheckboxSection}>
          <TouchableOpacity 
            style={styles.aiCheckbox}
            onPress={() => setSendWithoutAI(!sendWithoutAI)}
            activeOpacity={0.7}
          >
            <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <Circle cx="10" cy="10" r="10" fill="#F0F3FB"/>
              {sendWithoutAI && (
                <Path 
                  d="M5.49994 9.5L8.99994 13L14.4999 7.5" 
                  stroke="#4A3A7B" 
                  strokeWidth="1.5"
                />
              )}
            </Svg>
            <Text style={styles.aiCheckboxLabel}>Send without AI</Text>
          </TouchableOpacity>
          <Text style={styles.aiCheckboxDescription}>
            Selecting this option will have your note delivered exactly as you've written it without AI modification. Your character's name and avatar will be switched with the app name and logo.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          {/* Duplicate Button */}
          <TouchableOpacity 
            style={styles.duplicateButton}
            onPress={handleDuplicate}
            activeOpacity={0.8}
          >
            <Text style={styles.duplicateButtonText}>DUPLICATE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Custom Date Picker Modals */}
      <DatePickerModal
        visible={showStartDatePicker}
        onClose={() => setShowStartDatePicker(false)}
        onCancel={() => setShowStartDatePicker(false)}
        onConfirm={handleStartDateConfirm}
        initialDate={startDate || new Date()}
        title="Select start date"
      />

      <DatePickerModal
        visible={showEndDatePicker}
        onClose={() => setShowEndDatePicker(false)}
        onCancel={() => setShowEndDatePicker(false)}
        onConfirm={handleEndDateConfirm}
        initialDate={endDate || new Date()}
        title="Select end date"
      />

      {/* Custom Time Picker Modal */}
      <TimePickerModal
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        onCancel={() => setShowTimePicker(false)}
        onConfirm={handleTimeConfirm}
        initialTime={time || "8:30 PM"}
        title="Select time"
      />

      {/* SMS Unavailable Modal */}
      <Modal
        visible={showSMSModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeSMSModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>SMS Mode Unavailable</Text>
            <Text style={styles.modalMessage}>
              SMS mode is currently unavailable in beta. We're working on it!
            </Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={closeSMSModal}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Duplicate Unavailable Modal */}
      <Modal
        visible={showDuplicateModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeDuplicateModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Duplicate Unavailable</Text>
            <Text style={styles.modalMessage}>
              Duplicate functionality is currently unavailable in beta. We're working on it!
            </Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={closeDuplicateModal}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Floating Save Changes Button - Only show when changes are made */}
      {hasChanges && (
        <View style={styles.floatingSaveContainer}>
          <TouchableOpacity 
            style={styles.floatingSaveButton}
            onPress={handleSaveNotification}
            activeOpacity={0.8}
          >
            <Text style={styles.floatingSaveButtonText}>Save changes</Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingHorizontal: Math.max(38, screenWidth * 0.097),
    paddingBottom: 20,
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
    paddingHorizontal: Math.max(38, screenWidth * 0.097),
    paddingBottom: 40,
  },
  fieldGroup: {
    marginBottom: 24,
  },
  fieldLabel: {
    color: '#8DD3C8',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 17.5,
    letterSpacing: 0.7,
    marginBottom: 8,
  },
  headerInput: {
    backgroundColor: 'rgba(60, 60, 67, 0.30)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: Math.max(8, 12),
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '600',
    lineHeight: 17.5,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.02)',
    outlineStyle: 'none', // Remove web outline
  },
  textInput: {
    backgroundColor: 'rgba(60, 60, 67, 0.30)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: Math.max(8, 12),
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    lineHeight: 17.5,
    color: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.02)',
    outlineStyle: 'none', // Remove web outline
  },
  textInputMultiline: {
    minHeight: 80,
    paddingTop: Math.max(8, 12),
    textAlignVertical: 'top',
  },
  sectionGroup: {
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
  dateTimeRow: {
    marginBottom: 16,
  },
  dateTimeField: {
    flex: 1,
  },
  dateTimeLabel: {
    color: '#E1B8B2',
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 17.5,
    letterSpacing: 0.7,
    marginBottom: 8,
  },
  datePickerButton: {
    backgroundColor: 'rgba(60, 60, 67, 0.30)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: Math.max(8, 12),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.02)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePickerText: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    lineHeight: 17.5,
    color: '#FFF',
  },
  placeholderDateText: {
    color: 'rgba(255, 255, 255, 0.50)',
  },
  timePickerButton: {
    backgroundColor: 'rgba(60, 60, 67, 0.30)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: Math.max(8, 12),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.02)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timePickerText: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    lineHeight: 17.5,
    color: '#FFF',
  },
  placeholderText: {
    color: 'rgba(255, 255, 255, 0.50)',
  },
  checkboxSection: {
    marginTop: 8,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  toggleSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleTrack: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.50)',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleTrackActive: {
    backgroundColor: '#8B5CF6',
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
  characterSection: {
    marginBottom: 32,
  },
  characterSlots: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  characterSlot: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  characterAvatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedCharacterAvatar: {
    borderColor: '#8DD3C8', // Mint green border for selected character
    borderStyle: 'solid',
  },
  emptyCharacterSlot: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
    borderStyle: 'dashed',
  },
  addCharacterText: {
    fontSize: 32,
    fontWeight: '300',
    color: '#9CA3AF',
    fontFamily: 'Inter',
  },
  characterAvatar: {
    width: 74, // Slightly smaller to account for thicker border
    height: 74,
    borderRadius: 37,
  },
  characterName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  characterNameSelected: {
    color: '#8DD3C8', // Mint green text for selected character
    fontWeight: '600',
  },
  characterNameEmpty: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9CA3AF',
  },
  aiCheckboxSection: {
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  aiCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  aiCheckboxLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  aiCheckboxDescription: {
    fontSize: 12,
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.70)',
    fontFamily: 'Inter',
    lineHeight: 16,
    paddingLeft: 32,
  },
  actionButtonsContainer: {
    gap: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  duplicateButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    minWidth: 160,
  },
  duplicateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A78BFA',
    fontFamily: 'Inter',
    letterSpacing: 0.5,
  },
  // Floating Save Button Styles
  floatingSaveContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 10,
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
  floatingSaveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1830',
    fontFamily: 'Inter',
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