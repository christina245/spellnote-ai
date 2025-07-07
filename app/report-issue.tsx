import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronDown } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const { width: screenWidth } = Dimensions.get('window');

export default function ReportIssue() {
  const [header, setHeader] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Choose category');
  const [details, setDetails] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  const categories = [
    'App Crashes',
    'Login/Authentication Issues',
    'Notification Problems',
    'Character Creation Bugs',
    'SMS Integration Issues',
    'Performance Issues',
    'Payment/Billing Problems',
    'Other'
  ];

  const handleBack = () => {
    router.back();
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
  };

  const handleSubmit = () => {
    if (!header.trim()) {
      Alert.alert('Error', 'Please enter a header for your issue report');
      return;
    }
    if (selectedCategory === 'Choose category') {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    if (!details.trim()) {
      Alert.alert('Error', 'Please enter issue details');
      return;
    }

    // Simulate issue report submission
    Alert.alert(
      'Issue Reported',
      'Thank you for reporting this issue! We\'ve received your report and will investigate it promptly.',
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]
    );
  };

  const canSubmit = () => {
    return header.trim() !== '' && 
           selectedCategory !== 'Choose category' && 
           details.trim() !== '';
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
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title and Description */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Report an issue</Text>
          <Text style={styles.description}>
            Found a bug or experiencing technical difficulties? Let us know what's happening so we can fix it quickly and improve your experience.
          </Text>
          
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackIcon}>💡</Text>
            <Text style={styles.feedbackText}>
              <Text style={styles.feedbackLabel}>Have general feedback or suggestions?</Text>{' '}
              <TouchableOpacity 
                onPress={() => router.push('/submit-feedback')}
                activeOpacity={0.7}
              >
                <Text style={styles.feedbackLink}>Go to Submit Feedback</Text>
              </TouchableOpacity>
              {' '}instead!
            </Text>
          </View>
        </View>

        {/* Header Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>
            HEADER<Text style={styles.asterisk}>*</Text>
          </Text>
          <TextInput
            style={styles.textInput}
            value={header}
            onChangeText={setHeader}
            placeholder="Brief description of the issue"
            placeholderTextColor="rgba(255, 255, 255, 0.50)"
            maxLength={100}
          />
        </View>

        {/* Category Field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>
            CATEGORY<Text style={styles.asterisk}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.dropdownText,
              selectedCategory === 'Choose category' && styles.placeholderText
            ]}>
              {selectedCategory}
            </Text>
            <ChevronDown 
              size={16} 
              color="#8DD3C8" 
              style={[
                styles.dropdownIcon,
                showCategoryDropdown && styles.dropdownIconRotated
              ]} 
            />
          </TouchableOpacity>
          
          {showCategoryDropdown && (
            <View style={styles.dropdownMenu}>
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dropdownItem,
                    index === categories.length - 1 && styles.dropdownItemLast
                  ]}
                  onPress={() => handleCategorySelect(category)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dropdownItemText}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
            placeholder="Describe the issue in detail. Include steps to reproduce, what you expected to happen, and what actually happened."
            placeholderTextColor="rgba(255, 255, 255, 0.50)"
            multiline={true}
            numberOfLines={6}
            textAlignVertical="top"
            maxLength={2000}
          />
        </View>

        {/* Extra spacing for floating button */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Submit Button */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity 
          style={[
            styles.submitButton,
            canSubmit() && styles.submitButtonEnabled
          ]}
          onPress={handleSubmit}
          disabled={!canSubmit()}
          activeOpacity={canSubmit() ? 0.8 : 1}
        >
          <Text style={[
            styles.submitButtonText,
            canSubmit() && styles.submitButtonTextEnabled
          ]}>
            Submit
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.fallbackText}>
          If the form doesn't work, email issues@spellnote.ai
        </Text>
      </View>
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
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 20,
    fontFamily: 'Inter',
    marginBottom: 20,
  },
  feedbackContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  feedbackIcon: {
    fontSize: 16,
    marginTop: 2,
    flexShrink: 0,
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 20,
    fontFamily: 'Inter',
    flex: 1,
  },
  feedbackLabel: {
    fontWeight: '600',
  },
  feedbackLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F3CC95',
    textDecorationLine: 'underline',
    fontFamily: 'Inter',
  },
  fieldGroup: {
    marginBottom: 24,
    position: 'relative',
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
    color: '#FF7D63',
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
    minHeight: 120,
    paddingTop: 12,
  },
  dropdownButton: {
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
  dropdownText: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    lineHeight: 17.5,
    color: '#FFF',
    flex: 1,
  },
  placeholderText: {
    color: 'rgba(255, 255, 255, 0.50)',
  },
  dropdownIcon: {
    marginLeft: 8,
    transform: [{ rotate: '0deg' }],
  },
  dropdownIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'rgba(60, 60, 67, 0.95)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 1000,
    marginTop: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
  },
  dropdownItemText: {
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    color: '#FFF',
    lineHeight: 17.5,
  },
  bottomSpacing: {
    height: 140, // Extra space for floating button and text
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  submitButton: {
    backgroundColor: '#6B7280',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 160,
    marginBottom: 12,
  },
  submitButtonEnabled: {
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
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
    fontFamily: 'Inter',
  },
  submitButtonTextEnabled: {
    color: '#1C1830',
  },
  fallbackText: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Inter',
    textAlign: 'center',
    lineHeight: 16,
  },
});