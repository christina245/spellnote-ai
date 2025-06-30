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
import { Phone, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function AccountCreation() {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

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

  const handleCreateAccount = async () => {
    // Reset errors
    setPhoneError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Validate inputs
    let hasErrors = false;

    if (!phone) {
      setPhoneError('Phone number is required');
      hasErrors = true;
    } else if (!validatePhone(phone)) {
      setPhoneError('Please enter a valid phone number');
      hasErrors = true;
    }

    if (!email) {
      setEmailError('Email is required');
      hasErrors = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasErrors = true;
    }

    if (!password) {
      setPasswordError('Password is required');
      hasErrors = true;
    } else if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters');
      hasErrors = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      hasErrors = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      hasErrors = true;
    }

    if (hasErrors) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to phone verification screen with email parameter
      router.push({
        pathname: '/phone-verification',
        params: { 
          email: email,
          phone: phone,
          password: password
        }
      });
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
          {/* Black Container with Form - Moved up to ensure 50px bottom padding */}
          <View style={styles.formContainer}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Let's create your account.</Text>
            </View>

            {/* Demo Note */}
            <View style={styles.demoNote}>
              <Text style={styles.demoNoteText}>
                💡 For demo purposes, you can also sign in with existing credentials: 555-123-4567 / password123
              </Text>
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

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Mail size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, emailError ? styles.inputError : null]}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (emailError) setEmailError('');
                    }}
                    placeholder="email@youremail.com"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
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

              {/* Confirm Password Input */}
              <View style={styles.inputGroup}>
                <View style={styles.inputContainer}>
                  <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, confirmPasswordError ? styles.inputError : null]}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (confirmPasswordError) setConfirmPasswordError('');
                    }}
                    placeholder="Confirm Password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color="#9CA3AF" />
                    ) : (
                      <Eye size={20} color="#9CA3AF" />
                    )}
                  </TouchableOpacity>
                </View>
                {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
              </View>

              {/* Create Account Button */}
              <TouchableOpacity 
                style={[styles.createAccountButton, isLoading && styles.buttonDisabled]}
                onPress={handleCreateAccount}
                disabled={isLoading}
              >
                <Text style={styles.createAccountButtonText}>
                  {isLoading ? 'Creating Account...' : 'Create account'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <Link href="/sign-in" style={styles.signInLink}>
                <Text style={styles.signInLinkText}>Sign in.</Text>
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
    minHeight: screenHeight * 0.5, // Ensure container has enough height
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
  demoNote: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  demoNoteText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#A78BFA',
    fontFamily: 'Inter',
    textAlign: 'center',
    lineHeight: 16,
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
  createAccountButton: {
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
  createAccountButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1830',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signInText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  signInLink: {
    // Link styles are handled by the Text component inside
  },
  signInLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F3CC95',
    textDecorationLine: 'underline',
  },
});