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
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import Svg, { Circle, Path } from 'react-native-svg';
import DatePickerModal from '@/components/DatePickerModal';
import TimePickerModal from '@/components/TimePickerModal';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function FirstNotification() {
  const [header, setHeader] = useState('');
  const [details, setDetails] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');
  const [isRepeat, setIsRepeat] = useState(false);
  const [isTextItToMe, setIsTextItToMe] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [isGeneratingHeader, setIsGeneratingHeader] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  const handleBack = () => {
    router.back();
  };

  const handleSkipForNow = () => {
    // Navigate directly to main app dashboard without any notification data
    router.push('/(tabs)');
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'MM/DD/YYYY';
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // AI header generation function
  const generateHeaderFromDetails = (detailsText: string): string => {
    // Simple AI-like header generation based on keywords and patterns
    const text = detailsText.toLowerCase();
    
    // Common patterns and their corresponding headers
    const patterns = [
      { keywords: ['board game', 'game night', 'catan', 'monopoly', 'chess'], header: 'Board game night prep' },
      { keywords: ['gym', 'workout', 'exercise', 'fitness', 'training'], header: 'Workout reminder' },
      { keywords: ['water', 'drink', 'hydrate', 'hydration'], header: 'Stay hydrated' },
      { keywords: ['stretch', 'stretching', 'yoga', 'flexibility'], header: 'Stretch break' },
      { keywords: ['meeting', 'call', 'conference', 'zoom'], header: 'Meeting reminder' },
      { keywords: ['medication', 'medicine', 'pills', 'vitamins'], header: 'Take medication' },
      { keywords: ['study', 'homework', 'assignment', 'exam'], header: 'Study session' },
      { keywords: ['date', 'dinner', 'restaurant', 'romantic'], header: 'Date night prep' },
      { keywords: ['family', 'reunion', 'relatives', 'gathering'], header: 'Family event prep' },
      { keywords: ['series', 'show', 'tv', 'netflix', 'watch'], header: 'Watch reminder' },
      { keywords: ['tiktok', 'video', 'film', 'record'], header: 'Content creation' },
      { keywords: ['shopping', 'groceries', 'store', 'buy'], header: 'Shopping reminder' },
      { keywords: ['appointment', 'doctor', 'dentist', 'checkup'], header: 'Appointment reminder' },
      { keywords: ['birthday', 'anniversary', 'celebration'], header: 'Special occasion' },
      { keywords: ['laundry', 'wash', 'clothes', 'cleaning'], header: 'Household tasks' },
    ];

    // Find matching pattern
    for (const pattern of patterns) {
      if (pattern.keywords.some(keyword => text.includes(keyword))) {
        return pattern.header;
      }
    }

    // Extract first few words if no pattern matches
    const words = detailsText.trim().split(' ').slice(0, 4);
    let generatedHeader = words.join(' ');
    
    // Ensure it's not too long (max 60 characters for AI-generated)
    if (generatedHeader.length > 60) {
      generatedHeader = generatedHeader.substring(0, 57) + '...';
    }
    
    // Fallback if still empty or too short
    if (generatedHeader.length < 3) {
      generatedHeader = 'Reminder';
    }

    return generatedHeader;
  };

  const validateFields = () => {
    const errors: {[key: string]: string} = {};

    // Details is required
    if (!details.trim()) {
      errors.details = 'Details are required';
    }

    // Start Date is required
    if (!startDate) {
      errors.startDate = 'Start date is required';
    }

    // Time is required
    if (!time.trim()) {
      errors.time = 'Time is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Check if all required fields are filled
  const areRequiredFieldsFilled = () => {
    return details.trim() !== '' && startDate !== null && time.trim() !== '';
  };

  const handleNextStep = async () => {
    // Validate required fields first
    if (!validateFields()) {
      Alert.alert('Required Fields', 'Please fill in all required fields before continuing.');
      return;
    }

    let finalHeader = header.trim();

    // Generate header if not provided
    if (!finalHeader && details.trim()) {
      setIsGeneratingHeader(true);
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      finalHeader = generateHeaderFromDetails(details);
      setHeader(finalHeader);
      setIsGeneratingHeader(false);
    }

    // Navigate to character selection screen with notification data
    router.push({
      pathname: '/character-selection',
      params: {
        notificationHeader: finalHeader || 'Reminder',
        notificationDetails: details,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        time: time,
        isRepeat: isRepeat.toString(),
        isTextItToMe: isTextItToMe.toString()
      }
    });
  };

  const handleStartDateConfirm = (date: Date) => {
    setStartDate(date);
    setShowStartDatePicker(false);
    // Clear validation error when field is filled
    if (validationErrors.startDate) {
      setValidationErrors(prev => ({ ...prev, startDate: '' }));
    }
  };

  const handleEndDateConfirm = (date: Date) => {
    setEndDate(date);
    setShowEndDatePicker(false);
  };

  const handleTimeConfirm = (selectedTime: string) => {
    setTime(selectedTime);
    setShowTimePicker(false);
    // Clear validation error when field is filled
    if (validationErrors.time) {
      setValidationErrors(prev => ({ ...prev, time: '' }));
    }
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

  const closeSMSModal = () => {
    setShowSMSModal(false);
  };

  const handleDetailsChange = (text: string) => {
    setDetails(text);
    // Clear validation error when field is filled
    if (validationErrors.details && text.trim()) {
      setValidationErrors(prev => ({ ...prev, details: '' }));
    }
  };

  const handleHeaderChange = (text: string) => {
    setHeader(text);
  };

  if (!fontsLoaded) {
    return null;
  }

  // Check if button should be disabled
  const isButtonDisabled = !areRequiredFieldsFilled() || isGeneratingHeader;

  return (
    <View style={styles.container}>
      {/* Header with Back Button and Skip Button */}
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
          style={styles.skipButton}
          onPress={handleSkipForNow}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>SKIP FOR NOW</Text>
          <ArrowRight size={20} color="#F3CC95" />
        </TouchableOpacity>
        
        <Text style={styles.title}>
          Let's set up your first{'\n'}
          reminder note.
        </Text>
        
        <Text style={styles.subtitle}>
          What's the first note you'd like to send to yourself and when?
        </Text>
        
        <Text style={styles.description}>
          You'll receive a push notification and/or{'\n'}
          a text message right when you need it.{'\n'}
          You'll be able to edit these settings{'\n'}
          anytime.
        </Text>
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
          <Text style={styles.fieldNote}>
            {header.trim() ? '' : 'Leave blank to auto-generate from details'}
          </Text>
          <TextInput
            style={[
              styles.headerInput,
              header.length > 0 && styles.headerInputWithText
            ]}
            value={header}
            onChangeText={handleHeaderChange}
            placeholder="Board game night prep"
            placeholderTextColor="rgba(255, 255, 255, 0.50)"
            multiline={false}
            maxLength={100} // 100 character limit for manual headers
          />
          {header.length >= 90 && (
            <Text style={[
              styles.characterCount,
              header.length >= 100 && styles.characterCountLimit
            ]}>
              {header.length}/100 characters
            </Text>
          )}
        </View>

        {/* Details Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>
            DETAILS<Text style={styles.asterisk}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.textInput, 
              styles.textInputMultiline,
              validationErrors.details && styles.inputError
            ]}
            value={details}
            onChangeText={handleDetailsChange}
            placeholder="Need to brush up on how to play Catan at 6 pm this Wednesday before board game night at 8. Ping me at 5 and 5:30 pm."
            placeholderTextColor="rgba(255, 255, 255, 0.50)"
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={1000}
          />
          {validationErrors.details && (
            <Text style={styles.errorText}>{validationErrors.details}</Text>
          )}
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
                style={[
                  styles.datePickerButton,
                  validationErrors.startDate && styles.inputError
                ]}
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
              {validationErrors.startDate && (
                <Text style={styles.errorText}>{validationErrors.startDate}</Text>
              )}
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
                style={[
                  styles.timePickerButton,
                  validationErrors.time && styles.inputError
                ]}
                onPress={() => setShowTimePicker(true)}
                activeOpacity={0.7}
              >
                <Text style={[styles.timePickerText, !time && styles.placeholderText]}>
                  {time || "6:00 PM"}
                </Text>
                <Clock size={16} color="#8DD3C8" />
              </TouchableOpacity>
              {validationErrors.time && (
                <Text style={styles.errorText}>{validationErrors.time}</Text>
              )}
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
            
            {/* Repeat Description */}
            <Text style={styles.repeatDescription}>
              Selecting "Repeat" means you'll receive a text at the specified time every day between the start and end date.
            </Text>
            
            {/* Additional Messaging Times Note */}
            <Text style={styles.messagingTimesNote}>
              Need more specific messaging times? We're working on it!
            </Text>
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
            {isGeneratingHeader ? 'Generating header...' : 'Next step'}
          </Text>
          {!isGeneratingHeader && (
            <ArrowRight 
              size={16} 
              color={isButtonDisabled ? "#9CA3AF" : "#1D1B20"} 
            />
          )}
        </TouchableOpacity>
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
        initialTime={time || "6:00 PM"}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1830', // Changed from #2D2B4A to #1C1830
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: Math.max(38, screenWidth * 0.097), // 38px minimum, responsive up to ~9.7% of screen width
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    position: 'absolute',
    top: 60,
    left: Math.max(38, screenWidth * 0.097),
    zIndex: 10,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F3CC95',
    fontFamily: 'Inter',
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    position: 'absolute',
    top: 60,
    right: Math.max(38, screenWidth * 0.097),
    zIndex: 10,
  },
  skipText: {
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
    marginTop: 40, // Add top margin to account for the buttons
  },
  subtitle: {
    fontSize: 14, // Changed from 12px to 14px
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 17.5, // 125% of 14px
    fontFamily: 'Inter',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 18,
    fontFamily: 'Inter',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Math.max(38, screenWidth * 0.097), // Match header padding
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
    minHeight: 15, // Ensure consistent spacing even when empty
  },
  asterisk: {
    color: '#E64646',
  },
  headerInput: {
    backgroundColor: 'rgba(60, 60, 67, 0.30)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: Math.max(8, 12), // Minimum 8px top/bottom padding
    fontSize: 14, // Header input is 14px
    fontFamily: 'Inter',
    fontWeight: '600',
    lineHeight: 17.5, // 125% of 14px
    color: 'rgba(255, 255, 255, 0.50)', // Placeholder color at 50% opacity
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.02)', // Decreased opacity by 80% (was 0.1, now 0.02)
  },
  headerInputWithText: {
    color: '#FFFFFF', // 100% opacity white when user enters text
  },
  textInput: {
    backgroundColor: 'rgba(60, 60, 67, 0.30)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: Math.max(8, 12), // Minimum 8px top/bottom padding
    fontSize: 14, // Changed from 12px to 14px
    fontFamily: 'Inter',
    fontWeight: '400', // Increased from 300 to 400 (100 weight increase)
    lineHeight: 17.5, // 125% of 14px (changed from 15px)
    color: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.02)', // Decreased opacity by 80% (was 0.1, now 0.02)
  },
  textInputMultiline: {
    minHeight: 80,
    paddingTop: Math.max(8, 12), // Ensure minimum 8px top padding
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    fontFamily: 'Inter',
  },
  characterCount: {
    fontSize: 12,
    fontFamily: 'Inter',
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    textAlign: 'right',
  },
  characterCountLimit: {
    color: '#F59E0B', // Amber color when approaching/at limit
    fontWeight: '500',
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
    color: '#E1B8B2', // Changed from #8DD3C8 to #E1B8B2
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400', // Decreased from 500 to 400 (100 weight decrease)
    lineHeight: 17.5,
    letterSpacing: 0.7,
    marginBottom: 8,
  },
  datePickerButton: {
    backgroundColor: 'rgba(60, 60, 67, 0.30)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: Math.max(8, 12), // Minimum 8px top/bottom padding
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.02)', // Decreased opacity by 80% (was 0.1, now 0.02)
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePickerText: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400', // Increased from 300 to 400 (100 weight increase)
    lineHeight: 17.5,
    color: '#FFF',
  },
  placeholderDateText: {
    color: 'rgba(255, 255, 255, 0.50)', // 50% opacity for MM/DD/YYYY placeholder
  },
  timePickerButton: {
    backgroundColor: 'rgba(60, 60, 67, 0.30)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: Math.max(8, 12), // Minimum 8px top/bottom padding
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.02)', // Decreased opacity by 80% (was 0.1, now 0.02)
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
    color: 'rgba(255, 255, 255, 0.50)', // 50% opacity for placeholder
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
  repeatDescription: {
    fontSize: 12,
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.70)',
    fontFamily: 'Inter',
    lineHeight: 16,
    paddingLeft: 32, // Align with checkbox label (20px icon + 12px gap)
  },
  messagingTimesNote: {
    fontSize: 12,
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.70)',
    fontFamily: 'Inter',
    lineHeight: 16,
    paddingLeft: 32, // Align with checkbox label (20px icon + 12px gap)
    marginTop: 7, // Minimum 7px gap from the previous paragraph
  },
  toggleSection: {
    marginBottom: 40,
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
    backgroundColor: 'rgba(255, 255, 255, 0.50)', // Changed to #FFFFFF at 50% opacity for better visibility
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
    backgroundColor: '#6B7280', // Gray background when disabled
    shadowOpacity: 0, // Remove shadow when disabled
    elevation: 0,
  },
  nextStepButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1B20',
    fontFamily: 'Inter',
  },
  nextStepButtonTextDisabled: {
    color: '#9CA3AF', // Gray text when disabled
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
    backgroundColor: '#F3CC95', // Using the app's yellow color
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