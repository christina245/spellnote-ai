import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function PhoneVerification() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  const inputRef = useRef<TextInput>(null);
  const wingAnimation = useRef(new Animated.Value(0)).current;

  // Get email from navigation params or use default
  const userEmail = params.email as string || 'useremail@gmail.com';

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  useEffect(() => {
    // Create wing flapping animation
    const createWingAnimation = () => {
      return Animated.sequence([
        Animated.timing(wingAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(wingAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]);
    };

    // Start the animation loop
    const animationLoop = () => {
      createWingAnimation().start(() => {
        setTimeout(animationLoop, 2000);
      });
    };

    animationLoop();
  }, [wingAnimation]);

  const handleCodeChange = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 6);
    setCode(numericValue);

    // Auto-verify when 6 digits are entered
    if (numericValue.length === 6) {
      handleVerify(numericValue);
    }
  };

  const handleVerify = async (verificationCode: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to next screen (rules or main app)
      router.push('/rules');
    }, 1500);
  };

  // Format code display with proper spacing and placeholder handling
  const formatCodeDisplay = () => {
    const digits = code.split('');
    const displayCode = [];
    
    for (let i = 0; i < 6; i++) {
      if (digits[i]) {
        // Show actual digit if entered
        displayCode.push(digits[i]);
      } else if (code.length > 0) {
        // Show underscore for empty positions when user has started typing
        displayCode.push('_');
      } else {
        // Show X for placeholder when no input
        displayCode.push('X');
      }
    }
    
    return displayCode.join(' ');
  };

  const handleInputPress = () => {
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  if (!fontsLoaded) {
    return null;
  }

  // Wing animation interpolation
  const wingRotation = wingAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '10deg'],
  });

  const wingScale = wingAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.overlayContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Animated Winged Email - minimum 30px from top */}
          <View style={styles.imageContainer}>
            <Animated.View
              style={[
                styles.wingContainer,
                {
                  transform: [
                    { rotate: wingRotation },
                    { scale: wingScale },
                  ],
                },
              ]}
            >
              <Image 
                source={require('../assets/images/fantasy winged email transparent.png')}
                style={styles.wingedEmail}
                resizeMode="contain"
              />
            </Animated.View>
          </View>

          {/* Main Content - moved up by 70px */}
          <View style={styles.contentContainer}>
            {/* User Email - minimum 20px gap from winged photo */}
            <Text style={styles.emailText}>Hi {userEmail},</Text>
            
            {/* Instructions */}
            <Text style={styles.instructionText}>
              you should be receiving a text to verify{'\n'}
              your phone number right now.
            </Text>

            {/* Code Input - moved up by 15px */}
            <TouchableOpacity 
              style={[
                styles.codeInputContainer,
                isFocused && styles.codeInputFocused
              ]} 
              onPress={handleInputPress} 
              activeOpacity={0.8}
            >
              <View style={styles.codeBackground}>
                <Text style={[
                  styles.codeDisplay, 
                  code.length === 0 && styles.placeholderText
                ]}>
                  {formatCodeDisplay()}
                </Text>
                <TextInput
                  ref={inputRef}
                  style={styles.editableInput}
                  value={code}
                  onChangeText={handleCodeChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  keyboardType="number-pad"
                  maxLength={6}
                  autoFocus
                  placeholder=""
                  placeholderTextColor="transparent"
                  selectionColor="#F3CC95"
                  textAlign="center"
                />
              </View>
            </TouchableOpacity>

            <Text style={styles.codeLabel}>Enter 6-digit verification code</Text>

            {/* Preview Section */}
            <View style={styles.previewSection}>
              <Text style={styles.previewTitle}>When that's done,</Text>
              <Text style={styles.previewSubtitle}>
                you'll be able to set up customizable{'\n'}
                notifications such as:
              </Text>

              {/* Notification Examples */}
              <View style={styles.notificationList}>
                <View style={styles.notificationItem}>
                  <Text style={styles.notificationIcon}>🤬</Text>
                  <Text style={styles.notificationText}>
                    a list of clapbacks for your family reunion next Sunday
                  </Text>
                </View>

                <View style={styles.notificationItem}>
                  <Text style={styles.notificationIcon}>⛔️</Text>
                  <Text style={styles.notificationText}>
                    lines to NOT to say on your next date on Friday
                  </Text>
                </View>

                <View style={styles.notificationItem}>
                  <Text style={styles.notificationIcon}>💧</Text>
                  <Text style={styles.notificationText}>
                    reminders to drink water every day at 3 pm
                  </Text>
                </View>

                <View style={styles.notificationItem}>
                  <Text style={styles.notificationIcon}>🤸</Text>
                  <Text style={styles.notificationText}>
                    reminders to stretch before the gym every other day at 4 pm
                  </Text>
                </View>

                <View style={styles.notificationItem}>
                  <Text style={styles.notificationIcon}>📺</Text>
                  <Text style={styles.notificationText}>
                    a reminder to check out that one series someone told you about
                  </Text>
                </View>

                <View style={styles.notificationItem}>
                  <Text style={styles.notificationIcon}>💡</Text>
                  <Text style={styles.notificationText}>
                    an idea for a TikTok video you should film at a certain time and place
                  </Text>
                </View>

                <View style={styles.notificationItem}>
                  <Text style={styles.notificationIcon}>😀</Text>
                  <Text style={styles.notificationText}>...and so much more</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1830',
  },
  overlayContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 40,
    paddingTop: 30, // Minimum 30px from top of screen
    paddingBottom: 50,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20, // Minimum 20px gap to email text (reduced from 50px)
  },
  wingContainer: {
    // Container for the animated wings
  },
  wingedEmail: {
    width: 300, // 3x bigger (was 100px)
    height: 300, // 3x bigger (was 100px)
  },
  contentContainer: {
    flex: 1,
    marginTop: -70, // Move all content up by 70px as requested
  },
  emailText: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 26,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 20,
    marginBottom: 25, // Reduced from 40px to 25px (moved up by 15px)
  },
  codeInputContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  codeInputFocused: {
    // Add focus styling if needed
  },
  codeBackground: {
    minWidth: 160, // Increased minimum width to prevent wrapping
    width: Math.max(160, screenWidth * 0.45), // Responsive width with larger minimum
    maxWidth: screenWidth - 80, // Ensure it doesn't exceed screen bounds
    height: 60, // Increased height to ensure digits are fully visible
    paddingVertical: 20, // 20px top and bottom padding
    paddingHorizontal: 15, // Fixed 15px side padding for better spacing
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(60, 60, 67, 0.30)',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'rgba(243, 204, 149, 0.06)', // Decreased opacity by 80% (was 0.3, now 0.06)
  },
  codeDisplay: {
    fontSize: 18, // Slightly smaller to ensure no wrapping
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 3, // Reduced letter spacing to prevent wrapping
    fontFamily: 'monospace',
    textAlign: 'center',
    lineHeight: 22, // Adjusted line height
    position: 'absolute',
    zIndex: 1,
    pointerEvents: 'none', // Allow touches to pass through to input
    width: '100%', // Ensure full width usage
    flexShrink: 0, // Prevent shrinking
  },
  placeholderText: {
    opacity: 0.5, // 50% opacity for placeholder when no input
  },
  editableInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    fontSize: 18, // Match the display font size
    fontWeight: '600',
    color: 'transparent', // Make input text invisible since we show it via codeDisplay
    fontFamily: 'monospace',
    letterSpacing: 3, // Match display letter spacing
    textAlign: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    zIndex: 2,
    paddingVertical: 20,
    paddingHorizontal: 15, // Match container padding
    width: '100%', // Ensure full width
    flexShrink: 0, // Prevent shrinking
  },
  codeLabel: {
    fontSize: 14,
    color: '#E1B8B2', // Changed from #9CA3AF to #E1B8B2
    textAlign: 'center',
    marginBottom: 50,
  },
  previewSection: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 26,
  },
  previewSubtitle: {
    fontSize: 16,
    fontWeight: '500', // Increased from 400 to 500 (100 weight increase)
    color: '#FFFFFF',
    lineHeight: 20,
    marginBottom: 24,
  },
  notificationList: {
    gap: 16,
    // Remove the right padding to align with the paragraph above
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    // Remove individual item padding to match paragraph alignment
  },
  notificationIcon: {
    fontSize: 16,
    marginTop: 2,
    flexShrink: 0, // Prevent icon from shrinking
    width: 20, // Fixed width for consistent alignment
  },
  notificationText: {
    color: '#FFF',
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18, // Increased from 14 to 18 for better readability
    flex: 1,
    flexWrap: 'wrap', // Allow text to wrap naturally
  },
});