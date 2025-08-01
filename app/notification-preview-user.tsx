import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { BlurView } from 'expo-blur';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface NotificationData {
  characterName: string;
  characterType: 'spellbot' | 'character' | 'ai-free';
  notificationHeader: string;
  notificationDetails: string;
  characterVibes?: string[];
  characterDescription?: string;
  characterTagline?: string;
  avatarSource: any;
  userAvatarUri?: string;
}

export default function NotificationPreviewUser() {
  const [collapsedText, setCollapsedText] = useState('');
  const [openText, setOpenText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  // Function to get the appropriate avatar source
  const getAvatarSource = () => {
    // Check if user uploaded a custom avatar
    const userAvatarUri = params.userAvatarUri as string;
    if (userAvatarUri) {
      return { uri: userAvatarUri };
    }
    
    // Handle specific character IDs from browse-characters
    const characterId = params.characterId as string;
    if (characterId === 'demo-muffin-1') {
      return require('../assets/images/pink bunny copy copy.jpg');
    } else if (characterId === 'demo-aria-2') {
      return require('../assets/images/20250706_1541_Futuristic Spacecraft Cockpit_simple_compose_01jzgyc3yserjtsrq38jpjn75t copy copy.png');
    } else if (characterId === 'demo-rave-addict-3') {
      return require('../assets/images/20250706_2138_Festival Fun_remix_01jzhjrj5xejnvemxvax2k067h.png');
    }
    
    // Fall back to default avatars based on character type
    if (params.characterType === 'spellbot') {
      return require('../assets/images/square logo 2.png');
    } else {
      return require('../assets/images/20250616_1452_Diverse Character Ensemble_simple_compose_01jxxbhwf0e8qrb67cd6e42xf8.png');
    }
  };

  const notificationData: NotificationData = {
    characterName: params.characterType === 'spellbot' ? 'Spellnote.ai' : (params.characterName as string || 'Character Name'),
    characterType: (params.characterType as 'spellbot' | 'character' | 'ai-free') || 'character',
    notificationHeader: params.notificationHeader as string || '',
    notificationDetails: params.notificationDetails as string || '',
    characterVibes: params.characterVibes ? JSON.parse(params.characterVibes as string) : ['dramatic', 'witty', 'fiery'],
    characterDescription: params.characterDescription as string || 'A fierce and dramatic warrior with a sharp wit and fiery personality. Known for being intense and passionate about everything.',
    characterTagline: params.characterTagline as string || '',
    avatarSource: getAvatarSource(),
    userAvatarUri: params.userAvatarUri as string
  };

  useEffect(() => {
    generateNotificationContent();
  }, []);

  const generateNotificationContent = async () => {
    setIsLoading(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const userHeader = notificationData.notificationHeader;
    const userDetails = notificationData.notificationDetails;
    const characterName = notificationData.characterName;
    
    const mainContent = userDetails || userHeader;
    const headerContent = userHeader || 'Reminder';
    
    if (notificationData.characterType === 'spellbot') {
      // Generate neutral, ChatGPT-like content based on user input
      if (userHeader.toLowerCase().includes('board game') || userDetails.toLowerCase().includes('catan') || userDetails.toLowerCase().includes('board game')) {
        setCollapsedText('Time to prepare for board game night! 🎲');
        setOpenText('Hi there! Just a friendly reminder that you wanted to brush up on Catan rules before tonight\'s game. You mentioned wanting to review at 5 and 5:30 PM, so here\'s your notification. Have a great game night!');
      } else if (userHeader || userDetails) {
        // Generic Spellbot response for other user content
        setCollapsedText(userHeader || 'Reminder notification');
        setOpenText(`Hi! Here's your reminder: ${userDetails || userHeader}. Hope this helps you stay on track!`);
      } else {
        // Fallback if no user input (shouldn't happen with validation)
        setCollapsedText('Reminder notification');
        setOpenText('Hi! This is your scheduled reminder. Hope this helps you stay on track!');
      }
    } else if (notificationData.characterType === 'ai-free') {
      // Use exact user input without AI modification
      setCollapsedText(notificationData.notificationHeader || (notificationData.notificationDetails ? 'Reminder' : 'Reminder'));
      setOpenText(notificationData.notificationDetails || notificationData.notificationHeader || 'Your reminder details will appear here.');
    } else {
      // ARIA spacecraft AI character
      if (characterName === 'ARIA') {
        const ariaResponse = generateARIANotification(userHeader, userDetails);
        setCollapsedText(ariaResponse.collapsed);
        setOpenText(ariaResponse.open);
      } else {
        // Generate character-specific content based on vibes and description
        const vibes = notificationData.characterVibes || [];
        const isDramatic = vibes.includes('dramatic');
        const isWitty = vibes.includes('witty');
        const isFiery = vibes.includes('fiery');
        
        if (isDramatic && isFiery && mainContent) {
          setCollapsedText(`⚔️ ${headerContent.toUpperCase()} AWAITS! ⚔️`);
          setOpenText(`Listen up, mortal! The time has come for: ${mainContent}. You WILL conquer this task with the fury of a thousand suns! Failure is NOT an option! Victory awaits! 🔥⚔️`);
        } else if (isWitty && isDramatic && mainContent) {
          setCollapsedText(`🎭 Your dramatic destiny: ${headerContent}`);
          setOpenText(`Well, well, well... looks like someone needs a reminder about "${mainContent}." Don't worry, I'll make sure you handle this with all the dramatic flair it deserves. Try not to overthink it! 🎲✨`);
        } else if (isWitty && mainContent) {
          setCollapsedText(`🧠 Time for some "${headerContent}" action 📚`);
          setOpenText(`Oh, so you need a reminder about "${mainContent}"? What's next, reminding you to breathe? 😏 But seriously, this won't handle itself. Get to it! 🎯`);
        } else if (mainContent) {
          // Default character response using user input
          setCollapsedText(`🎯 ${headerContent} time approaches!`);
          setOpenText(`Hey there! Time for your reminder: ${mainContent}. You've got this! 🏆`);
        } else {
          // Fallback if no user input (shouldn't happen with validation)
          setCollapsedText('🎯 Reminder time!');
          setOpenText('Hey there! This is your scheduled reminder. You\'ve got this! 🏆');
        }
      }
    }
    
    setIsLoading(false);
  };

  // ARIA notification generation function
  const generateARIANotification = (userHeader: string, userDetails: string) => {
    const mainContent = userDetails || userHeader;
    const headerContent = userHeader || 'Task Reminder';
    
    // Detect content type for appropriate ARIA protocol
    const content = mainContent.toLowerCase();
    
    // Water/Hydration
    if (content.includes('water') || content.includes('drink') || content.includes('hydrat')) {
      return {
        collapsed: 'HYDRATION PROTOCOL: System recommends fluid intake',
        open: `BIOLOGICAL SYSTEMS: Water reserves require replenishment. Reference: ${mainContent}. Status: Pending. Please proceed to hydration station.`
      };
    }
    
    // Exercise/Movement
    if (content.includes('exercise') || content.includes('workout') || content.includes('gym') || content.includes('run') || content.includes('walk') || content.includes('stretch')) {
      return {
        collapsed: 'MOBILITY PROTOCOL: Physical activity cycle scheduled',
        open: `SYSTEM ADVISORY: Cardiovascular maintenance routine now available for execution. Reference: ${mainContent}. Awaiting user confirmation.`
      };
    }
    
    // Medication
    if (content.includes('medication') || content.includes('medicine') || content.includes('pill') || content.includes('dose') || content.includes('prescription')) {
      return {
        collapsed: 'PHARMACEUTICAL PROTOCOL: Medication administration window active',
        open: `MEDICAL SYSTEMS: Prescription compliance reminder. Reference: ${mainContent}. Health maintenance schedule indicates dosage required at current time.`
      };
    }
    
    // Sleep/Rest
    if (content.includes('sleep') || content.includes('bed') || content.includes('rest') || content.includes('nap')) {
      return {
        collapsed: 'SLEEP CYCLE OPTIMIZATION: Rest period protocol initiated',
        open: `BIOLOGICAL SYSTEMS: Sleep preparation sequence should commence. Reference: ${mainContent}. System recommends shutdown procedures.`
      };
    }
    
    // Board games (specific to the demo content)
    if (content.includes('board game') || content.includes('catan') || content.includes('game night')) {
      return {
        collapsed: 'RECREATIONAL PROTOCOL: Game preparation sequence initiated',
        open: `TASK REMINDER: User-defined recreational objective requires attention. Reference: ${mainContent}. Priority: Standard. Execution window now open.`
      };
    }
    
    // Generic task
    return {
      collapsed: `TASK REMINDER: ${headerContent} protocol queued`,
      open: `SCHEDULED ACTIVITY: User-defined objective requires attention. Reference: ${mainContent}. Priority: Standard. Execution window now open.`
    };
  };

  const handleBack = () => {
    router.back();
  };

  const handleNextStep = () => {
    // Check if user selected Character Mode or Spellbot - if so, navigate to SMS integration
    if (notificationData.characterType === 'character' || notificationData.characterType === 'spellbot') {
      router.push({
        pathname: '/sms-integration',
        params: {
          characterType: notificationData.characterType,
          characterName: notificationData.characterName,
          avatarSource: notificationData.characterType === 'spellbot' ? 'spellbot' : 'character',
          userAvatarUri: notificationData.userAvatarUri,
          // CRITICAL: Pass through ALL notification data
          notificationHeader: params.notificationHeader,
          notificationDetails: params.notificationDetails,
          time: params.time,
          startDate: params.startDate,
          endDate: params.endDate,
          isRepeat: params.isRepeat,
          isTextItToMe: params.isTextItToMe,
          // Also pass character creation data if available
          characterVibes: params.characterVibes,
          characterDescription: params.characterDescription,
          characterTagline: params.characterTagline
        }
      });
    } else {
      // For AI-free users, navigate directly to main app dashboard
      router.push({
        pathname: '/(tabs)',
        params: {
          userMode: 'ai-free',
          characterType: 'ai-free',
          characterName: 'AI-Free Mode',
          // Pass through notification data to homepage
          notificationHeader: params.notificationHeader,
          notificationDetails: params.notificationDetails,
          time: params.time,
          startDate: params.startDate,
          endDate: params.endDate,
          isRepeat: params.isRepeat,
          isTextItToMe: params.isTextItToMe,
          notificationTimestamp: params.notificationTimestamp
        }
      });
    }
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
          <Text style={styles.title}>
            Here's how your{'\n'}
            notification will look.
          </Text>
          <Text style={styles.subtitle}>
            Remember, this is all AI and not a real person.
          </Text>
          <Text style={styles.description}>
            Character outputs may contain mistakes. You can report issues and inappropriate outputs on each character's profile page.
          </Text>
        </View>

        {/* Collapsed Notification Section */}
        <View style={styles.notificationSection}>
          <Text style={styles.sectionLabel}>UNOPENED</Text>
          <BlurView intensity={80} style={styles.collapsedNotification}>
            <View style={styles.notificationOverlay}>
              <View style={styles.notificationHeader}>
                <View style={styles.avatarContainer}>
                  <Image 
                    source={notificationData.avatarSource}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.notificationHeaderContent}>
                  <View style={styles.notificationHeaderTop}>
                    <Text style={styles.appName}>{notificationData.characterName}</Text>
                    <Text style={styles.timeText}>now</Text>
                  </View>
                  <View style={styles.notificationContent}>
                    {isLoading ? (
                      <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Generating notification...</Text>
                        <View style={styles.loadingDots}>
                          <Text style={styles.loadingDot}>●</Text>
                          <Text style={styles.loadingDot}>●</Text>
                          <Text style={styles.loadingDot}>●</Text>
                        </View>
                      </View>
                    ) : (
                      <Text style={styles.notificationText} numberOfLines={2}>{collapsedText}</Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </BlurView>
        </View>

        {/* Open Notification Section */}
        <View style={styles.notificationSection}>
          <Text style={styles.sectionLabel}>OPENED</Text>
          <View style={styles.openNotificationContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Generating message...</Text>
                <View style={styles.loadingDots}>
                  <Text style={styles.loadingDot}>●</Text>
                  <Text style={styles.loadingDot}>●</Text>
                  <Text style={styles.loadingDot}>●</Text>
                </View>
              </View>
            ) : (
              <>
                <View style={styles.speechBubble}>
                  <Text style={styles.speechBubbleText}>{openText}</Text>
                  <View style={styles.speechBubbleTail} />
                </View>
                <View style={styles.characterInfo}>
                  <View style={styles.characterAvatarContainer}>
                    <Image 
                      source={notificationData.avatarSource}
                      style={styles.characterAvatar}
                      resizeMode="cover"
                    />
                  </View>
                  <Text style={styles.characterName}>{notificationData.characterName}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Next Step Button */}
        <TouchableOpacity 
          style={[styles.nextStepButton, isLoading && styles.nextStepButtonDisabled]}
          onPress={handleNextStep}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.nextStepButtonText}>Next step</Text>
          <ArrowRight size={16} color="#1D1B20" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#19162A',
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
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 17.5,
    fontFamily: 'Inter',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 17.5,
    fontFamily: 'Inter',
  },
  notificationSection: {
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
  collapsedNotification: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  notificationOverlay: {
    backgroundColor: 'rgba(28, 28, 30, 0.5)',
    padding: 16,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  notificationHeaderContent: {
    flex: 1,
  },
  notificationHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  appName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  timeText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#8E8E93',
    fontFamily: 'Inter',
  },
  notificationContent: {
    // No left padding needed since it's in the flex container
  },
  notificationText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    lineHeight: 20,
  },
  openNotificationContainer: {
    minHeight: 120,
    justifyContent: 'flex-end',
  },
  speechBubble: {
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    padding: 30,
    marginBottom: 16,
    position: 'relative',
    alignSelf: 'flex-start',
    maxWidth: screenWidth - 100,
  },
  speechBubbleText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#1F2937',
    fontFamily: 'Inter',
    lineHeight: 18,
  },
  speechBubbleTail: {
    position: 'absolute',
    bottom: -8,
    left: 30,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#E5E7EB',
  },
  characterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  characterAvatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
  },
  characterAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  characterName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter',
    marginBottom: 8,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  loadingDot: {
    fontSize: 16,
    color: '#9CA3AF',
    opacity: 0.6,
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
    marginTop: 20,
  },
  nextStepButtonDisabled: {
    opacity: 0.6,
  },
  nextStepButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1B20',
    fontFamily: 'Inter',
  },
});