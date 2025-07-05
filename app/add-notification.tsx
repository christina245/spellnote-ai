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
  isLastUsed?: boolean;
}

export default function AddNotification() {
  const [header, setHeader] = useState('');
  const [details, setDetails] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');
  const [isRepeat, setIsRepeat] = useState(false);
  const [isTextItToMe, setIsTextItToMe] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [sendWithoutAI, setSendWithoutAI] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const router = useRouter();
  const params = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  useEffect(() => {
    // Extract specific values from params to avoid infinite re-renders
    const userMode = params.userMode as string;
    const characterType = params.characterType as string;
    const characterName = params.characterName as string;
    const userAvatarUri = params.userAvatarUri as string;
    const charactersParam = params.characters as string;
    const activeCharacterIdParam = params.activeCharacterId as string;
    const selectedDateParam = params.selectedDate as string;

    // Set initial date from selected date if provided
    if (selectedDateParam) {
      try {
        const parsedDate = new Date(selectedDateParam);
        if (!isNaN(parsedDate.getTime())) {
          setStartDate(parsedDate);
        }
      } catch (error) {
        console.log('Error parsing selected date:', error);
      }
    }

    // Load user's characters dynamically based on their saved data
    const loadUserCharacters = () => {
      let userCharacters: Character[] = [];

      // Try to parse characters from params first
      if (charactersParam) {
        try {
          const parsedCharacters = JSON.parse(charactersParam);
          userCharacters = parsedCharacters.map((char: any) => ({
            id: char.id,
            name: char.name,
            type: char.type,
            avatarSource: char.avatarSource,
            isEmpty: false,
            isLastUsed: char.id === activeCharacterIdParam
          }));
        } catch (error) {
          console.log('Error parsing characters:', error);
        }
      }

      // If no characters parsed, create default structure
      if (userCharacters.length === 0) {
        userCharacters = [
          // First slot - empty
          {
            id: 'empty-0',
            name: 'Add character',
            type: 'empty',
            avatarSource: null,
            isEmpty: true
          },
          // Second slot - user's main character (last used)
          {
            id: activeCharacterIdParam || 'character-1',
            name: characterName || (characterType === 'spellbot' ? 'Spellbot' : 'Character Name'),
            type: (characterType as 'character' | 'spellbot' | 'ai-free') || 'character',
            avatarSource: userAvatarUri 
              ? { uri: userAvatarUri }
              : (characterType === 'spellbot' 
                ? require('../assets/images/square logo 2.png')
                : characterType === 'ai-free'
                ? require('../assets/images/20250629_2006_No AI Symbol_simple_compose_01jyzcradxfyjrsjerpkw5regx 2.png')
                : require('../assets/images/20250616_1452_Diverse Character Ensemble_simple_compose_01jxxbhwf0e8qrb67cd6e42xf8.png')
              ),
            isEmpty: false,
            isLastUsed: true
          },
          // Third slot - empty
          {
            id: 'empty-2',
            name: 'Add character',
            type: 'empty',
            avatarSource: null,
            isEmpty: true
          }
        ];
      }

      // Ensure we have exactly 3 slots
      while (userCharacters.length < 3) {
        userCharacters.push({
          id: `empty-${userCharacters.length}`,
          name: 'Add character',
          type: 'empty',
          avatarSource: null,
          isEmpty: true
        });
      }

      setCharacters(userCharacters.slice(0, 3)); // Limit to 3 slots
      
      // Set the last used character as selected by default
      const lastUsedCharacter = userCharacters.find(char => char.isLastUsed && !char.isEmpty);
      if (lastUsedCharacter) {
        setSelectedCharacterId(lastUsedCharacter.id);
      }
    };

    loadUserCharacters();
  }, [
    // Only depend on specific string values, not the entire params object
    params.userMode,
    params.characterType,
    params.characterName,
    params.userAvatarUri,
    params.characters,
    params.activeCharacterId,
    params.selectedDate
  ]);

  const handleBack = () => {
    router.back();
  };

  const handleDuplicate = () => {
    // Show beta modal for duplicate functionality
    setShowDuplicateModal(true);
  };

  const handleSaveNotification = () => {
    // Check if form is complete before proceeding
    if (!canSaveNotification()) {
      Alert.alert('Required Fields', 'Please fill in all required fields before saving.');
      return;
    }

    // Show success message and navigate back to home
    Alert.alert(
      'Notification Saved',
      'Your notification has been saved successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to home with the new notification data
            // Use a unique timestamp to ensure each notification is treated as new
            const timestamp = Date.now();
            router.push({
              pathname: '/(tabs)',
              params: {
                // Pass the notification data to be displayed on homepage
                newNotificationHeader: header.trim() || 'New Reminder',
                newNotificationDetails: details.trim(),
                newNotificationTime: time,
                newNotificationDate: startDate?.toISOString(),
                selectedCharacterId: selectedCharacterId?.toString(),
                sendWithoutAI: sendWithoutAI.toString(),
                // Add timestamp to ensure uniqueness
                notificationTimestamp: timestamp.toString()
              }
            });
          }
        }
      ]
    );
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'MM/DD/YYYY';
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
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
      // Show modal when trying to enable SMS
      setShowSMSModal(true);
    } else {
      // Allow disabling without modal
      setIsTextItToMe(false);
    }
  };

  const handleCharacterSelect = (characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    if (character && !character.isEmpty) {
      setSelectedCharacterId(characterId);
    }
  };

  const closeSMSModal = () => {
    setShowSMSModal(false);
  };

  const closeDuplicateModal = () => {
    setShowDuplicateModal(false);
  };

  const getSelectedCharacter = () => {
    return characters.find(char => char.id === selectedCharacterId);
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
        
        <Text style={styles.title}>New notification</Text>
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
          />
        </View>

        {/* Details Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>
            DETAILS<Text style={styles.asterisk}>*</Text>
          </Text>
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
          />
          {details.length > 0 && (
            <Text style={styles.characterCount}>
              {details.length}/75 characters minimum
            </Text>
          )}
        </View>

        {/* Time to Send Section */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>TIME TO SEND</Text>
          
          {/* Start Date */}
          <View style={styles.dateTimeRow}>
            <View style={styles.dateTimeField}>
              <Text style={styles.dateTimeLabel}>
                START DATE<Text style={styles.asterisk}>*</Text>
              </Text>
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
              <Text style={styles.dateTimeLabel}>
                TIME<Text style={styles.asterisk}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => setShowTimePicker(true)}
                activeOpacity={0.7}
              >
                <Text style={[styles.timePickerText, !time && styles.placeholderText]}>
                  {time || "6:30 PM"}
                </Text>
                <Clock size={16} color="#8DD3C8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Repeat Checkbox */}
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
                style={[
                  styles.characterSlot,
                  selectedCharacterId === character.id && !character.isEmpty && styles.characterSlotSelected
                ]}
                onPress={() => handleCharacterSelect(character.id)}
                activeOpacity={character.isEmpty ? 1 : 0.7}
                disabled={character.isEmpty}
              >
                <View style={[
                  styles.characterAvatarContainer,
                  character.isEmpty && styles.emptyCharacterSlot,
                  selectedCharacterId === character.id && !character.isEmpty && styles.selectedCharacterAvatar
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
                  character.isEmpty && styles.characterNameEmpty,
                  selectedCharacterId === character.id && !character.isEmpty && styles.characterNameSelected
                ]}>
                  {character.name}
                </Text>
              </TouchableOpacity>
            ))}
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
              Selecting this option will have your note delivered exactly as you've written it without AI modification. Your character's name and avatar will still be visible.
            </Text>
          </View>
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

        {/* Extra spacing for floating button */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Save Notification Button */}
      <View style={styles.floatingSaveContainer}>
        <TouchableOpacity 
          style={[
            styles.floatingSaveButton,
            !canSaveNotification() && styles.floatingSaveButtonDisabled
          ]}
          onPress={handleSaveNotification}
          disabled={!canSaveNotification()}
          activeOpacity={canSaveNotification() ? 0.8 : 1}
        >
          <Text style={[
            styles.floatingSaveButtonText,
            !canSaveNotification() && styles.floatingSaveButtonTextDisabled
          ]}>
            Save notification
          </Text>
        </TouchableOpacity>
      </View>

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
        initialTime={time || "6:30 PM"}
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
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 17.5,
    fontFamily: 'Inter',
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
  asterisk: {
    color: '#E64646',
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
    color: 'rgba(255, 255, 255, 0.50)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.02)',
  },
  headerInputWithText: {
    color: '#FFFFFF',
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
  },
  textInputMultiline: {
    minHeight: 80,
    paddingTop: Math.max(8, 12),
  },
  characterCount: {
    fontSize: 12,
    fontFamily: 'Inter',
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    textAlign: 'right',
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
    fontSize: 12,
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
  characterSlotSelected: {
    // Additional styling for selected character slot
  },
  characterAvatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emptyCharacterSlot: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
    borderStyle: 'dashed',
  },
  selectedCharacterAvatar: {
    borderColor: '#8DD3C8',
    borderStyle: 'solid',
  },
  addCharacterText: {
    fontSize: 32,
    fontWeight: '300',
    color: '#9CA3AF',
    fontFamily: 'Inter',
  },
  characterAvatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  characterName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  characterNameEmpty: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9CA3AF',
  },
  characterNameSelected: {
    color: '#8DD3C8',
    fontWeight: '600',
  },
  aiCheckboxSection: {
    alignItems: 'flex-start',
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
  },
  duplicateButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 5, // Reduced by 60% (12 * 0.4 = 4.8, rounded to 5)
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.4)',
  },
  duplicateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A78BFA',
    fontFamily: 'Inter',
    letterSpacing: 0.5,
  },
  bottomSpacing: {
    height: 100, // Extra space for floating button
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
    paddingHorizontal: 10, // Reduced by 60% (24 * 0.4 = 9.6, rounded to 10)
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