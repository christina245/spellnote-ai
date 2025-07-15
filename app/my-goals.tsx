import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Image
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Plus, ChevronDown } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const { width: screenWidth } = Dimensions.get('window');

export default function MyGoals() {
  const [sortBy, setSortBy] = useState('Newest first');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [goals, setGoals] = useState<any[]>([]);
  const router = useRouter();
  const params = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  const sortOptions = [
    'Newest first',
    'Oldest first',
    'Least to most urgent',
    'Most to least urgent',
    'A-Z'
  ];

  // Load goals and handle new goal from add-goal page
  useEffect(() => {
    // Initialize with placeholder goals
    const initialGoals = [
      {
        id: '1',
        title: 'Goal title',
        description: 'Goal description',
        urgency: 5,
        deadline: 'Goal deadline',
        coverImage: require('../assets/images/square placeholder image.png'),
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Goal title',
        description: 'Goal description',
        urgency: 3,
        deadline: 'Goal deadline',
        coverImage: require('../assets/images/square placeholder image.png'),
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Goal title',
        description: 'Goal description',
        urgency: 8,
        deadline: 'Goal deadline',
        coverImage: require('../assets/images/square placeholder image.png'),
        createdAt: new Date().toISOString()
      }
    ];

    setGoals(initialGoals);

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

  const getUrgencyText = (level: number) => {
    if (level <= 3) return 'Low urgency';
    if (level <= 6) return 'Medium urgency';
    return 'High urgency';
  };

  const getGoalImage = (goal: any) => {
    if (goal.coverImage && typeof goal.coverImage === 'string') {
      return { uri: goal.coverImage };
    }
    return require('../assets/images/square placeholder image.png');
  };

  const handleSortSelect = (option: string) => {
    setSortBy(option);
    setShowSortDropdown(false);
  };

  const handleAddGoal = () => {
    router.push('/add-goal');
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My goals</Text>
      </View>

      {/* Sort Toggle */}
      <View style={styles.sortSection}>
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => setShowSortDropdown(!showSortDropdown)}
          activeOpacity={0.7}
        >
          <Text style={styles.sortButtonText}>{sortBy}</Text>
          <ChevronDown 
            size={16} 
            color="#FFFFFF" 
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
        {/* Goals List */}
        <View style={styles.goalsList}>
          {goals.map((goal) => (
            <TouchableOpacity 
              key={goal.id}
              style={styles.goalCard}
              activeOpacity={0.8}
            >
              <View style={styles.goalImageContainer}>
                <Image 
                  source={getGoalImage(goal)}
                  style={styles.goalImage}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.goalContent}>
                <Text style={styles.goalTitle}>
                  {goal.title === 'Goal title' ? goal.title : goal.title}
                </Text>
                <Text style={styles.goalDescription}>
                  {goal.description === 'Goal description' ? goal.description : goal.description || 'Goal description'}
                </Text>
                <Text style={styles.goalUrgency}>
                  {typeof goal.urgency === 'number' ? getUrgencyText(goal.urgency) : 'Urgency level'}
                </Text>
                <Text style={styles.goalDeadline}>
                  {goal.deadline === 'Goal deadline' ? goal.deadline : goal.deadline || 'Goal deadline'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

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
    </SafeAreaView>
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
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 36,
    letterSpacing: -0.28,
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
  goalsList: {
    gap: 16,
  },
  goalCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
    height: 120, // Fixed height as specified
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
  goalContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)', // 50% opacity for placeholder, full opacity for real data
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.5)', // 50% opacity placeholder
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  goalUrgency: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.5)', // 50% opacity placeholder
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  goalDeadline: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.5)', // 50% opacity placeholder
    fontFamily: 'Inter',
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