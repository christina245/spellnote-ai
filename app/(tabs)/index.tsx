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
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Bell, Plus, Calendar, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import DatePickerModal from '@/components/DatePickerModal';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function HomeTab() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
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
        selectedDate: currentDate.toISOString()
      }
    });
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Spellnote</Text>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => {/* Notifications functionality */}}
          activeOpacity={0.7}
        >
          <Bell size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Navigation */}
        <View style={styles.dateNavigation}>
          <TouchableOpacity 
            style={styles.dateNavButton}
            onPress={() => navigateDate('prev')}
            activeOpacity={0.7}
          >
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.dateDisplay}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.dateText}>{formatDate(currentDate)}</Text>
            <Calendar size={16} color="#8DD3C8" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.dateNavButton}
            onPress={() => navigateDate('next')}
            activeOpacity={0.7}
          >
            <ChevronRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Characters Section */}
        <View style={styles.charactersSection}>
          <Text style={styles.sectionTitle}>Characters</Text>
          <View style={styles.charactersGrid}>
            {/* Muffin the fluffy bunny */}
            <TouchableOpacity style={styles.characterCard} activeOpacity={0.7}>
              <View style={styles.characterAvatarContainer}>
                <Image 
                  source={require('../../assets/images/pink bunny copy.jpg')}
                  style={styles.characterAvatar}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.characterName}>Muffin the fluffy bunny</Text>
            </TouchableOpacity>

            {/* ARIA */}
            <TouchableOpacity style={styles.characterCard} activeOpacity={0.7}>
              <View style={styles.characterAvatarContainer}>
                <Image 
                  source={require('../../assets/images/20250706_1541_Futuristic Spacecraft Cockpit_simple_compose_01jzgyc3yserjtsrq38jpjn75t copy copy.png')}
                  style={styles.characterAvatar}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.characterName}>ARIA</Text>
            </TouchableOpacity>

            {/* Silicon Valley Techie */}
            <TouchableOpacity style={styles.characterCard} activeOpacity={0.7}>
              <View style={styles.characterAvatarContainer}>
                <Image 
                  source={require('../../assets/images/20250714_1838_Software Engineer in San Francisco_remix_01k05vn4ypfv3s4xd60vezymnb.png')}
                  style={styles.characterAvatar}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.characterName}>Silicon Valley Techie</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Empty State for Notifications */}
        <View style={styles.emptyNotificationsSection}>
          <Text style={styles.emptyNotificationsTitle}>No notifications for this date</Text>
          <Text style={styles.emptyNotificationsSubtitle}>
            Tap the + button below to create your first notification
          </Text>
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
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 100, // Extra padding for floating button
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  dateNavButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
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
    justifyContent: 'space-between',
  },
  characterCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
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
  emptyNotificationsSection: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyNotificationsTitle: {
    fontSize: 18,
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