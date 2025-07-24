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
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Camera, Calendar, Clock } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import PhotoUploadModal from '@/components/PhotoUploadModal';
import DatePickerModal from '@/components/DatePickerModal';
import TimePickerModal from '@/components/TimePickerModal';

const { width: screenWidth } = Dimensions.get('window');

export default function AddGoal() {
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDueDate, setGoalDueDate] = useState<Date | null>(null);
  const [goalDueTime, setGoalDueTime] = useState('');
  const [goalDetails, setGoalDetails] = useState('');
  const [goalMotivation, setGoalMotivation] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState(5);
  const [coverImageUri, setCoverImageUri] = useState<string | null>(null);
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [goalId, setGoalId] = useState<string | null>(null);
  
  const router = useRouter();
  const params = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  useEffect(() => {
    // Check if we're in edit mode
    if (params.editMode === 'true') {
      setIsEditMode(true);
      setGoalId(params.goalId as string);
      setGoalTitle(params.goalTitle as string || '');
      setGoalDetails(params.goalDetails as string || '');
      setGoalMotivation(params.goalMotivation as string || '');
      setUrgencyLevel(parseInt(params.goalUrgency as string) || 5);
      setCoverImageUri(params.goalCoverImage as string || null);
      
      // Parse due date if available
      if (params.goalDueDate) {
        try {
          const date = new Date(params.goalDueDate as string);
          if (!isNaN(date.getTime())) {
            setGoalDueDate(date);
          }
        } catch (error) {
          console.log('Error parsing due date:', error);
        }
      }
    }
  }, [params]);

  const handleBack = () => {
    router.back();
  };

  const handlePhotoSelected = (uri: string) => {
    setCoverImageUri(uri);
    setShowPhotoUploadModal(false);
  };

  const handleDateConfirm = (date: Date) => {
    setGoalDueDate(date);
    setShowDatePicker(false);
  };

  const handleTimeConfirm = (time: string) => {
    setGoalDueTime(time);
    setShowTimePicker(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select date';
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const handleSaveGoal = () => {
    if (!goalTitle.trim()) {
      Alert.alert('Error', 'Goal title is required');
      return;
    }

    // Combine date and time if both are provided
    let combinedDateTime = null;
    if (goalDueDate) {
      combinedDateTime = new Date(goalDueDate);
      if (goalDueTime) {
        // Parse time and set it on the date
        const timeMatch = goalDueTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1]);
          const minutes = parseInt(timeMatch[2]);
          const period = timeMatch[3].toUpperCase();
          
          if (period === 'PM' && hours !== 12) hours += 12;
          if (period === 'AM' && hours === 12) hours = 0;
          
          combinedDateTime.setHours(hours, minutes, 0, 0);
        }
      }
    }

    const goalData = {
      id: isEditMode ? goalId : Date.now().toString(),
      title: goalTitle,
      dueDate: combinedDateTime ? combinedDateTime.toISOString() : '',
      details: goalDetails,
      motivation: goalMotivation,
      urgency: urgencyLevel,
      coverImage: coverImageUri,
      createdAt: isEditMode ? params.goalCreatedAt as string || new Date().toISOString() : new Date().toISOString()
    };

    if (isEditMode) {
      Alert.alert(
        'Goal Updated',
        'Your goal has been updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              router.push({
                pathname: '/(tabs)/goals',
                params: {
                  updatedGoal: JSON.stringify(goalData)
                }
              });
            }
          }
        ]
      );
    } else {
      // Navigate back to goals index with new goal data
      router.push({
        pathname: '/(tabs)/goals',
        params: {
          newGoal: JSON.stringify(goalData)
        }
      });
    }
  };

  const renderUrgencySlider = () => {
    const dots = [];
    for (let i = 1; i <= 10; i++) {
      dots.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.urgencyDot,
            i <= urgencyLevel && styles.urgencyDotActive
          ]}
          onPress={() => setUrgencyLevel(i)}
          activeOpacity={0.7}
        >
          <Text></Text>
        </TouchableOpacity>
      );
    }
    return (
      <View style={styles.urgencySliderContainer}>
        <View style={styles.urgencyLabels}>
          <View style={styles.urgencyLabelLeft}>
            <Text style={styles.urgencyEmoji}>😌</Text>
            <Text style={styles.urgencyLabelText}>Not that big of a deal</Text>
          </View>
          <View style={styles.urgencyLabelRight}>
            <Text style={styles.urgencyEmoji}>😱</Text>
            <Text style={styles.urgencyLabelText}>MUST. ACHIEVE. ASAP.</Text>
          </View>
        </View>
        <View style={styles.urgencyDotsContainer}>
          {dots}
        </View>
      </View>
    );
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#F3CC95" />
          <Text style={styles.backText}>BACK</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>{isEditMode ? 'Edit goal' : 'Add goal'}</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover Photo Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>COVER</Text>
          <TouchableOpacity 
            style={styles.coverPhotoContainer}
            onPress={() => setShowPhotoUploadModal(true)}
            activeOpacity={0.7}
          >
            {coverImageUri ? (
              <Image 
                source={{ uri: coverImageUri }}
                style={styles.coverPhoto}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.coverPhotoPlaceholder}>
                <Text style={styles.coverPhotoText}>UPLOAD IMAGE</Text>
              </View>
            )}
            <View style={styles.uploadIconContainer}>
              <Camera size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Goal Title */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            GOAL<Text style={styles.asterisk}>*</Text>
          </Text>
          <TextInput
            style={styles.textInput}
            value={goalTitle}
            onChangeText={setGoalTitle}
            placeholder="What will you accomplish?"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            maxLength={100}
          />
        </View>

        {/* When will you accomplish this by? */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>When will you accomplish this by?</Text>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.dateTimeText,
                !goalDueDate && styles.placeholderText
              ]}>
                {formatDate(goalDueDate)}
              </Text>
              <Calendar size={16} color="#8DD3C8" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.dateTimeText,
                !goalDueTime && styles.placeholderText
              ]}>
                {goalDueTime || 'Select time'}
              </Text>
              <Clock size={16} color="#8DD3C8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Goal Details */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>GOAL DETAILS</Text>
          <TextInput
            style={[styles.textInput, styles.textInputMultiline]}
            value={goalDetails}
            onChangeText={setGoalDetails}
            placeholder="How will you accomplish this goal? What have you accomplished so far?"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.helperText}>
            Everything you enter helps your characters better tailor their messages.
          </Text>
        </View>

        {/* Motivation */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>MOTIVATION</Text>
          <TextInput
            style={[styles.textInput, styles.textInputMultiline]}
            value={goalMotivation}
            onChangeText={setGoalMotivation}
            placeholder="What's your purpose? Is there someone you're doing this for?"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.helperText}>
            Everything you enter helps your characters better tailor their messages.
          </Text>
        </View>

        {/* Urgency */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>URGENCY</Text>
          {renderUrgencySlider()}
        </View>

        {/* Extra spacing for floating button */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Save Button */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity 
          style={[
            styles.saveButton,
            !goalTitle.trim() && styles.saveButtonDisabled
          ]}
          onPress={handleSaveGoal}
          disabled={!goalTitle.trim()}
          activeOpacity={goalTitle.trim() ? 0.8 : 1}
        >
          <Text style={[
            styles.saveButtonText,
            !goalTitle.trim() && styles.saveButtonTextDisabled
          ]}>
            {isEditMode ? 'Save changes' : 'Save goal'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Photo Upload Modal */}
      <PhotoUploadModal
        visible={showPhotoUploadModal}
        onClose={() => setShowPhotoUploadModal(false)}
        onPhotoSelected={handlePhotoSelected}
      />

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onCancel={() => setShowDatePicker(false)}
        onConfirm={handleDateConfirm}
        initialDate={goalDueDate || new Date()}
        title="Select due date"
      />

      {/* Time Picker Modal */}
      <TimePickerModal
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        onCancel={() => setShowTimePicker(false)}
        onConfirm={handleTimeConfirm}
        initialTime={goalDueTime || "6:00 PM"}
        title="Select time"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D2B4A',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
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
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    color: '#8DD3C8',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 17.5,
    letterSpacing: 0.7,
    marginBottom: 12,
  },
  asterisk: {
    color: '#E64646',
  },
  coverPhotoContainer: {
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderStyle: 'dashed',
    position: 'relative',
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
  },
  coverPhotoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverPhotoText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter',
  },
  uploadIconContainer: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
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
  helperText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter',
    marginTop: 8,
    lineHeight: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeButton: {
    flex: 1,
    backgroundColor: 'rgba(60, 60, 67, 0.30)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateTimeText: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    lineHeight: 17.5,
    color: '#FFF',
  },
  placeholderText: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  urgencySliderContainer: {
    marginTop: 8,
  },
  urgencyLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  urgencyLabelLeft: {
    alignItems: 'flex-start',
    flex: 1,
  },
  urgencyLabelRight: {
    alignItems: 'flex-end',
    flex: 1,
  },
  urgencyEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  urgencyLabelText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter',
    textAlign: 'center',
    maxWidth: 80,
  },
  urgencyDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  urgencyDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  urgencyDotActive: {
    backgroundColor: '#F3CC95',
    borderColor: '#F3CC95',
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
    backgroundColor: '#F3CC95',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    minWidth: 160,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#6B7280',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1830',
    fontFamily: 'Inter',
  },
  saveButtonTextDisabled: {
    color: '#9CA3AF',
  },
});