import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Image,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import PhotoUploadModal from '@/components/PhotoUploadModal';

import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  useAnimatedGestureHandler,
  runOnJS,
  interpolate,
  clamp
} from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

export default function AddGoal() {
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState(5); // Default to middle (5 out of 10)
  const [coverImageUri, setCoverImageUri] = useState<string | null>(null);
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);
  const sliderPosition = useSharedValue(4); // 0-based index for position 5
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  const handleBack = () => {
    router.back();
  };

  const handlePhotoSelected = (uri: string) => {
    setCoverImageUri(uri);
    setShowPhotoUploadModal(false);
  };

  const handleSaveGoal = () => {
    if (goalTitle.length < 10) {
      Alert.alert('Error', 'Goal title must be at least 10 characters long');
      return;
    }

    // Create goal data object
    const goalData = {
      id: Date.now().toString(),
      title: goalTitle,
      description: goalDescription,
      deadline: goalDeadline,
      urgency: urgencyLevel,
      coverImage: coverImageUri,
      createdAt: new Date().toISOString()
    };

    // Navigate back to the goals index page with the new goal data
    router.push({
      pathname: '../index',
      params: {
        newGoal: JSON.stringify(goalData)
      }
    });
  };

  const updateUrgencyLevel = (level: number) => {
    setUrgencyLevel(level);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = sliderPosition.value;
    },
    onActive: (event, context) => {
      const sliderWidth = screenWidth - 48 - 80; // Account for padding and label containers
      const newPosition = context.startX + (event.translationX / sliderWidth) * 9;
      sliderPosition.value = clamp(newPosition, 0, 9);
      
      const level = Math.round(sliderPosition.value) + 1;
      runOnJS(updateUrgencyLevel)(level);
    },
    onEnd: () => {
      const level = Math.round(sliderPosition.value) + 1;
      sliderPosition.value = level - 1;
      runOnJS(updateUrgencyLevel)(level);
    }
  });

  const animatedSliderStyle = useAnimatedStyle(() => {
    const sliderWidth = screenWidth - 48 - 80;
    const translateX = interpolate(sliderPosition.value, [0, 9], [0, sliderWidth - 24]);
    
    return {
      transform: [{ translateX }]
    };
  });

  const renderUrgencySlider = () => {
    return (
      <View style={styles.urgencySliderContainer}>
        <View style={styles.urgencyTrack}>
          {Array.from({ length: 10 }, (_, i) => (
            <View
              key={i}
              style={[
                styles.urgencyTrackDot,
                i < urgencyLevel && styles.urgencyTrackDotActive
              ]}
            />
          ))}
        </View>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.urgencySliderThumb, animatedSliderStyle]} />
        </PanGestureHandler>
      </View>
    );
  };

  const renderUrgencyScale = () => {
    const dots = [];
    for (let i = 1; i <= 10; i++) {
      dots.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.urgencyDot,
            i <= urgencyLevel && styles.urgencyDotActive
          ]}
          onPress={() => {
            setUrgencyLevel(i);
            sliderPosition.value = i - 1;
          }}
          activeOpacity={0.7}
        />
      );
    }
    return dots;
  };

  if (!fontsLoaded) {
    return null;
  }

  console.log('Styles object:', styles);
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
        
        <Text style={styles.title}>Add goal</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover Photo Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>COVER PHOTO</Text>
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
                <Camera size={32} color="#9CA3AF" />
                <Text style={styles.coverPhotoText}>Add cover photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Goal Title */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            GOAL<Text style={styles.asterisk}>*</Text>
          </Text>
          <TextInput
            style={styles.goalInput}
            value={goalTitle}
            onChangeText={setGoalTitle}
            placeholder="What do you want to accomplish?"
            placeholderTextColor="rgba(255, 255, 255, 0.5)" // Keep 50% opacity for placeholder
            maxLength={100}
          />
          <Text style={styles.characterCount}>
            {goalTitle.length}/10 characters minimum
          </Text>
        </View>

        {/* Goal Description */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>GOAL DESCRIPTION</Text>
          <TextInput
            style={[styles.textInput, styles.textInputMultiline]}
            value={goalDescription}
            onChangeText={setGoalDescription}
            placeholder="How will you accomplish this goal? What have you accomplished so far? 

Everything you enter helps your characters better tailor their messages."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
          />
        </View>

        {/* Goal Deadline */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>GOAL DEADLINE</Text>
          <TextInput
            style={styles.textInput}
            value={goalDeadline}
            onChangeText={setGoalDeadline}
            placeholder="When do you want to accomplish this by?"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
          />
        </View>

        {/* Urgency Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>URGENCY</Text>
          <Text style={styles.urgencyDescription}>
            How urgent is this goal to accomplish?
          </Text>
          <View style={styles.urgencyContainer}>
            <View style={styles.urgencyLabelContainer}>
              <Text style={styles.urgencyEmoji}>😌</Text>
              <Text style={styles.urgencyLabel}>Not urgent</Text>
            </View>
            {renderUrgencySlider()}
            <View style={styles.urgencyLabelContainer}>
              <Text style={styles.urgencyEmoji}>😱</Text>
              <Text style={styles.urgencyLabel}>Very urgent</Text>
            </View>
          </View>
          <Text style={styles.urgencyValue}>
            <Text style={styles.urgencyLevelLabel}>Level:</Text> {urgencyLevel}/10
          </Text>
        </View>

        {/* Extra spacing for floating button */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Save Button */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity 
          style={[
            styles.saveButton,
            canSaveGoal() && styles.saveButtonEnabled
          ]}
          onPress={handleSaveGoal}
          disabled={!canSaveGoal()}
          activeOpacity={canSaveGoal() ? 0.8 : 1}
        >
          <Text style={[
            styles.saveButtonText,
            canSaveGoal() && styles.saveButtonTextEnabled
          ]}>
            Save goal
          </Text>
        </TouchableOpacity>
      </View>

      {/* Photo Upload Modal */}
      <PhotoUploadModal
        visible={showPhotoUploadModal}
        onClose={() => setShowPhotoUploadModal(false)}
        onPhotoSelected={handlePhotoSelected}
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
    marginBottom: 48, // Increased by 50% (32px * 1.5 = 48px)
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
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
  },
  coverPhotoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  coverPhotoText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter',
  },
  textInput: {
    backgroundColor: 'rgba(60, 60, 67, 0.30)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14, // Keep 14px for regular inputs
    fontFamily: 'Inter',
    fontWeight: '400',
    lineHeight: 17.5,
    color: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  goalInput: {
    backgroundColor: 'rgba(60, 60, 67, 0.30)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14, // 14px as requested
    fontFamily: 'Inter',
    fontWeight: '700', // Bold as requested
    lineHeight: 17.5,
    color: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  textInputMultiline: {
    minHeight: 100,
    paddingTop: 12,
  },
  characterCount: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter',
    marginTop: 4,
    textAlign: 'right',
  },
  urgencyDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    marginBottom: 16,
  },
  urgencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  urgencyLabelContainer: {
    alignItems: 'center',
    gap: 4,
  },
  urgencyEmoji: {
    fontSize: 16,
    textAlign: 'center',
  },
  urgencyLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  urgencyScale: {
    flex: 1,
    marginHorizontal: 12,
  },
  urgencySliderContainer: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  urgencyTrack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    position: 'relative',
  },
  urgencyTrackDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    position: 'absolute',
  },
  urgencyTrackDotActive: {
    backgroundColor: '#F3CC95',
  },
  urgencySliderThumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3CC95',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    top: -10, // Center on track
  },
  urgencyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  urgencyDotActive: {
    backgroundColor: '#F3CC95',
    borderColor: '#F3CC95',
  },
  urgencyValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  urgencyLevelLabel: {
    color: '#BEC0ED',
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
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    minWidth: 160,
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