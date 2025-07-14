import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import Svg, { Circle, Path } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// iPhone 16 has a width of 393px
const isIPhone16 = screenWidth === 393;
// Reduced by 30%: 35px -> 24.5px, 25px -> 17.5px
const leftPadding = isIPhone16 ? 24.5 : 17.5;

export default function Rules() {
  const [isChecked, setIsChecked] = useState(false); // Default to unchecked
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  const handleContinue = () => {
    if (!isChecked) {
      // Don't allow continue if not checked
      return;
    }
    // Navigate to first notification screen
    router.push('/first-notification');
  };

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  const handleCommunityGuidelines = () => {
    router.push('/community-guidelines');
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Character Image - positioned to touch black container */}
      <Image 
        source={require('../assets/images/anime girl saying no transparent copy.png')}
        style={styles.characterImage}
        resizeMode="contain"
      />
      
      {/* Black Container with Guidelines - starts immediately after image with rounded top corners */}
      <View style={styles.contentContainer}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>General guidelines</Text>
          </View>

          {/* Warning Section */}
          <View style={[styles.warningSection, { paddingLeft: leftPadding }]}>
            <View style={styles.warningHeader}>
              <Text style={styles.warningIcon}>⚠️</Text>
              <Text style={styles.warningTitle}>Remember, Spellnote is NOT a conversational chatbot!</Text>
            </View>
            
            <Text style={styles.warningText}>
              This means you cannot respond to your character's notifications with text. To modify the notifications, you must manually edit your task or report the characters for any inappropriate behavior.
            </Text>
          </View>

          {/* Prohibited Section */}
          <View style={[styles.prohibitedSection, { paddingLeft: leftPadding }]}>
            <View style={styles.prohibitedHeader}>
              <Text style={styles.prohibitedIcon}>🚫</Text>
              <Text style={styles.prohibitedTitle}>
                Notifications are for task and habit reminders only. Sending personal messages, such as making your character text you what a great friend you are, is not allowed.
              </Text>
            </View>
          </View>

          {/* Agreement Section with minimum 80px padding on sides */}
          <View style={styles.agreementSection}>
            <TouchableOpacity 
              style={styles.checkboxContainer}
              onPress={toggleCheckbox}
              activeOpacity={0.7}
            >
              <View style={styles.checkboxWrapper}>
                <Svg width="21" height="20" viewBox="0 0 21 20" fill="none">
                  <Circle cx="10.5" cy="10" r="10" fill="#F0F3FB"/>
                  {isChecked && (
                    <Path 
                      d="M6 9.5L9.5 13L15 7.5" 
                      stroke="#4A3A7B" 
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </Svg>
              </View>
              <View style={styles.agreementTextContainer}>
                <Text style={styles.agreementText}>
                  <Text style={styles.agreementTextWhite}>I have read and agree to the </Text>
                  <TouchableOpacity onPress={handleCommunityGuidelines} activeOpacity={0.7}>
                    <Text style={styles.agreementTextYellow}>Community Guidelines</Text>
                  </TouchableOpacity>
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Next Step Button - 40px beneath agreement section */}
          <TouchableOpacity 
            style={[
              styles.nextStepButton,
              !isChecked && styles.nextStepButtonDisabled
            ]}
            onPress={handleContinue}
            disabled={!isChecked}
          >
            <Text style={[
              styles.nextStepButtonText,
              !isChecked && styles.nextStepButtonTextDisabled
            ]}>
              Next step
            </Text>
            <Svg width="17" height="14" viewBox="0 0 17 14" fill="none" style={styles.arrowIcon}>
              <Path 
                d="M12.675 7.875H0.5V6.125H12.675L7.075 1.225L8.5 0L16.5 7L8.5 14L7.075 12.775L12.675 7.875Z" 
                fill={!isChecked ? "#9CA3AF" : "#1D1B20"}
              />
            </Svg>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1830', // Changed from #2D2B4A to #1C1830
  },
  characterImage: {
    width: screenWidth,
    height: screenHeight * 0.45, // 45% of screen height
    backgroundColor: '#1C1830', // Changed from #2D2B4A to #1C1830
    // Remove any margins or padding that could create gaps
    margin: 0,
    padding: 0,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#000000',
    // Add 30px rounded corners to upper left and right sides only
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    margin: 0,
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 32,
    // Use negative margin to pull container up and eliminate any potential gap
    marginTop: -1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: -0.28,
  },
  warningSection: {
    marginBottom: 24,
    // paddingLeft is now applied dynamically via inline style
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  warningIcon: {
    fontSize: 16,
    marginTop: 2, // Perfect vertical alignment with text
    width: 20, // Fixed width for consistent alignment
    textAlign: 'center',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E1B8B2',
    flex: 1,
    lineHeight: 20,
    fontFamily: 'Inter',
  },
  warningText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 18,
    marginLeft: 28, // Align with title text (20px icon width + 8px gap)
    fontFamily: 'Inter',
  },
  prohibitedSection: {
    marginBottom: 32,
    // paddingLeft is now applied dynamically via inline style
  },
  prohibitedHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  prohibitedIcon: {
    fontSize: 16,
    marginTop: 2, // Perfect vertical alignment with text
    width: 20, // Fixed width for consistent alignment
    textAlign: 'center',
  },
  prohibitedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    lineHeight: 18,
    fontFamily: 'Inter',
  },
  agreementSection: {
    marginBottom: 40,
    alignItems: 'center', // Center the entire agreement section
    paddingHorizontal: 80, // Minimum 80px padding on either side
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    justifyContent: 'center', // Center horizontally
  },
  checkboxWrapper: {
    width: 20,
    height: 20,
    flexShrink: 0, // Prevent shrinking as specified
    marginTop: 2,
  },
  agreementTextContainer: {
    alignItems: 'center', // Center the text container
  },
  agreementText: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: 'Inter',
    textAlign: 'center', // Center align the text
  },
  agreementTextWhite: {
    fontWeight: '300', // Font weight 300 for white text
    color: '#FFFFFF',
  },
  agreementTextYellow: {
    fontWeight: '500', // Font weight 500 for yellow text
    color: '#F3CC95',
    textDecorationLine: 'underline',
  },
  nextStepButton: {
    // CSS specifications from user
    display: 'flex',
    width: 160,
    height: 56,
    paddingVertical: 17, // 17px top and bottom
    paddingHorizontal: 16, // Adjusted to center text properly instead of 152px
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
    borderRadius: 10,
    backgroundColor: '#F3CC95',
    alignSelf: 'center', // Center the button horizontally
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row', // Arrange text and arrow horizontally
  },
  nextStepButtonDisabled: {
    backgroundColor: '#6B7280', // Gray background when disabled
    shadowOpacity: 0, // Remove shadow when disabled
    elevation: 0,
  },
  nextStepButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1830',
    fontFamily: 'Inter',
  },
  nextStepButtonTextDisabled: {
    color: '#9CA3AF', // Gray text when disabled
  },
  arrowIcon: {
    width: 16,
    height: 14,
    flexShrink: 0,
  },
});