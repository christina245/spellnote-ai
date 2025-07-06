import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert,
  Image,
  Dimensions
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Phone, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function SignIn() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join('-');
    }
    return text;
  };

  // Mock user data - updated with new demo character
  const mockUserData = {
    phone: '555-123-4567',
    password: 'password123',
    userMode: 'character',
    characterType: 'character',
    characterName: 'ARIA',
    characterDescription: 'ARIA (Automated Reminder & Instruction Assistant) - I AM THE AI SYSTEM OF YOUR SPACECRAFT. MY PRIMARY FUNCTION IS TO PROVIDE NOTIFICATIONS AND INSTRUCTIONS TO ENSURE OPTIMAL MISSION PERFORMANCE. I COMMUNICATE IN STANDARDIZED PROTOCOL FORMAT WITHOUT EMOTIONAL VARIANCE.',
    characterVibes: ['practical', 'deadpan', 'systematic'],
    notificationHeader: 'Board game night prep',
    notificationDetails: 'Need to brush up on how to play Catan at 6 pm this Wednesday before board game night at 8. Ping me at 5 and 5:30 pm.',
    time: '6:30 PM',
    startDate: new Date().toISOString(),
    endDate: null,
    isRepeat: false,
    isTextItToMe: false,
    userAvatarUri: require('../assets/images/20250706_1541_Futuristic Spacecraft Cockpit_simple_compose_01jzgyc3yserjtsrq38jpjn75t.png')
  };

  const handleSignIn = async () => {
    // Reset errors
    setPhoneError('');
    setPasswordError('');

    // Validate inputs
    let hasErrors = false;

    if (!phone) {
      setPhoneError('Phone number is required');
      hasErrors = true;
    } else if (!validatePhone(phone)) {
      setPhoneError('Please enter a valid phone number');
      hasErrors = true;
    }

    if (!password) {
      setPasswordError('Password is required');
      hasErrors = true;
    }

    if (hasErrors) return;

    setIsLoading(true);
    
    // Simulate API call and authentication
    setTimeout(() => {
      setIsLoading(false);
      
      // Check credentials against mock data
      if (phone === mockUserData.phone && password === mockUserData.password) {
        // Successful login - navigate to main app with user's saved data
        router.push({
          pathname: '/(tabs)',
          params: {
            userMode: mockUserData.userMode,
            characterType: mockUserData.characterType,
            characterName: mockUserData.characterName,
            characterDescription: mockUserData.characterDescription,
            characterVibes: JSON.stringify(mockUserData.characterVibes),
            userAvatarUri: mockUserData.userAvatarUri,
            notificationHeader: mockUserData.notificationHeader,
            notificationDetails: mockUserData.notificationDetails,
            time: mockUserData.time,
            startDate: mockUserData.startDate,
            endDate: mockUserData.endDate,
            isRepeat: mockUserData.isRepeat.toString(),
            isTextItToMe: mockUserData.isTextItToMe.toString()
          }
        });
      } else {
        // Invalid credentials
        Alert.alert(
          'Sign In Failed', 
          'Invalid phone number or password. Please try again.',
          [{ text: 'OK' }]
        );
      }
    }, 2000);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Background Image - Full width at top of screen */}
      <Image 
        source={require('../assets/images/account creation screen - Diverse Character Ensemble_simple_compose_01jxxbhwf0e8qrb67cd6e42xf8 - 2.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Content Overlay */}
      <KeyboardAvoidingView 
        style={styles.overlayContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Black Container with Form */}
          <View style={styles.formContainer}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Welcome back.</Text>
            </View>

            {/* Demo Credentials Info */}
            <View style={styles.demoInfo}>
              <Text style={styles.demoTitle}>Demo Credentials:</Text>
              <Text style={styles.demoText}>Phone: 555-123-4567</Text>
              <Text style={styles.demoText}>Password: password123</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Phone Input */}
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Phone size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, phoneError ? styles.inputError : null]}
                    value={phone}
                    onChangeText={(text) => {
                      const formatted = formatPhoneNumber(text);
                      setPhone(formatted);
                      if (phoneError) setPhoneError('');
                    }}
                    placeholder="XXX-XXX-XXXX"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                    maxLength={12}
                  />
                </View>
                {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, passwordError ? styles.inputError : null]}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (passwordError) setPasswordError('');
                    }}
                    placeholder="Password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#9CA3AF" />
                    ) : (
                      <Eye size={20} color="#9CA3AF" />
                    )}
                  </TouchableOpacity>
                </View>
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
              </View>

              {/* Log In Button */}
              <TouchableOpacity 
                style={[styles.logInButton, isLoading && styles.buttonDisabled]}
                onPress={handleSignIn}
                disabled={isLoading}
              >
                <Text style={styles.logInButtonText}>
                  {isLoading ? 'Logging In...' : 'Log in'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <Link href="/account-creation" style={styles.signUpLink}>
                <Text style={styles.signUpLinkText}>Create account.</Text>
              </Link>
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
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight * 0.6, // Takes up 60% of screen height
    resizeMode: 'cover',
  },
  overlayContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: 50, // Minimum 50px padding at bottom
  },
  formContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 32,
    paddingBottom: 32, // Ensure internal padding
    width: screenWidth,
    minHeight: screenHeight * 0.5, // Adequate height for content
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 31.2,
    letterSpacing: -0.24,
  },
  demoInfo: {
    backgroundColor: 'rgba(243, 204, 149, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(243, 204, 149, 0.3)',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F3CC95',
    fontFamily: 'Inter',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#F3CC95',
    fontFamily: 'Inter',
    marginBottom: 2,
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    height: '100%',
  },
  eyeIcon: {
    padding: 4,
    marginLeft: 8,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 16,
  },
  logInButton: {
    height: 56,
    backgroundColor: '#F3CC95',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    minWidth: 185,
    maxWidth: 200,
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
  buttonDisabled: {
    opacity: 0.6,
  },
  logInButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1830',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signUpText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  signUpLink: {
    // Link styles are handled by the Text component inside
  },
  signUpLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F3CC95',
    textDecorationLine: 'underline',
  },
});