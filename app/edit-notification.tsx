import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput, 
  ScrollView,
  SafeAreaView,
  Dimensions,
  Alert,
  Image
} from 'react-native';
import { ArrowLeft, Calendar, Clock, User, Plus, Trash2 } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import DatePickerModal from '@/components/DatePickerModal';
import TimePickerModal from '@/components/TimePickerModal';

const { width: screenWidth } = Dimensions.get('window');

export default function EditNotification() {
  const [header, setHeader] = useState('');
  const [details, setDetails] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [sendWithoutAI, setSendWithoutAI] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [characters, setCharacters] = useState<any[]>([]);
  
  const router = useRouter();
  const params = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  useEffect(() => {
    // Load notification data from params
    if (params.notificationHeader) {
      setHeader(params.notificationHeader as string);
    }
    if (params.notificationDetails) {
      setDetails(params.notificationDetails as string);
    }
    if (params.notificationTime) {
      setTime(params.notificationTime as string);
    }
    if (params.startDate) {
      try {
        // Parse MM/DD/YYYY format
        const dateStr = params.startDate as string;
        const [month, day, year] = dateStr.split('/');
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        setStartDate(date);
      } catch (error) {
        console.log('Error parsing date:', error);
      }
    }
    if (params.sendWithoutAI) {
      setSendWithoutAI(params.sendWithoutAI === 'true');
    }

    // Set up default characters (same as add-notification)
    setCharacters([
      { id: '1', name: 'Muffin the fluffy bunny', isEmpty: false, avatarSource: require('../assets/images/pink bunny copy.jpg') },
      { id: '2', name: 'ARIA', isEmpty: false, avatarSource: require('../assets/images/20250706_1541_Futuristic Spacecraft Cockpit_simple_compose_01jzgyc3yserjtsrq38jpjn75t copy copy.png') },
      { id: '3', name: 'Add Character', isEmpty: true, avatarSource: null },
    ]);

    // Set initial character selection
    if (!sendWithoutAI) {
      setSelectedCharacterId('1'); // Default to first character
    }
  }, [
    params.notificationHeader,
    params.notificationDetails,
    params.notificationTime,
    params.startDate,
    params.sendWithoutAI,
    sendWithoutAI
  ]);

  const handleBack = () => {
    router.back();
  };

  const handleCharacterSelect = (characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    if (character && !character.isEmpty && !sendWithoutAI) {
      setSelectedCharacterId(characterId);
    }
  };

  const handleSendWithoutAIToggle = () => {
    const newSendWithoutAI = !sendWithoutAI;
    setSendWithoutAI(newSendWithoutAI);
    
    if (newSendWithoutAI) {
      // When enabling AI-free mode, deselect all characters
      setSelectedCharacterId(null);
    } else {
      // When disabling AI-free mode, select the first available character
      const firstAvailableCharacter = characters.find(char => !char.isEmpty);
      if (firstAvailableCharacter) {
        setSelectedCharacterId(firstAvailableCharacter.id);
      }
    }
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

  const handleTimeConfirm = (selectedTime: string) => {
    setTime(selectedTime);
    setShowTimePicker(false);
  };

  const handleDeleteNotification = () => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // Navigate back to home - in a real app, you'd also delete from storage
            router.push('/(tabs)');
          }
        }
      ]
    );
  };

  // Check if all required fields are filled for Save button
  const canSaveNotification = () => {
    return details.trim() !== '' && 
           startDate !== null && 
           time.trim() !== '' && 
           (selectedCharacterId !== null || sendWithoutAI);
  };

  const handleSaveNotification = () => {
    if (!canSaveNotification()) return;

    Alert.alert(
      'Notification Updated',
      'Your notification has been updated successfully!',
      [
        {
          text: 'OK',
          onPress: () => {
            // Navigate back to home - in a real app, you'd update the notification in storage
            router.push('/(tabs)');
          }
        }
      ]
    );
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#F3CC95" />
            <Text style={styles.backText}>BACK</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDeleteNotification}
            activeOpacity={0.7}
          >
            <Trash2 size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.titleRow}>
          <Text style={styles.headerTitle}>Edit notification</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>HEADER</Text>
          <Text style={styles.fieldNote}>
            {header.trim() ? '' : 'Leave blank to auto-generate from details'}
          </Text>
          <TextInput
            style={[
              styles.headerInput,
              header.length > 0 && styles.headerInputWithText
            ]}
            value={header}
            onChangeText={setHeader}
            placeholder="Board game night prep"
            placeholderTextColor="rgba(255, 255, 255, 0.50)"
            multiline={false}
            maxLength={100}
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
            placeholder="Enter notification details..."
            placeholderTextColor="rgba(255, 255, 255, 0.50)"
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={1000}
          />
        </View>

        {/* Date & Time Section */}
        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>DATE & TIME</Text>
          
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
                  {time || "6:00 PM"}
                </Text>
                <Clock size={16} color="#8DD3C8" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Character Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>CHARACTER SELECTION</Text>
          
          <View style={styles.characterSlots}>
            {characters.slice(0, 3).map((character) => {
              const showProfileIcon = sendWithoutAI;
              const isSelected = !sendWithoutAI && selectedCharacterId === character.id && !character.isEmpty;
              
              return (
                <TouchableOpacity
                  key={character.id}
                  style={[
                    styles.characterSlot,
                    isSelected && styles.characterSlotSelected
                  ]}
                  onPress={() => !sendWithoutAI && handleCharacterSelect(character.id)}
                  activeOpacity={character.isEmpty || sendWithoutAI ? 1 : 0.7}
                  disabled={character.isEmpty || sendWithoutAI}
                >
                  <View style={[
                    styles.characterAvatarContainer,
                    character.isEmpty && styles.emptyCharacterSlot,
                    isSelected && styles.selectedCharacterAvatar,
                    sendWithoutAI && !character.isEmpty && styles.aiFreeModeAvatar
                  ]}>
                    {showProfileIcon && !character.isEmpty ? (
                      <Image 
                        source={require('../assets/images/placeholder-profile-icon-8qmjk1094ijhbem9 copy copy.png')}
                        style={styles.characterAvatar}
                        resizeMode="cover"
                      />
                    ) : character.isEmpty ? (
                      <Plus size={24} color="#9CA3AF" />
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
                    isSelected && styles.characterNameSelected,
                    character.isEmpty && styles.characterNameEmpty,
                    sendWithoutAI && !character.isEmpty && styles.characterNameAIFree
                  ]}>
                    {showProfileIcon && !character.isEmpty ? 'You' : character.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity 
            style={styles.aiCheckbox}
            onPress={handleSendWithoutAIToggle}
            activeOpacity={0.7}
          >
            <View style={styles.checkboxContainer}>
              <View style={[styles.checkbox, sendWithoutAI && styles.checkboxChecked]}>
                {sendWithoutAI && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Send without AI</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Extra spacing for floating button */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Save Button */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity 
          style={[
            styles.saveButton,
            canSaveNotification() && styles.saveButtonEnabled
          ]}
          onPress={handleSaveNotification}
          disabled={!canSaveNotification()}
          activeOpacity={canSaveNotification() ? 0.8 : 1}
        >
          <Text style={[
            styles.saveButtonText,
            canSaveNotification() && styles.saveButtonTextEnabled
          ]}>
            Save changes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={showStartDatePicker}
        onClose={() => setShowStartDatePicker(false)}
        onCancel={() => setShowStartDatePicker(false)}
        onConfirm={handleStartDateConfirm}
        initialDate={startDate || new Date()}
        title="Select start date"
      />

      {/* Time Picker Modal */}
      <TimePickerModal
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        onCancel={() => setShowTimePicker(false)}
        onConfirm={handleTimeConfirm}
        initialTime={time || "6:00 PM"}
        title="Select time"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1830',
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15, // 15px gap as requested
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
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 36,
    letterSpacing: -0.28,
    flexShrink: 1, // Allow text to shrink if needed
  },
  titleRow: {
    width: '100%', // Ensure full width for proper text layout
  },
  deleteButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
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
    marginBottom: 4,
  },
  fieldNote: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: 'Inter',
    marginBottom: 8,
    minHeight: 15,
  },
  asterisk: {
    color: '#E64646',
  },
  headerInput: {
    backgroundColor: 'rgba(60, 60, 67, 0.30)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    paddingVertical: 12,
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
    paddingTop: 12,
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
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 17.5,
    letterSpacing: 0.7,
    marginBottom: 8,
  },
  datePickerButton: {
    backgroundColor: 'rgba(60, 60, 67, 0.30)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    paddingVertical: 12,
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
  section: {
    marginBottom: 24,
  },
  characterSlots: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  characterSlot: {
    alignItems: 'center',
    flex: 1,
  },
  characterSlotSelected: {
    // Additional styling for selected character slot
  },
  characterAvatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emptyCharacterSlot: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
    borderStyle: 'dashed',
  },
  selectedCharacterAvatar: {
    borderColor: '#34A853',
  },
  aiFreeModeAvatar: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
    opacity: 0.6,
  },
  characterAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  characterName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  characterNameSelected: {
    color: '#34A853',
    fontWeight: '600',
  },
  characterNameEmpty: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9CA3AF',
  },
  characterNameAIFree: {
    color: '#9CA3AF',
    fontWeight: '400',
  },
  aiCheckbox: {
    marginTop: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4A3A7B',
    borderColor: '#4A3A7B',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  bottomSpacing: {
    height: 100,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  saveButton: {
    backgroundColor: '#6B7280',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 200,
  },
  saveButtonEnabled: {
    backgroundColor: '#F3CC95',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
    fontFamily: 'Inter',
  },
  saveButtonTextEnabled: {
    color: '#1C1830',
  },
});