import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Bell, Plus, Calendar, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import DatePickerModal from '@/components/DatePickerModal';
import NavigationMenu from '@/components/NavigationMenu';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function HomeTab() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showNavigationMenu, setShowNavigationMenu] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const router = useRouter();
  const params = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  // Characters data with border colors
  const characters = [
    {
      id: '1',
      name: 'Muffin the fluffy bunny',
      avatarSource: require('../../assets/images/pink bunny copy.jpg'),
      borderColor: '#8B5CF6', // Purple
      isEmpty: false
    },
    {
      id: '2', 
      name: 'ARIA',
      avatarSource: require('../../assets/images/20250706_1541_Futuristic Spacecraft Cockpit_simple_compose_01jzgyc3yserjtsrq38jpjn75t copy copy.png'),
      borderColor: '#10B981', // Green
      isEmpty: false
    },
    {
      id: '3',
      name: 'Silicon Valley Techie',
      avatarSource: require('../../assets/images/20250714_1838_Software Engineer in San Francisco_remix_01k05vn4ypfv3s4xd60vezymnb.png'),
      borderColor: '#3B82F6', // Blue
      isEmpty: false
    }
  ];

  // Load notification from onboarding if it exists
  useEffect(() => {
    if (params.newNotificationHeader || params.newNotificationDetails) {
      const newNotification = {
        id: Date.now().toString(),
        header: params.newNotificationHeader as string || 'Notification',
        details: params.newNotificationDetails as string,
        time: params.newNotificationTime as string || '6:00 PM',
        date: params.newNotificationDate ? new Date(params.newNotificationDate as string) : new Date(),
        characterId: params.selectedCharacterId as string || '1',
        sendWithoutAI: params.sendWithoutAI === 'true'
      };
      
      setNotifications([newNotification]);
    }
  }, [params]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatCalendarDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long',
      year: 'numeric'
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7); // Move by week
    } else {
      newDate.setDate(newDate.getDate() + 7); // Move by week
    }
    setCurrentDate(newDate);
  };

  const handleDateSelect = (date: Date) => {
    setCurrentDate(date);
    setShowDatePicker(false);
  };

  const handleAddNotification = () => {
    router.push({
      pathname: '/add-notification',
      params: {
        selectedDate: currentDate.toISOString(),
        characters: JSON.stringify(characters),
        activeCharacterId: '1'
      }
    });
  };

  const handleNavigationMenuPress = (route: string) => {
    switch (route) {
      case 'account':
        router.push('/user-profile');
        break;
      case 'switch-to-ai-free':
        router.push('/switch-to-ai-free');
        break;
      case 'switch-to-ai-mode':
        router.push('/switch-to-ai-mode');
        break;
      case 'browse-characters':
        router.push('/browse-characters');
        break;
      case 'resources':
        router.push('/resources');
        break;
      case 'help-center':
        // TODO: Implement help center
        break;
      case 'submit-feedback':
        router.push('/submit-feedback');
        break;
      case 'report-issue':
        router.push('/report-issue');
        break;
      case 'contact-support':
        // TODO: Implement contact support
        break;
      case 'logout':
        router.push('/sign-in');
        break;
    }
  };

  // Get notifications for current date
  const getNotificationsForDate = (date: Date) => {
    return notifications.filter(notification => {
      const notificationDate = new Date(notification.date);
      return notificationDate.toDateString() === date.toDateString();
    });
  };

  // Generate current week days with today in center
  const generateWeekDays = () => {
    const today = new Date();
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - 3); // 3 days before today to center it
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(currentWeekStart.getDate() + i);
      
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === currentDate.toDateString();
      
      days.push({
        date,
        day: date.getDate(),
        isToday,
        isSelected
      });
    }
    
    return days;
  };

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const currentWeekDays = generateWeekDays();
  const todayNotifications = getNotificationsForDate(currentDate);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => {/* Notifications functionality */}}
          activeOpacity={0.7}
        >
          <Bell size={24} color="#F3CC95" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => setShowNavigationMenu(true)}
          activeOpacity={0.7}
        >
          <Image 
            source={require('../../assets/images/nav bar dots copy copy.png')}
            style={styles.dotsIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Characters Section */}
        <View style={styles.charactersSection}>
          <View style={styles.charactersGrid}>
            {characters.map((character) => (
              <TouchableOpacity 
                key={character.id}
                style={styles.characterCard} 
                activeOpacity={0.7}
                onPress={() => router.push({
                  pathname: '/character-profile',
                  params: {
                    characterName: character.name,
                    characterId: character.id
                  }
                })}
              >
                <View style={[
                  styles.characterAvatarContainer,
                  { borderColor: character.borderColor }
                ]}>
                  <Image 
                    source={character.avatarSource}
                    style={styles.characterAvatar}
                    resizeMode="cover"
                  />
                </View>
                <Text style={styles.characterName}>{character.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Calendar Section - Single Week Row */}
        <View style={styles.calendarSection}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity 
              style={styles.calendarNavButton}
              onPress={() => navigateDate('prev')}
              activeOpacity={0.7}
            >
              <ChevronLeft size={20} color="#FFFFFF" />
            </TouchableOpacity>
            
            <Text style={styles.calendarTitle}>
              {formatCalendarDate(currentDate)}
            </Text>
            
            <TouchableOpacity 
              style={styles.calendarNavButton}
              onPress={() => navigateDate('next')}
              activeOpacity={0.7}
            >
              <ChevronRight size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Week Days */}
          <View style={styles.weekDaysRow}>
            {weekDays.map((day) => (
              <View key={day} style={styles.weekDayCell}>
                <Text style={styles.weekDayText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Single Week Row */}
          <View style={styles.weekRow}>
            {currentWeekDays.map((dayInfo, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.calendarDay,
                  dayInfo.isSelected && styles.selectedDay,
                  dayInfo.isToday && styles.todayDay
                ]}
                onPress={() => setCurrentDate(dayInfo.date)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.calendarDayText,
                  dayInfo.isSelected && styles.selectedDayText,
                  dayInfo.isToday && styles.todayDayText
                ]}>
                  {dayInfo.day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Selected Date Header - Centered */}
        <View style={styles.selectedDateSection}>
          <Text style={styles.selectedDateText}>
            {currentDate.toLocaleDateString('en-US', { 
              month: 'long',
              day: 'numeric'
            }).toUpperCase()}
          </Text>
        </View>

        {/* Notifications Section */}
        <View style={styles.notificationsSection}>
          {todayNotifications.length > 0 ? (
            todayNotifications.map((notification) => {
              const character = characters.find(c => c.id === notification.characterId);
              return (
                <TouchableOpacity 
                  key={notification.id}
                  style={styles.notificationCard}
                  activeOpacity={0.7}
                  onPress={() => router.push({
                    pathname: '/edit-notification',
                    params: {
                      notificationId: notification.id,
                      notificationHeader: notification.header,
                      notificationDetails: notification.details,
                      notificationTime: notification.time,
                      startDate: notification.date.toISOString(),
                      sendWithoutAI: notification.sendWithoutAI.toString()
                    }
                  })}
                >
                  <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                      <View style={[
                        styles.notificationAvatarContainer,
                        character && { borderColor: character.borderColor }
                      ]}>
                        {character && (
                          <Image 
                            source={character.avatarSource}
                            style={styles.notificationAvatar}
                            resizeMode="cover"
                          />
                        )}
                      </View>
                      <View style={styles.notificationTextContent}>
                        <View style={styles.notificationTitleRow}>
                          <Text style={styles.notificationTitle}>{notification.header}</Text>
                          <Text style={styles.notificationTime}>{notification.time}</Text>
                        </View>
                        <Text style={styles.notificationDetails} numberOfLines={2}>
                          {notification.details}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyNotificationsSection}>
              <Text style={styles.emptyNotificationsTitle}>No notifications for this date</Text>
              <Text style={styles.emptyNotificationsSubtitle}>
                Tap the + button below to create your first notification
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity 
        style={styles.floatingAddButton}
        onPress={handleAddNotification}
        activeOpacity={0.8}
      >
        <Plus size={24} color="#1C1830" />
      </TouchableOpacity>

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onCancel={() => setShowDatePicker(false)}
        onConfirm={handleDateSelect}
        initialDate={currentDate}
        title="Select date"
      />

      {/* Navigation Menu */}
      <NavigationMenu
        visible={showNavigationMenu}
        onClose={() => setShowNavigationMenu(false)}
        onNavigate={handleNavigationMenuPress}
        userMode="character"
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
  headerButton: {
    padding: 8,
  },
  dotsIcon: {
    width: 24,
    height: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  charactersSection: {
    marginBottom: 32,
  },
  charactersGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  characterCard: {
    alignItems: 'center',
    flex: 1,
  },
  characterAvatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  characterAvatar: {
    width: 74,
    height: 74,
    borderRadius: 37,
  },
  characterName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  calendarSection: {
    marginBottom: 24,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarNavButton: {
    padding: 8,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
    fontFamily: 'Inter',
  },
  weekRow: {
    flexDirection: 'row',
  },
  calendarDay: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  selectedDay: {
    backgroundColor: '#F3CC95',
    borderRadius: 20,
  },
  todayDay: {
    backgroundColor: 'rgba(243, 204, 149, 0.3)',
    borderRadius: 20,
  },
  calendarDayText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  selectedDayText: {
    color: '#1C1830',
    fontWeight: '600',
  },
  todayDayText: {
    color: '#F3CC95',
    fontWeight: '600',
  },
  selectedDateSection: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 40, // Maximum 40px beneath the dates
  },
  selectedDateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8DD3C8',
    fontFamily: 'Inter',
    letterSpacing: 0.7,
  },
  notificationsSection: {
    marginBottom: 32,
  },
  notificationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  notificationContent: {
    // Content styling
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  notificationAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  notificationTextContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    flex: 1,
  },
  notificationTime: {
    fontSize: 14,
    fontWeight: '400',
    color: '#E1B8B2',
    fontFamily: 'Inter',
  },
  notificationDetails: {
    fontSize: 14,
    fontWeight: '400',
    color: '#E5E7EB',
    fontFamily: 'Inter',
    lineHeight: 18,
  },
  emptyNotificationsSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyNotificationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyNotificationsSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  floatingAddButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3CC95',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});