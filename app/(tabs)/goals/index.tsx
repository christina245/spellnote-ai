import React, { useState, useEffect } from 'react';
import {  
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Plus, ChevronDown } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const { width: screenWidth } = Dimensions.get('window');

interface Goal {
  id: string;
  title: string;
  dueDate: string;
  details: string;
  motivation: string;
  urgency: number;
  coverImage?: string;
  createdAt: string;
}

export default function MyGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [sortBy, setSortBy] = useState('Newest first');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  const sortOptions = [
    'Newest first',
    'Oldest first', 
    'Most urgent',
    'Due date'
  ];

  useEffect(() => {
    // Check if there's a new goal from add-goal page
    if (params.newGoal) {
      try {
        const newGoal = JSON.parse(params.newGoal as string);
        setGoals(prevGoals => [newGoal, ...prevGoals]);
      } catch (error) {
        console.error('Error parsing new goal:', error);
      }
    }
  }, [params.newGoal]);

  const handleBack = () => {
    router.back();
  };

  const handleAddGoal = () => {
    router.push('/goals/add-goal');
  };

  const handleSortSelect = (option: string) => {
    setSortBy(option);
    setShowSortDropdown(false);
    
    // Sort goals based on selected option
    const sortedGoals = [...goals].sort((a, b) => {
      switch (option) {
        case 'Oldest first':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'Most urgent':
          return b.urgency - a.urgency;
        case 'Due date':
          // Goals with due dates first, then by date
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'Newest first':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    
    setGoals(sortedGoals);
  };

  const handleGoalPress = (goal: Goal) => {
    // Navigate to edit goal screen (which is the same as add-goal but with pre-filled data)
    router.push({
      pathname: '/add-goal',
      params: {
        editMode: 'true',
        goalId: goal.id,
        goalTitle: goal.title,
        goalDueDate: goal.dueDate,
        goalDetails: goal.details,
        goalMotivation: goal.motivation,
        goalUrgency: goal.urgency.toString(),
        goalCoverImage: goal.coverImage || ''
      }
    });
  };

  const formatDueDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${month}/${day}`;
    } catch {
      return '';
    }
  };

  const truncateText = (text: string, maxLines: number = 2) => {
    const words = text.split(' ');
    const wordsPerLine = 8; // Approximate words per line
    const maxWords = wordsPerLine * maxLines;
    
    if (words.length <= maxWords) {
      return text;
    }
    
    return words.slice(0, maxWords).join(' ') + '...';
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
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

      {/* Title and Subtitle */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>My goals</Text>
        <Text style={styles.subtitle}>
          What are you looking to accomplish? Adding your goals helps your characters better understand how to talk to you!
        </Text>
      </View>

      {/* Sort Dropdown */}
      <View style={styles.sortSection}>
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => setShowSortDropdown(!showSortDropdown)}
          activeOpacity={0.7}
        >
          <Text style={styles.sortButtonText}>{sortBy}</Text>
          <ChevronDown 
            size={16} 
            color="#F3CC95" 
            style={[
              styles.sortIcon,
              showSortDropdown && styles.sortIconRotated
            ]} 
          />
        </TouchableOpacity>
        
        {showSortDropdown && (
          <View style={styles.sortDropdown}>
            {sortOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.sortOption,
                  index === sortOptions.length - 1 && styles.sortOptionLast
                ]}
                onPress={() => handleSortSelect(option)}
                activeOpacity={0.7}
              >
                <Text style={styles.sortOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Goals List or Empty State */}
        {goals.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No goals added yet</Text>
          </View>
        ) : (
          <View style={styles.goalsList}>
            {goals.map((goal) => (
              <TouchableOpacity 
                key={goal.id}
                style={styles.goalCard}
                onPress={() => handleGoalPress(goal)}
                activeOpacity={0.8}
              >
                <View style={styles.goalImageContainer}>
                  {goal.coverImage ? (
                    <Image 
                      source={{ uri: goal.coverImage }}
                      style={styles.goalImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.goalImagePlaceholder}>
                      <Text style={styles.placeholderText}>📷</Text>
                    </View>
                  )}
                </View>
                <View style={styles.goalContent}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  {goal.dueDate && (
                    <Text style={styles.goalDueDate}>Due: {formatDueDate(goal.dueDate)}</Text>
                  )}
                  <Text style={styles.goalDetails}>
                    {truncateText(goal.details)}
                  </Text>
                  <Text style={styles.goalUrgency}>
                    <Text style={styles.urgencyNumber}>{goal.urgency}</Text>/10
                    <Text>/10</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Extra spacing for floating button */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Add Goal Button */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity 
          style={styles.addGoalButton}
          onPress={handleAddGoal}
          activeOpacity={0.8}
        >
          <Plus size={20} color="#1C1830" />
          <Text style={styles.addGoalButtonText}>Add goal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D2B4A',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
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
  titleSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 36,
    letterSpacing: -0.28,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    lineHeight: 20,
    fontFamily: 'Inter',
  },
  sortSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
    position: 'relative',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  sortIcon: {
    transform: [{ rotate: '0deg' }],
    fontWeight: 'bold',
  },
  sortIconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  sortDropdown: {
    position: 'absolute',
    top: '100%',
    left: 24,
    right: 24,
    backgroundColor: 'rgba(60, 60, 67, 0.95)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
  sortOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  sortOptionLast: {
    borderBottomWidth: 0,
  },
  sortOptionText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  goalsList: {
    gap: 16,
  },
  goalCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
    minHeight: 120,
  },
  goalImageContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalImage: {
    width: 120,
    height: 120,
  },
  goalImagePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
    opacity: 0.5,
  },
  goalContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  goalDueDate: {
    fontSize: 14,
    fontWeight: '400',
    color: '#F3CC95',
    fontFamily: 'Inter',
    marginBottom: 8,
  },
  goalDetails: {
    fontSize: 14,
    fontWeight: '400',
    color: '#E5E7EB',
    fontFamily: 'Inter',
    lineHeight: 18,
    flex: 1,
  },
  goalUrgency: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    marginTop: 8,
  },
  urgencyNumber: {
    fontWeight: '700',
  },
  bottomSpacing: {
    height: 100,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  addGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F3CC95',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 140,
  },
  addGoalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1830',
    fontFamily: 'Inter',
  },
});