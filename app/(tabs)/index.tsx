import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  SafeAreaView,
  Alert,
  Modal
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Bell, Plus, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import NavigationMenu from '@/components/NavigationMenu';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface NotificationEntry {
  id: string;
  header: string;
  details: string;
  date: string;
  time: string;
  characterName: string;
  characterType: 'character' | 'spellbot' | 'ai-free';
  avatarSource: any;
  isFirst?: boolean;
  sendWithoutAI?: boolean;
  createdAt: number; // Timestamp for sorting
}

interface CharacterInfo {
  id: string;
  name: string;
  type: 'character' | 'spellbot' | 'ai-free';
  avatarSource: any;
  description?: string;
  vibes?: string[];
  tagline?: string;
  isDemo?: boolean;
}

// CRITICAL: Global notification storage to persist across navigation
let globalNotifications: NotificationEntry[] = [];
let globalProcessedIds: Set<string> = new Set();

export default function HomeTab() {
  const [showNavigationMenu, setShowNavigationMenu] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [notifications, setNotifications] = useState<NotificationEntry[]>([]);
  const [characters, setCharacters] = useState<CharacterInfo[]>([]);
  const [userMode, setUserMode] = useState<'character' | 'spellbot' | 'ai-free'>('character');
  const [activeCharacterId, setActiveCharacterId] = useState<string>('1');
  const router = useRouter();
  const params = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  // Initialize characters with Silicon Valley Techie replacing ARIA
  useEffect(() => {
    const initialCharacters: CharacterInfo[] = [
      {
        id: '1',
        name: 'Muffin the fluffy bunny',
        type: 'character',
        avatarSource: require('../../assets/images/pink bunny copy.jpg'),
        description: 'A sweet and gentle bunny with a fluffy coat and caring personality. Muffin loves to help others stay organized and motivated with gentle reminders.',
        vibes: ['bubbly', 'gentle', 'caring'],
        tagline: 'Your fluffy friend for gentle reminders',
        isDemo: true
      },
      {
        id: '2',
        name: 'Silicon Valley Techie',
        type: 'character',
        avatarSource: require('../../assets/images/20250714_1838_Software Engineer in San Francisco_remix_01k05vn4ypfv3s4xd60vezymnb.png'),
        description: 'Silicon Valley engineer-turned-product manager who\'s navigated the ups and downs of the tech ecosystem, powered by climbing gyms and Y-Combinator podcasts. Has survived multiple pivots, product launches, and the occasional layoff while maintaining their belief that technology can solve meaningful problems. Knows every hiking trail within a 50-mile radius and can debug code as efficiently as they can belay a climbing partner. Their Notion workspace is perfectly organized, their Tesla is always charged, and they genuinely get excited about AI development despite not always knowing the risks.',
        vibes: ['pragmatic', 'ambitious', 'awkward', 'nerdy', 'technical'],
        tagline: 'A typical software developer "building the future, one pull request at a time."',
        isDemo: true
      },
      {
        id: '3',
        name: 'Add Character',
        type: 'character',
        avatarSource: null,
        isDemo: false
      }
    ];
    setCharacters(initialCharacters);
  }, []);

  // Process params and load user data
  useEffect(() => {
    // Set user mode from params
    if (params.userMode) {
      setUserMode(params.userMode as 'character' | 'spellbot' | 'ai-free');
    }

    // Handle new notification from onboarding
    if (params.notificationHeader || params.notificationDetails) {
      const originalId = `${params.notificationHeader}-${params.notificationDetails}-${params.notificationTimestamp}`;
      
      // Additional check to ensure we don't load if user skipped notification creation
      if (!globalProcessedIds.has(originalId)) {
        // Get active character info for notification
        const activeCharacter = characters.find(char => char.id === activeCharacterId);
        
        if (activeCharacter && params.startDate) {
          const newNotification: NotificationEntry = {
            id: originalId,
            header: params.notificationHeader as string || 'Reminder',
            details: params.notificationDetails as string || '',
            date: formatDateForDisplay(new Date(params.startDate as string)),
            time: params.time as string || '6:00 PM',
            characterName: activeCharacter.name,
            characterType: activeCharacter.type,
            avatarSource: activeCharacter.avatarSource,
            isFirst: true,
            sendWithoutAI: params.sendWithoutAI === 'true',
            createdAt: parseInt(params.notificationTimestamp as string) || Date.now()
          };

          globalNotifications.push(newNotification);
          globalProcessedIds.add(originalId);
        }
      }
    }

    // Load notifications from global storage
    setNotifications([...globalNotifications]);
  }, [params, characters, activeCharacterId]);

  const formatDateForDisplay = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const handleNavigationToggle = () => {
    setShowNavigationMenu(!showNavigationMenu);
  };

  const handleNavigate = (route: string) => {
    if (route === 'logout') {
      Alert.alert(
        'Log Out',
        'Are you sure you want to log out?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Log Out', 
            style: 'destructive',
            onPress: () => router.push('/sign-in')
          }
        ]
      );
    } else if (route === 'account') {
      router.push('/user-profile');
    } else if (route === 'help-center') {
      Alert.alert('Help Center', 'Help center is coming soon!');
    } else if (route === 'contact-support') {
      Alert.alert('Contact Support', 'Contact support is coming soon!');
    } else {
      router.push(`/${route}`);
    }
  };

  const handleAddNotification = () => {
    // Prepare characters data for add-notification screen
    const charactersForNotification = characters.map(char => ({
      id: char.id,
      name: char.name,
      isEmpty: char.name === 'Add Character',
      avatarSource: char.avatarSource
    }));

    router.push({
      pathname: '/add-notification',
      params: {
        characters: JSON.stringify(charactersForNotification),
        activeCharacterId: activeCharacterId
      }
    });
  };

  const handleCharacterPress = (characterId: string) => {
    const character = characters.find(c => c.id === characterId);
    if (character) {
      if (character.name === 'Add Character') {
        router.push('/create-character');
      } else {
        // Navigate to character profile
        router.push({
          pathname: '/character-profile',
          params: {
            characterName: character.name,
            characterDescription: character.description || '',
            characterTagline: character.tagline || '',
            characterVibes: JSON.stringify(character.vibes || []),
            userAvatarUri: character.avatarSource ? undefined : undefined
          }
        });
      }
    }
  };

  const handleNotificationPress = (notification: NotificationEntry) => {
    router.push({
      pathname: '/edit-notification',
      params: {
        notificationHeader: notification.header,
        notificationDetails: notification.details,
        notificationTime: notification.time,
        startDate: new Date().toISOString(), // Current date as fallback
        sendWithoutAI: notification.sendWithoutAI?.toString() || 'false'
      }
    });
  };

  const getNotificationsForDate = (date: Date) => {
    const dateString = formatDateForDisplay(date);
    return notifications.filter(notification => notification.date === dateString);
  };

  const renderDateSection = (date: Date, label: string) => {
    const dayNotifications = getNotificationsForDate(date);
    
    return (
      <View key={label} style={styles.dateSection}>
        <Text style={styles.dateHeader}>{label}</Text>
        {dayNotifications.length > 0 ? (
          dayNotifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={styles.notificationCard}
              onPress={() => handleNotificationPress(notification)}
              activeOpacity={0.7}
            >
              <View style={styles.notificationHeader}>
                <View style={styles.notificationAvatarContainer}>
                  <Image 
                    source={notification.avatarSource}
                    style={styles.notificationAvatar}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.notificationContent}>
                  <View style={styles.notificationTitleRow}>
                    <Text style={styles.notificationTitle}>
                      {notification.header}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {notification.time}
                    </Text>
                  </View>
                  <Text style={styles.notificationDetails} numberOfLines={2}>
                    {notification.details}
                  </Text>
                  <Text style={styles.notificationSender}>
                    from {notification.characterName}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No notifications scheduled</Text>
          </View>
        )}
      </View>
    );
  };

  if (!fontsLoaded) {
    return null;
  }

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Spellnote</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => {/* Notifications functionality */}}
            activeOpacity={0.7}
          >
            <Bell size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleNavigationToggle}
            activeOpacity={0.7}
          >
            <View style={styles.menuDots}>
              <View style={styles.menuDot} />
              <View style={styles.menuDot} />
              <View style={styles.menuDot} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Characters Section */}
        <View style={styles.charactersSection}>
          <Text style={styles.sectionTitle}>Characters</Text>
          <View style={styles.charactersGrid}>
            {characters.map((character) => (
              <TouchableOpacity
                key={character.id}
                style={styles.characterCard}
                onPress={() => handleCharacterPress(character.id)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.characterAvatarContainer,
                  character.name === 'Add Character' && styles.addCharacterContainer
                ]}>
                  {character.name === 'Add Character' ? (
                    <Plus size={24} color="#9CA3AF" />
                  ) : (
                    <Image 
                      source={character.avatarSource}
                      style={styles.characterAvatar}
                      resizeMode="cover"
                    />
                  )}
                </View>
                <Text style={[
                  styles.characterName,
                  character.name === 'Add Character' && styles.addCharacterName
                ]}>
                  {character.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.notificationsSection}>
          <View style={styles.notificationsSectionHeader}>
            <Text style={styles.sectionTitle}>Notifications</Text>
            <TouchableOpacity 
              style={styles.addNotificationButton}
              onPress={handleAddNotification}
              activeOpacity={0.7}
            >
              <Plus size={20} color="#F3CC95" />
              <Text style={styles.addNotificationText}>Add notification</Text>
            </TouchableOpacity>
          </View>

          {/* Date Sections */}
          {renderDateSection(today, 'Today')}
          {renderDateSection(tomorrow, 'Tomorrow')}
        </View>
      </ScrollView>

      {/* Navigation Menu */}
      <NavigationMenu
        visible={showNavigationMenu}
        onClose={() => setShowNavigationMenu(false)}
        onNavigate={handleNavigate}
        userMode={userMode}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerButton: {
    padding: 8,
  },
  menuDots: {
    flexDirection: 'row',
    gap: 4,
  },
  menuDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  charactersSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    marginBottom: 16,
  },
  charactersGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  characterCard: {
    flex: 1,
    alignItems: 'center',
  },
  characterAvatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  addCharacterContainer: {
    backgroundColor: '#374151',
    borderWidth: 2,
    borderColor: '#4B5563',
    borderStyle: 'dashed',
  },
  characterAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  characterName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  addCharacterName: {
    color: '#9CA3AF',
    fontWeight: '400',
  },
  notificationsSection: {
    flex: 1,
  },
  notificationsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addNotificationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(243, 204, 149, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(243, 204, 149, 0.3)',
  },
  addNotificationText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F3CC95',
    fontFamily: 'Inter',
  },
  dateSection: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8DD3C8',
    fontFamily: 'Inter',
    marginBottom: 12,
  },
  notificationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationAvatarContainer: {
    marginRight: 12,
  },
  notificationAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    flex: 1,
    marginRight: 8,
  },
  notificationTime: {
    fontSize: 14,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter',
  },
  notificationDetails: {
    fontSize: 14,
    fontWeight: '400',
    color: '#E5E7EB',
    fontFamily: 'Inter',
    lineHeight: 18,
    marginBottom: 8,
  },
  notificationSender: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8DD3C8',
    fontFamily: 'Inter',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter',
  },
});