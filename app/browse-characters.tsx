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
  TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, Heart, Star } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const { width: screenWidth } = Dimensions.get('window');

interface Character {
  id: string;
  name: string;
  description: string;
  vibes: string[];
  tagline: string;
  avatarUrl: string;
  rating: number;
  likes: number;
  isLiked: boolean;
  category: 'fantasy' | 'modern' | 'sci-fi' | 'anime' | 'historical';
}

export default function BrowseCharacters() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [likedCharacters, setLikedCharacters] = useState<Set<string>>(new Set());
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  // Premade characters data
  const premadeCharacters: Character[] = [
    {
      id: 'char-1',
      name: 'Luna the Wise',
      description: 'A mystical forest guardian with ancient wisdom and a gentle spirit. Luna speaks in riddles and offers profound insights about life and nature.',
      vibes: ['wise', 'mystical', 'gentle'],
      tagline: 'Ancient wisdom meets modern problems',
      avatarUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      likes: 1247,
      isLiked: false,
      category: 'fantasy'
    },
    {
      id: 'char-2',
      name: 'Captain Nova',
      description: 'A fearless space explorer from the year 3024. Nova is optimistic, adventurous, and always ready to tackle any challenge with scientific precision.',
      vibes: ['adventurous', 'optimistic', 'scientific'],
      tagline: 'Exploring the cosmos, one reminder at a time',
      avatarUrl: 'https://images.pexels.com/photos/2182863/pexels-photo-2182863.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      likes: 892,
      isLiked: true,
      category: 'sci-fi'
    },
    {
      id: 'char-3',
      name: 'Zen Master Kiko',
      description: 'A peaceful meditation teacher who brings calm and mindfulness to every interaction. Kiko helps you find balance in chaos.',
      vibes: ['peaceful', 'mindful', 'balanced'],
      tagline: 'Find your center, one breath at a time',
      avatarUrl: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      likes: 2156,
      isLiked: false,
      category: 'modern'
    },
    {
      id: 'char-4',
      name: 'Detective Noir',
      description: 'A sharp-witted detective from the 1940s with a dry sense of humor and an eye for detail. Always gets to the bottom of things.',
      vibes: ['witty', 'analytical', 'mysterious'],
      tagline: 'Solving life\'s mysteries, one clue at a time',
      avatarUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.6,
      likes: 743,
      isLiked: false,
      category: 'historical'
    },
    {
      id: 'char-5',
      name: 'Sakura-chan',
      description: 'An energetic high school student who loves helping friends stay organized. Bubbly, encouraging, and always positive!',
      vibes: ['bubbly', 'energetic', 'encouraging'],
      tagline: 'Ganbatte! Let\'s do our best together!',
      avatarUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      likes: 1834,
      isLiked: true,
      category: 'anime'
    },
    {
      id: 'char-6',
      name: 'Professor Gears',
      description: 'A brilliant Victorian inventor with a passion for clockwork and steam. Eccentric, creative, and always tinkering with new ideas.',
      vibes: ['eccentric', 'creative', 'inventive'],
      tagline: 'Innovation through mechanical precision',
      avatarUrl: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.5,
      likes: 567,
      isLiked: false,
      category: 'historical'
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: '🌟' },
    { id: 'fantasy', name: 'Fantasy', icon: '🧙‍♀️' },
    { id: 'sci-fi', name: 'Sci-Fi', icon: '🚀' },
    { id: 'modern', name: 'Modern', icon: '🏙️' },
    { id: 'anime', name: 'Anime', icon: '🌸' },
    { id: 'historical', name: 'Historical', icon: '🏛️' }
  ];

  // Generate "For You" recommendations based on user preferences
  const getForYouCharacters = () => {
    // In a real app, this would use user data and ML algorithms
    // For now, we'll return a curated selection
    return premadeCharacters.slice(0, 3);
  };

  const getFilteredCharacters = () => {
    let filtered = premadeCharacters;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(char => char.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(char => 
        char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        char.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        char.vibes.some(vibe => vibe.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return filtered;
  };

  const handleBack = () => {
    router.back();
  };

  const handleLikeCharacter = (characterId: string) => {
    const newLikedCharacters = new Set(likedCharacters);
    if (newLikedCharacters.has(characterId)) {
      newLikedCharacters.delete(characterId);
    } else {
      newLikedCharacters.add(characterId);
    }
    setLikedCharacters(newLikedCharacters);
  };

  const handleSelectCharacter = (character: Character) => {
    // Navigate to character preview or directly add to user's characters
    router.push({
      pathname: '/character-preview',
      params: {
        characterId: character.id,
        characterName: character.name,
        characterDescription: character.description,
        characterVibes: JSON.stringify(character.vibes),
        characterTagline: character.tagline,
        avatarUrl: character.avatarUrl,
        isPremade: 'true'
      }
    });
  };

  const renderCharacterCard = (character: Character, isForYou: boolean = false) => {
    const isLiked = likedCharacters.has(character.id);
    
    return (
      <TouchableOpacity
        key={character.id}
        style={[styles.characterCard, isForYou && styles.forYouCard]}
        onPress={() => handleSelectCharacter(character)}
        activeOpacity={0.8}
      >
        <View style={styles.cardImageContainer}>
          <Image 
            source={{ uri: character.avatarUrl }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <TouchableOpacity 
            style={styles.likeButton}
            onPress={() => handleLikeCharacter(character.id)}
            activeOpacity={0.7}
          >
            <Heart 
              size={20} 
              color={isLiked ? "#EF4444" : "#FFFFFF"} 
              fill={isLiked ? "#EF4444" : "transparent"}
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{character.name}</Text>
          <Text style={styles.cardTagline}>{character.tagline}</Text>
          
          <View style={styles.vibesContainer}>
            {character.vibes.slice(0, 2).map((vibe, index) => (
              <View key={index} style={styles.vibeTag}>
                <Text style={styles.vibeText}>{vibe}</Text>
              </View>
            ))}
            {character.vibes.length > 2 && (
              <Text style={styles.moreVibes}>+{character.vibes.length - 2}</Text>
            )}
          </View>
          
          <View style={styles.cardStats}>
            <View style={styles.rating}>
              <Star size={14} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingText}>{character.rating}</Text>
            </View>
            <Text style={styles.likes}>{character.likes} likes</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (!fontsLoaded) {
    return null;
  }

  const forYouCharacters = getForYouCharacters();
  const filteredCharacters = getFilteredCharacters();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#F3CC95" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Browse Characters</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search characters..."
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* For You Section */}
        {!searchQuery && selectedCategory === 'all' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>For You</Text>
            <Text style={styles.sectionSubtitle}>
              Characters we think you'll love based on your preferences
            </Text>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {forYouCharacters.map(character => renderCharacterCard(character, true))}
            </ScrollView>
          </View>
        )}

        {/* Category Filter */}
        <View style={styles.categoriesContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.categoryButtonActive
                ]}
                onPress={() => setSelectedCategory(category.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* All Characters Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'All Characters' : categories.find(c => c.id === selectedCategory)?.name + ' Characters'}
          </Text>
          
          <View style={styles.charactersGrid}>
            {filteredCharacters.map(character => renderCharacterCard(character))}
          </View>
          
          {filteredCharacters.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No characters found</Text>
              <Text style={styles.emptyStateSubtext}>
                Try adjusting your search or category filter
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSpacer: {
    width: 40, // Same width as back button for centering
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
    color: '#FFFFFF',
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  horizontalScroll: {
    paddingHorizontal: 24,
    gap: 16,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoriesScroll: {
    paddingHorizontal: 24,
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#F3CC95',
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  categoryTextActive: {
    color: '#1C1830',
  },
  charactersGrid: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  characterCard: {
    width: (screenWidth - 64) / 2, // 2 columns with 24px padding and 16px gap
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  forYouCard: {
    width: 280, // Wider cards for horizontal scroll
    marginBottom: 0,
  },
  cardImageContainer: {
    position: 'relative',
    height: 160,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  likeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  cardTagline: {
    fontSize: 14,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter',
    marginBottom: 12,
    lineHeight: 18,
  },
  vibesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  vibeTag: {
    backgroundColor: 'rgba(243, 204, 149, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  vibeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#F3CC95',
    fontFamily: 'Inter',
  },
  moreVibes: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter',
  },
  cardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  likes: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
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
});