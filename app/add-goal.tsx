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

const { width: screenWidth } = Dimensions.get('window');

export default function AddGoal() {
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState(5); // Default to middle (5 out of 10)
  const [coverImageUri, setCoverImageUri] = useState<string | null>(null);
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);
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

    // TODO: Save goal data
    Alert.alert(
      'Goal Saved',
      'Your goal has been saved successfully!',
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]
    );
  };

  const canSaveGoal = () => {
    return goalTitle.length >= 10;
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
          onPress={() => setUrgencyLevel(i)}
          activeOpacity={0.7}
        />
      );
    }
    return dots;
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
            style={styles.textInput}
            value={goalTitle}
            onChangeText={setGoalTitle}
            placeholder="What do you want to accomplish?"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
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
            <View style={styles.urgencyScale}>
              {renderUrgencyScale()}
            </View>
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
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
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