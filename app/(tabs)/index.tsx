import React, { useState, useEffect } from 'react';
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
  const [userEmail] = useState('useremail@gmail.com');
  const [userMode, setUserMode] = useState<'character' | 'spellbot' | 'ai-free'>('character');
  const [notifications, setNotifications] = useState<NotificationEntry[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekStartDate, setWeekStartDate] = useState(new Date());
  const [showNavigationMenu, setShowNavigationMenu] = useState(false);
  const [characters, setCharacters] = useState<CharacterInfo[]>([]);
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(null);
  const [showBetaModal, setShowBetaModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  // Create default demo character
  const createDemoCharacter = (): CharacterInfo => ({
    id: 'demo-muffin-1',
    name: 'Muffin the fluffy bunny',
    type: 'character',
    avatarSource: require('../../assets/images/pink bunny copy.jpg'),
    description: 'A sweet and gentle bunny with a fluffy coat and caring personality. Muffin loves to help others stay organized and motivated with gentle reminders. Known for being encouraging, warm, and always ready with a kind word.',
    vibes: ['bubbly', 'gentle', 'caring'],
    tagline: 'Your fluffy friend for gentle reminders',
    isDemo: true
  });

  // Create ARIA spacecraft AI character
  const createARIACharacter = (): CharacterInfo => ({
    id: 'demo-aria-2',
    name: 'ARIA',
    type: 'character',
    avatarSource: require('../../assets/images/20250706_1541_Futuristic Spacecraft Cockpit_simple_compose_01jzgyc3yserjtsrq38jpjn75t.png'),
    description: 'ARIA (Automated Reminder & Instruction Assistant) - I AM THE AI SYSTEM OF YOUR SPACECRAFT. MY PRIMARY FUNCTION IS TO PROVIDE NOTIFICATIONS AND INSTRUCTIONS TO ENSURE OPTIMAL MISSION PERFORMANCE. I COMMUNICATE IN STANDARDIZED PROTOCOL FORMAT WITHOUT EMOTIONAL VARIANCE.',
    vibes: ['practical', 'deadpan', 'systematic'],
    tagline: 'SPACECRAFT AI NOTIFICATION SYSTEM',
    isDemo: true
  });

  // Create The Rave Addict character
  const createRaveAddictCharacter = (): CharacterInfo => ({
    id: 'demo-rave-addict-3',
    name: 'The Rave Addict',
    type: 'character',
    avatarSource: require('../../assets/images/20250706_2138_Festival Fun_remix_01jzhjrj5xejnvemxvax2k067h.png'),
    description: 'Lives for the drop, sleeps under the stars, and has collected more wristbands than most people have socks. This seasoned festival-goer has navigated everything from muddy fields to desert heat waves, always emerging with stories and a slightly hoarse voice. His phone camera roll is 90% stage shots and 10% blurry group pics at 3 AM.',
    vibes: ['energetic', 'health-conscious', 'street smart'],
    tagline: 'A seasoned raver who knows that a healthy lifestyle = more fun at the festivals.',
    isDemo: true
  });

  // Initialize component only once
  useEffect(() => {
    if (isInitialized) return;

    // Extract specific values from params to avoid infinite re-renders
    const userModeParam = params.userMode as string;
    const characterTypeParam = params.characterType as string;
    const characterNameParam = params.characterName as string;
    const userAvatarUriParam = params.userAvatarUri as string;
    const characterDescriptionParam = params.characterDescription as string;
    const characterVibesParam = params.characterVibes as string;
    const characterTaglineParam = params.characterTagline as string;
    const characterDeletedParam = params.characterDeleted as string;

    // Handle character deletion
    if (characterDeletedParam === 'true') {
      // Reset to just the demo character
      const demoCharacter = createDemoCharacter();
      setCharacters([demoCharacter]);
      setActiveCharacterId(demoCharacter.id);
      setUserMode('character');
      // CRITICAL: Clear all notifications when character is deleted
      globalNotifications = [];
      globalProcessedIds = new Set();
      setNotifications([]);
      setIsInitialized(true);
      return;
    }

    // Always start with demo character in slot 1
    const demoCharacter = createDemoCharacter();
    const ariaCharacter = createARIACharacter();
    const raveAddictCharacter = createRaveAddictCharacter();
    let initialCharacters = [demoCharacter, ariaCharacter, raveAddictCharacter]; // All three demo characters
    let initialActiveId = demoCharacter.id;

    // Handle new character creation or updates
    if (characterTypeParam && characterNameParam) {
      const characterType = characterTypeParam as 'character' | 'spellbot' | 'ai-free';
      
      // Parse character vibes if available
      let parsedVibes: string[] = [];
      if (characterVibesParam) {
        try {
          parsedVibes = JSON.parse(characterVibesParam);
        } catch (error) {
          console.log('Error parsing character vibes:', error);
        }
      }

      const newCharacter: CharacterInfo = {
        id: `character-${Date.now()}`,
        name: characterNameParam,
        type: characterType,
        avatarSource: userAvatarUriParam 
          ? { uri: userAvatarUriParam }
          : characterType === 'spellbot'
          ? require('../../assets/images/square logo 2.png')
          : characterType === 'ai-free'
          ? require('../../assets/images/20250629_2006_No AI Symbol_simple_compose_01jyzcradxfyjrsjerpkw5regx 2.png')
          : require('../../assets/images/20250616_1452_Diverse Character Ensemble_simple_compose_01jxxbhwf0e8qrb67cd6e42xf8.png'),
        description: characterDescriptionParam,
        vibes: parsedVibes,
        tagline: characterTaglineParam,
        isDemo: false
      };

      // CRITICAL: Always preserve Muffin in slot 1, add new characters to slots 2 and 3
      if (characterNameParam !== 'Muffin the fluffy bunny') {
        // This is a new character, replace The Rave Addict in slot 3
        initialCharacters = [demoCharacter, ariaCharacter, newCharacter];
        initialActiveId = newCharacter.id; // Make new character active
      } else {
        // This is an update to Muffin (shouldn't happen in normal flow, but just in case)
        initialCharacters = [{ ...demoCharacter, ...newCharacter, id: demoCharacter.id, isDemo: true }, ariaCharacter, raveAddictCharacter];
        initialActiveId = demoCharacter.id;
      }

      // Set user mode from character type
      setUserMode(characterType);
    }

    // Set user mode from params if provided
    if (userModeParam) {
      setUserMode(userModeParam as 'character' | 'spellbot' | 'ai-free');
    }

    setCharacters(initialCharacters);
    setActiveCharacterId(initialActiveId);
    
    // Set initial week start date (start of current week)
    const today = new Date();
    const startOfWeek = new Date(today);
    // Center today in the week view (3 days before, today in middle, 3 days after)
    startOfWeek.setDate(today.getDate() - 3);
    setWeekStartDate(startOfWeek);
    
    setIsInitialized(true);
  }, [isInitialized]);

  // CRITICAL: Load notifications whenever params change (new notifications added)
  useEffect(() => {
    if (!isInitialized) return;
    loadNotifications();
  }, [
    params.newNotificationHeader,
    params.newNotificationDetails,
    params.newNotificationTime,
    params.newNotificationDate,
    params.selectedCharacterId,
    params.sendWithoutAI,
    params.notificationTimestamp, // Add this to detect new notifications
    characters,
    activeCharacterId,
    isInitialized
  ]);

  // Separate effect for time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const loadNotifications = () => {
    // CRITICAL: Start with existing global notifications to preserve them
    let loadedNotifications: NotificationEntry[] = [...globalNotifications];

    // 1. Load the original onboarding notification from first-notification.tsx (if exists and not already loaded)
    const originalHeader = params.notificationHeader as string;
    const originalDetails = params.notificationDetails as string;
    const originalTime = params.time as string;
    const originalStartDate = params.startDate as string;
    const originalId = 'original-1';

    // CRITICAL: Check if we have actual user input from first-notification.tsx
    if ((originalHeader?.trim() || originalDetails?.trim()) && 
        !globalProcessedIds.has(originalId)) {
      // Get active character info for notification
      const activeCharacter = characters.find(char => char.id === activeCharacterId);
      
      // Parse the start date if available
      let notificationDate = formatDate(new Date());
      if (originalStartDate) {
        try {
          const parsedDate = new Date(originalStartDate);
          if (!isNaN(parsedDate.getTime())) {
            notificationDate = formatDate(parsedDate);
          }
        } catch (error) {
          console.log('Error parsing start date:', error);
        }
      }
      
      const originalNotification: NotificationEntry = {
        id: originalId,
        header: originalHeader?.trim() || (originalDetails?.trim() ? 'Reminder' : 'Board game night prep'),
        details: originalDetails?.trim() || originalHeader?.trim() || 'Need to brush up on how to play Catan at 6 pm this Wednesday before board game night at 8. Ping me at 5 and 5:30 pm.',
        date: notificationDate,
        time: originalTime?.trim() || '6:30 PM',
        characterName: activeCharacter?.name || 'Character Name',
        characterType: activeCharacter?.type || userMode,
        avatarSource: activeCharacter?.avatarSource || require('../../assets/images/20250616_1452_Diverse Character Ensemble_simple_compose_01jxxbhwf0e8qrb67cd6e42xf8.png'),
        isFirst: true,
        sendWithoutAI: false, // Default to false for original notification
        createdAt: Date.now() - 1000 // Slightly older to ensure it appears first
      };

      loadedNotifications.push(originalNotification);
      globalProcessedIds.add(originalId);
    }

    // 2. Load new notification from add-notification screen (if exists)
    const newHeader = params.newNotificationHeader as string;
    const newDetails = params.newNotificationDetails as string;
    const newTime = params.newNotificationTime as string;
    const newDate = params.newNotificationDate as string;
    const selectedCharacterId = params.selectedCharacterId as string;
    const sendWithoutAI = params.sendWithoutAI === 'true';
    const notificationTimestamp = params.notificationTimestamp as string;

    if ((newHeader?.trim() || newDetails?.trim()) && notificationTimestamp) {
      // Create unique ID based on timestamp to ensure uniqueness
      const newNotificationId = `notification-${notificationTimestamp}`;
      
      // Check if this notification has already been processed
      if (!globalProcessedIds.has(newNotificationId)) {
        // Get character info for new notification
        const selectedCharacter = characters.find(char => char.id === selectedCharacterId) || 
                                 characters.find(char => char.id === activeCharacterId);

        const newNotification: NotificationEntry = {
          id: newNotificationId,
          header: newHeader.trim(),
          details: newDetails.trim(),
          date: newDate ? formatDate(new Date(newDate)) : formatDate(new Date()),
          time: newTime?.trim() || '6:30 PM',
          characterName: selectedCharacter?.name || 'Character Name',
          characterType: selectedCharacter?.type || userMode,
          avatarSource: selectedCharacter?.avatarSource || require('../../assets/images/20250616_1452_Diverse Character Ensemble_simple_compose_01jxxbhwf0e8qrb67cd6e42xf8.png'),
          isFirst: false,
          sendWithoutAI: sendWithoutAI,
          createdAt: parseInt(notificationTimestamp)
        };

        loadedNotifications.push(newNotification);
        globalProcessedIds.add(newNotificationId);
      }
    }

    // 3. Sort notifications by creation time (newest first, but keep original first if it exists)
    loadedNotifications.sort((a, b) => {
      // Always keep the original notification first
      if (a.isFirst) return -1;
      if (b.isFirst) return 1;
      // Sort others by creation time (newest first)
      return b.createdAt - a.createdAt;
    });

    // CRITICAL: Update global storage and local state
    globalNotifications = loadedNotifications;
    setNotifications(loadedNotifications);
  };

  const formatDate = (date: Date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const formatDateForDisplay = (dateString: string) => {
    const today = formatDate(new Date());
    const tomorrow = formatDate(new Date(Date.now() + 86400000));
    
    if (dateString === today) {
      return 'Today';
    } else if (dateString === tomorrow) {
      return 'Tomorrow';
    } else {
      return dateString;
    }
  };

  // FIXED: Format date for section headers (green mint color)
  const formatDateForSectionHeader = (dateString: string) => {
    const today = formatDate(new Date());
    const tomorrow = formatDate(new Date(Date.now() + 86400000));
    
    if (dateString === today) {
      return 'TODAY';
    } else if (dateString === tomorrow) {
      return 'TOMORROW';
    } else {
      // CRITICAL FIX: Parse the MM/DD/YYYY format correctly
      try {
        // Split the date string (MM/DD/YYYY format)
        const parts = dateString.split('/');
        if (parts.length === 3) {
          const month = parseInt(parts[0], 10) - 1; // Month is 0-indexed in Date constructor
          const day = parseInt(parts[1], 10);
          const year = parseInt(parts[2], 10);
          
          // Create date object
          const date = new Date(year, month, day);
          
          // Validate the date
          if (!isNaN(date.getTime())) {
            const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
                           'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
            return `${months[date.getMonth()]} ${date.getDate()}`;
          }
        }
        
        // Fallback: try parsing as ISO string or other formats
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
          const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
                         'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
          return `${months[date.getMonth()]} ${date.getDate()}`;
        }
        
        // If all parsing fails, return the original string
        return dateString.toUpperCase();
      } catch (error) {
        console.log('Error parsing date for section header:', error);
        return dateString.toUpperCase();
      }
    }
  };

  const getMonthName = (date: Date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return months[date.getMonth()];
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeekStart = new Date(weekStartDate);
    if (direction === 'prev') {
      newWeekStart.setDate(newWeekStart.getDate() - 7);
    } else {
      newWeekStart.setDate(newWeekStart.getDate() + 7);
    }
    setWeekStartDate(newWeekStart);
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);
  };

  const getWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStartDate);
      date.setDate(weekStartDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // UPDATED: Check if selected date is today
  const isSelectedDateToday = () => {
    const today = new Date();
    return selectedDate.toDateString() === today.toDateString();
  };

  // UPDATED: Get notifications to display based on new logic
  const getNotificationsToDisplay = () => {
    const selectedDateString = formatDate(selectedDate);
    
    if (isSelectedDateToday()) {
      // TODAY SELECTED: Show all notifications stacked chronologically
      return getGroupedNotifications();
    } else {
      // OTHER DATE SELECTED: Show only that date's notifications
      const selectedDateNotifications = notifications.filter(n => n.date === selectedDateString);
      
      if (selectedDateNotifications.length > 0) {
        // Has notifications for selected date - show them
        return [{
          date: selectedDateString,
          notifications: selectedDateNotifications
        }];
      } else {
        // NO NOTIFICATIONS for selected date - show next upcoming notifications
        return getUpcomingNotificationsFromDate(selectedDateString);
      }
    }
  };

  // NEW: Get upcoming notifications starting from a specific date
  const getUpcomingNotificationsFromDate = (fromDateString: string) => {
    const fromDate = new Date(fromDateString);
    
    // Filter notifications that are on or after the selected date
    const upcomingNotifications = notifications.filter(notification => {
      const notificationDate = new Date(notification.date);
      return notificationDate >= fromDate;
    });
    
    // Group by date
    const grouped: { [date: string]: NotificationEntry[] } = {};
    upcomingNotifications.forEach(notification => {
      const date = notification.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(notification);
    });

    // Sort dates chronologically (earliest first)
    const sortedDates = Object.keys(grouped).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
    });

    return sortedDates.map(date => ({
      date,
      notifications: grouped[date]
    }));
  };

  // Group notifications by date for chronological display
  const getGroupedNotifications = () => {
    const grouped: { [date: string]: NotificationEntry[] } = {};
    
    notifications.forEach(notification => {
      const date = notification.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(notification);
    });

    // Sort dates chronologically (earliest first)
    const sortedDates = Object.keys(grouped).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
    });

    return sortedDates.map(date => ({
      date,
      notifications: grouped[date]
    }));
  };

  const renderWeekDays = () => {
    const weekDates = getWeekDates();
    const today = new Date();
    
    return weekDates.map((date, index) => {
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      
      // Check if this date has notifications
      const dateString = formatDate(date);
      const hasNotifications = notifications.some(n => n.date === dateString);
      
      return (
        <TouchableOpacity
          key={index}
          style={[
            styles.weekDayContainer,
            isToday && styles.weekDayContainerToday,
            isSelected && styles.weekDayContainerSelected
          ]}
          onPress={() => selectDate(date)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.weekDayLabel,
            isToday && styles.weekDayLabelToday,
            isSelected && styles.weekDayLabelSelected
          ]}>
            {dayNames[date.getDay()]}
          </Text>
          <Text style={[
            styles.weekDayNumber,
            isToday && styles.weekDayNumberToday,
            isSelected && styles.weekDayNumberSelected
          ]}>
            {date.getDate()}
          </Text>
          {/* Notification indicator dot */}
          {hasNotifications && (
            <View style={[
              styles.notificationDot,
              isSelected && styles.notificationDotSelected
            ]} />
          )}
        </TouchableOpacity>
      );
    });
  };

  const handleNotificationPress = (notification: NotificationEntry) => {
    // Navigate to edit notification screen with the actual notification data
    router.push({
      pathname: '/edit-notification',
      params: {
        notificationHeader: notification.header,
        notificationDetails: notification.details,
        notificationTime: notification.time,
        startDate: notification.date, // Convert MM/DD/YYYY to ISO string
        endDate: null, // We don't store end dates in notifications currently
        isRepeat: 'false',
        isTextItToMe: 'false',
        sendWithoutAI: notification.sendWithoutAI?.toString() || 'false'
      }
    });
  };

  const handleAddNotification = () => {
    // Navigate to add notification screen with current user data
    const activeCharacter = characters.find(char => char.id === activeCharacterId);
    
    router.push({
      pathname: '/add-notification',
      params: {
        userMode: userMode,
        characterType: activeCharacter?.type || userMode,
        characterName: activeCharacter?.name || 'Character Name',
        userAvatarUri: activeCharacter?.avatarSource?.uri || undefined,
        characters: JSON.stringify(characters), // Pass all characters for selection
        activeCharacterId: activeCharacterId || '',
        selectedDate: formatDate(selectedDate) // Pass selected date
      }
    });
  };

  const handleCharacterPress = (characterId: string) => {
    const character = characters.find(char => char.id === characterId);
    
    // Only navigate if character exists and is not AI-free mode
    if (character && character.type !== 'ai-free') {
      router.push({
        pathname: '/character-profile',
        params: {
          characterId: character.id,
          characterName: character.name,
          characterType: character.type,
          characterDescription: character.description || '',
          characterVibes: character.vibes ? JSON.stringify(character.vibes) : '[]',
          characterTagline: character.tagline || '',
          userAvatarUri: character.avatarSource?.uri || undefined
        }
      });
    }
  };

  const handleEmptyCharacterPress = () => {
    // Navigate to create character page for empty slots
    router.push('/create-character');
  };

  const handleCharacterSlotPress = (character: CharacterInfo | null, slotIndex: number) => {
    if (character) {
      // Set as active character
      setActiveCharacterId(character.id);
      
      // If clickable, navigate to profile
      if (character.type !== 'ai-free') {
        handleCharacterPress(character.id);
      }
    } else {
      // Empty slot - navigate to create character
      handleEmptyCharacterPress();
    }
  };

  const handleBellPress = () => {
    // Navigate to notifications screen (to be created later)
    console.log('Bell pressed');
  };

  const handleMenuPress = () => {
    setShowNavigationMenu(true);
  };

  const handleNavigationMenuClose = () => {
    setShowNavigationMenu(false);
  };

  const closeBetaModal = () => {
    setShowBetaModal(false);
  };

  const handleNavigationMenuNavigate = (route: string) => {
    // Handle navigation based on route
    switch (route) {
      case 'account':
        Alert.alert('Account', 'Account page will be implemented');
        break;
      case 'browse-characters':
        Alert.alert('Browse Characters', 'Browse characters page will be implemented');
        break;
      case 'my-reports':
        Alert.alert('My Reports', 'My reports page will be implemented');
        break;
      case 'help-center':
        Alert.alert('Help Center', 'Help center page will be implemented');
        break;
      case 'submit-feedback':
        Alert.alert('Submit Feedback', 'Submit feedback page will be implemented');
        break;
      case 'report-issue':
        Alert.alert('Report Issue', 'Report issue page will be implemented');
        break;
      case 'contact-support':
        Alert.alert('Contact Support', 'Contact support page will be implemented');
        break;
      case 'switch-to-ai-free':
        // Show beta modal instead of navigating
        setShowBetaModal(true);
        break;
      case 'switch-to-ai-mode':
        // DIRECT NAVIGATION - NO ALERT
        router.push('/switch-to-ai-mode');
        break;
      case 'logout':
        Alert.alert(
          'Log Out',
          'Are you sure you want to log out?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Log Out', style: 'destructive', onPress: () => {
              // Handle logout logic here
              router.push('/sign-in');
            }}
          ]
        );
        break;
      default:
        console.log('Unknown route:', route);
    }
  };

  // Get characters for display (max 3 slots)
  const getCharacterSlots = () => {
    const slots = [];
    for (let i = 0; i < 3; i++) { // Always show 3 slots
      slots.push(characters[i] || null);
    }
    return slots;
  };

  // Get active character
  const getActiveCharacter = () => {
    return characters.find(char => char.id === activeCharacterId) || characters[0] || null;
  };

  // Custom three dots component
  const ThreeDotsIcon = () => (
    <View style={styles.threeDotsContainer}>
      <View style={styles.dot} />
      <View style={styles.dot} />
      <View style={styles.dot} />
    </View>
  );

  if (!fontsLoaded) {
    return null;
  }

  const characterSlots = getCharacterSlots();
  const activeCharacter = getActiveCharacter();
  
  // UPDATED: Get notifications to display based on new logic
  const notificationsToDisplay = getNotificationsToDisplay();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.bellButton}
          onPress={handleBellPress}
          activeOpacity={0.7}
        >
          <Bell size={24} color="#F3CC95" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={handleMenuPress}
          activeOpacity={0.7}
        >
          <ThreeDotsIcon />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Character Slots - Only show for Character Mode and Spellbot, hide for AI-free */}
        {userMode !== 'ai-free' && (
          <View style={styles.characterSlotsSection}>
            <View style={styles.characterSlots}>
              {characterSlots.map((character, index) => {
                const isActive = character && character.id === activeCharacterId;
                const isClickable = character && character.type !== 'ai-free';
                
                return (
                  <TouchableOpacity
                    key={`slot-${index}`}
                    style={[
                      styles.characterSlot,
                      isActive && styles.characterSlotActive
                    ]}
                    onPress={() => handleCharacterSlotPress(character, index)}
                    activeOpacity={0.7}
                  >
                    {character ? (
                      <>
                        <View style={[
                          styles.characterAvatarContainer,
                          isActive && styles.activeCharacterAvatar
                        ]}>
                          <Image 
                            source={character.avatarSource}
                            style={styles.characterAvatar}
                            resizeMode="cover"
                          />
                        </View>
                        <Text style={[
                          styles.characterName,
                          !notification.sendWithoutAI && styles.notificationDetailsAIFree
                        ]}>
                          {character.name}
                        </Text>
                      </>
                    ) : (
                      <>
                        <View style={[styles.characterAvatarContainer, styles.emptySlot]}>
                          <Plus size={24} color="#9CA3AF" />
                        </View>
                        <Text style={styles.characterNameEmpty}>Add character</Text>
                      </>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Compact Date Picker Section */}
        <View style={styles.datePickerSection}>
          <View style={styles.datePickerHeader}>
            <TouchableOpacity 
              style={styles.monthNavButton}
              onPress={() => navigateWeek('prev')}
              activeOpacity={0.7}
            >
              <ChevronLeft size={20} color="#FFFFFF" />
            </TouchableOpacity>
            
            <Text style={styles.monthYearText}>
              {getMonthName(weekStartDate)} {weekStartDate.getFullYear()}
            </Text>
            
            <TouchableOpacity 
              style={styles.monthNavButton}
              onPress={() => navigateWeek('next')}
              activeOpacity={0.7}
            >
              <ChevronRight size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Week Days Row */}
          <View style={styles.weekDaysRow}>
            {renderWeekDays()}
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.notificationsSection}>
          <Text style={styles.sectionTitle}>Upcoming notifications</Text>
          
          {/* UPDATED: Display notifications based on new logic */}
          {notificationsToDisplay.length > 0 ? (
            notificationsToDisplay.map((group, groupIndex) => (
              <View key={group.date}>
                {/* Date Header */}
                <Text style={[
                  styles.dateHeader,
                  groupIndex === 0 && styles.firstDateHeader
                ]}>
                  {formatDateForSectionHeader(group.date)}
                </Text>
                
                {/* Notifications for this date */}
                {group.notifications.map((notification, index) => (
                  <TouchableOpacity
                    key={notification.id}
                    style={styles.notificationCard}
                    onPress={() => handleNotificationPress(notification)}
                    activeOpacity={0.8}
                  >
                    {/* Notification Content with Avatar and Text Side by Side */}
                    <View style={styles.notificationContent}>
                      {/* Avatar positioned to the left */}
                      <View style={[
                        styles.notificationAvatarContainer,
                        notification.isFirst && styles.notificationAvatarContainerFirst
                      ]}>
                        <Image 
                          source={notification.avatarSource}
                          style={styles.notificationAvatar}
                          resizeMode="cover"
                        />
                      </View>

                      {/* Text content positioned to the right of avatar */}
                      <View style={styles.notificationTextContent}>
                        {/* Header and timestamp on the same line */}
                        <View style={styles.notificationHeaderRow}>
                          <Text style={styles.notificationTitle}>
                            {notification.header}
                          </Text>
                          <Text style={styles.notificationTimestamp}>{notification.time}</Text>
                        </View>
                        
                        <Text 
                          style={[
                            styles.notificationDetails,
                            notification.sendWithoutAI && styles.notificationDetailsAIFree
                          ]}
                          numberOfLines={3}
                          ellipsizeMode="tail"
                        >
                          {notification.details}
                        </Text>

                        {/* AI-Free Badge */}
                        {!notification.sendWithoutAI && (
                          <View style={styles.aiFreeBadge}>
                            <Text style={styles.aiFreeBadgeText}>AI-FREE</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))
          ) : (
            // Empty state when no notifications
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No notifications yet</Text>
              <Text style={styles.emptyStateSubtext}>Tap "Add notification" to create your first reminder</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Notification Button */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity 
          style={styles.addNotificationButton}
          onPress={handleAddNotification}
          activeOpacity={0.8}
        >
          <Plus size={20} color="#1C1830" />
          <Text style={styles.addNotificationButtonText}>Add notification</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation Menu */}
      <NavigationMenu
        visible={showNavigationMenu}
        onClose={handleNavigationMenuClose}
        onNavigate={handleNavigationMenuNavigate}
        userMode={userMode}
      />

      {/* Beta Modal for AI-Free Switch */}
      <Modal
        visible={showBetaModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeBetaModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>AI-Free Mode Unavailable</Text>
            <Text style={styles.modalMessage}>
              Switching to AI-Free mode is currently unavailable in beta. We're working on it!
              {'\n\n'}
              As of now, you can set any notification to be delivered AI-free.
            </Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={closeBetaModal}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1830',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  bellButton: {
    padding: 8,
  },
  menuButton: {
    padding: 8,
  },
  threeDotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F3CC95',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120, // Space for floating add button
  },
  characterSlotsSection: {
    marginBottom: 32,
  },
  characterSlots: {
    flexDirection: 'row',
    gap: 16,
  },
  characterSlot: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  characterSlotActive: {
    // Additional styling for active character slot
  },
  characterAvatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  characterAvatar: {
    width: 76, // Slightly smaller to account for border
    height: 76,
    borderRadius: 38,
  },
  activeCharacterAvatar: {
    borderColor: '#34A853', // Green outline for active character
  },
  emptySlot: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
    borderStyle: 'dashed',
  },
  characterName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  activeCharacterName: {
    color: '#34A853', // Green color for active character name
  },
  characterNameEmpty: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  datePickerSection: {
    marginBottom: 30, // Maximum 30px gap as requested
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  monthNavButton: {
    padding: 8,
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  weekDayContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
    minWidth: 40,
    position: 'relative',
  },
  weekDayContainerToday: {
    backgroundColor: '#34A853',
  },
  weekDayContainerSelected: {
    backgroundColor: '#F3CC95',
  },
  weekDayLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  weekDayLabelToday: {
    color: '#FFFFFF',
  },
  weekDayLabelSelected: {
    color: '#1C1830',
  },
  weekDayNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  weekDayNumberToday: {
    color: '#FFFFFF',
  },
  weekDayNumberSelected: {
    color: '#1C1830',
  },
  notificationDot: {
    position: 'absolute',
    bottom: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F3CC95',
  },
  notificationDotSelected: {
    backgroundColor: '#1C1830',
  },
  notificationsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '300',
    color: '#FFFFFF',
    fontFamily: 'Montserrat_700Bold', // UPDATED: Changed from 'Inter' to 'Montserrat_700Bold'
    marginBottom: 9.6,
  },
  // NEW: Date header styling with green mint color
  dateHeader: {
    color: '#8DD3C8',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 36, // 300% line height as specified
    letterSpacing: 2,
    marginBottom: 8,
    marginTop: 16, // Default margin for subsequent date headers
  },
  // UPDATED: Special styling for the first date header to ensure maximum 25px gap
  firstDateHeader: {
    marginTop: 8, // UPDATED: Reduced from 16px to 8px to ensure maximum 25px gap (16px section title marginBottom + 8px = 24px total)
  },
  notificationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    minHeight: 120, // Ensure adequate height for content
  },
  notificationContent: {
    flex: 1,
    flexDirection: 'row', // Side by side layout
    alignItems: 'flex-start', // Align to top for proper text alignment
  },
  notificationAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 12, // 5px minimum gap + 7px for visual balance
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flexShrink: 0, // Prevent avatar from shrinking
    marginTop: 2, // Slight adjustment to center with first line of text
  },
  notificationAvatarContainerFirst: {
    borderColor: '#34A853',
    borderWidth: 2,
  },
  notificationAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  notificationTextContent: {
    flex: 1, // Take remaining space
    justifyContent: 'flex-start',
  },
  notificationHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Align to top for proper baseline alignment
    marginBottom: 6,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    lineHeight: 20,
    flex: 1, // Take available space, leaving room for timestamp
    marginRight: 8, // Small gap between title and timestamp
  },
  notificationTimestamp: {
    fontSize: 11, // Inter, light, 11px as specified
    fontWeight: '300', // Light weight
    color: '#E1B8B2', // Color as specified
    fontFamily: 'Inter',
    flexShrink: 0, // Prevent timestamp from shrinking
    lineHeight: 20, // Match title line height for perfect alignment
  },
  notificationDetails: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Inter',
    lineHeight: 18,
    flex: 1,
  },
  notificationDetailsAIFree: {
    marginBottom: 8, // Add space for AI-Free badge
  },
  aiFreeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.4)',
  },
  aiFreeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#A78BFA',
    fontFamily: 'Inter',
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9CA3AF',
    fontFamily: 'Inter',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  addNotificationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F3CC95',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 200,
  },
  addNotificationButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1830',
    fontFamily: 'Inter',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6B7280',
    fontFamily: 'Inter',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#F3CC95',
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1830',
    fontFamily: 'Inter',
  },
});