import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  TextInput,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, ChevronDown } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const { width: screenWidth } = Dimensions.get('window');

export default function BrowseCharacters() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });
  const handleBack = () => {
    router.back();
  };

  // Placeholder categories
  const categories = [
    { id: 'animals', name: 'Animals & Pets', description: 'Make them cute or scary. Ideal for more gentle reminders' },
    { id: 'anime', name: 'Anime & Manga', description: 'Eccentric and inspired by your favorite magical girls, heroes etc' },
    { id: 'athletic', name: 'Athletic Coaches', description: 'Push you to achieve your fitness goals with competitive spirit' },
    { id: 'celebrities', name: 'Celebrities & Influencers', description: 'Fictional celebrities and influencers helping you stay glam' },
    { id: 'educators', name: 'Educators & Mentors', description: 'Nerd out with fun facts about your content' },
    { id: 'fantasy', name: 'Fantasy & Mythical', description: 'Dragons, wizards, goblins, and more with enchanting inspiration' },
  ];

  if (!fontsLoaded) {
    return null;
  }

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
          <Text style={styles.backText}>BACK</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Browse characters</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="rgba(255, 255, 255, 0.5)" />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by personality, species, etc"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
          />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* For You Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>FOR YOU</Text>
            <View style={styles.suggestionContainer}>
              <Text style={styles.suggestionText}>
                Based on your current characters, notifications, and profile.
              </Text>
            </View>
          </View>
          
          {/* Placeholder character cards */}
          <View style={styles.forYouGrid}>
            {/* Muffin the fluffy bunny */}
            <TouchableOpacity 
              style={styles.forYouCard}
              onPress={() => router.push({
                pathname: '/onboarding-character-profile',
                params: {
                  characterId: 'demo-muffin-1',
                  characterName: 'Muffin the fluffy bunny',
                  characterDescription: 'A sweet and gentle bunny with a fluffy coat and caring personality. Muffin loves to help others stay organized and motivated with gentle reminders. Known for being encouraging, warm, and always ready with a kind word.',
                  characterVibes: JSON.stringify(['bubbly', 'gentle', 'caring']),
                  characterTagline: 'Your fluffy friend for gentle reminders',
                  avatarSource: 'muffin'
                }
              })}
              activeOpacity={0.8}
            >
              <Image 
                source={require('../assets/images/pink bunny copy copy.jpg')}
                style={styles.characterAvatar}
                resizeMode="cover"
              />
              <View style={styles.forYouCardContent}>
                <Text style={styles.characterName}>Muffin the fluffy bunny</Text>
                <Text style={styles.characterDescription}>
                  Your fluffy friend for gentle reminders
                </Text>
              </View>
            </TouchableOpacity>

            {/* ARIA spacecraft AI */}
            <TouchableOpacity 
              style={styles.forYouCard}
              onPress={() => router.push({
                pathname: '/onboarding-character-profile',
                params: {
                  characterId: 'demo-aria-2',
                  characterName: 'ARIA',
                  characterDescription: 'ARIA (Automated Reminder & Instruction Assistant) - I AM THE AI SYSTEM OF YOUR SPACECRAFT. MY PRIMARY FUNCTION IS TO PROVIDE NOTIFICATIONS AND INSTRUCTIONS TO ENSURE OPTIMAL MISSION PERFORMANCE. I COMMUNICATE IN STANDARDIZED PROTOCOL FORMAT WITHOUT EMOTIONAL VARIANCE.',
                  characterVibes: JSON.stringify(['practical', 'deadpan', 'systematic']),
                  characterTagline: 'SPACECRAFT AI NOTIFICATION SYSTEM',
                  avatarSource: 'aria'
                }
              })}
              activeOpacity={0.8}
            >
              <Image 
                source={require('../assets/images/20250706_1541_Futuristic Spacecraft Cockpit_simple_compose_01jzgyc3yserjtsrq38jpjn75t copy.png')}
                style={styles.characterAvatar}
                resizeMode="cover"
              />
              <View style={styles.forYouCardContent}>
                <Text style={styles.characterName}>ARIA</Text>
                <Text style={styles.characterDescription}>
                  SPACECRAFT AI NOTIFICATION SYSTEM
                </Text>
              </View>
            </TouchableOpacity>

            {/* The Rave Addict */}
            <TouchableOpacity 
              style={styles.forYouCard}
              onPress={() => router.push({
                pathname: '/onboarding-character-profile',
                params: {
                  characterId: 'demo-rave-addict-3',
                  characterName: 'The Rave Addict',
                  characterDescription: 'Lives for the drop, sleeps under the stars, and has collected more wristbands than most people have socks. This seasoned festival-goer has navigated everything from muddy fields to desert heat waves, always emerging with stories and a slightly hoarse voice. His phone camera roll is 90% stage shots and 10% blurry group pics at 3 AM.',
                  characterVibes: JSON.stringify(['energetic', 'health-conscious', 'street smart']),
                  characterTagline: 'A seasoned raver who knows that a healthy lifestyle = more fun at the festivals.',
                  avatarSource: 'rave-addict'
                }
              })}
              activeOpacity={0.8}
            >
              <Image 
                source={require('../assets/images/20250706_2138_Festival Fun_remix_01jzhjrj5xejnvemxvax2k067h.png')}
                style={styles.characterAvatar}
                resizeMode="cover"
              />
              <View style={styles.forYouCardContent}>
                <Text style={styles.characterName}>The Rave Addict</Text>
                <Text style={styles.characterDescription}>
                  A seasoned raver who knows that a healthy lifestyle = more fun at the festivals.
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.viewMoreButton} activeOpacity={0.7}>
            <ChevronDown size={16} color="#F3CC95" />
            <Text style={styles.viewMoreText}>VIEW MORE</Text>
          </TouchableOpacity>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CATEGORIES</Text>
          
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity 
                key={category.id} 
                style={styles.categoryCard}
                activeOpacity={0.8}
              >
                <View style={styles.categoryIcon} />
                <View style={styles.forYouCardContent}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity style={styles.viewMoreButton} activeOpacity={0.7}>
            <ChevronDown size={16} color="#F3CC95" />
            <Text style={styles.viewMoreText}>VIEW MORE</Text>
          </TouchableOpacity>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CATEGORIES</Text>
          
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity 
                key={category.id} 
                style={styles.categoryCard}
                activeOpacity={0.8}
              >
                <View style={styles.categoryIcon} />
                <View style={styles.categoryContent}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity style={styles.viewMoreButton} activeOpacity={0.7}>
            <ChevronDown size={16} color="#F3CC95" />
            <Text style={styles.viewMoreText}>VIEW MORE</Text>
          </TouchableOpacity>
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
    letterSpacing: 0.5,
  },
  titleContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
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
    marginBottom: 40,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8DD3C8',
    fontFamily: 'Inter',
    letterSpacing: 0.7,
    paddingHorizontal: 24,
    marginBottom: 4,
  },
  suggestionContainer: {
    paddingHorizontal: 24,
  },
  suggestionText: {
    fontSize: 10,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    lineHeight: 12,
  },
  forYouGrid: {
    paddingHorizontal: 24,
    gap: 16,
  },
  forYouCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center', // Center avatars vertically
    gap: 16,
  },
  placeholderAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6B7280',
    flexShrink: 0,
  },
  forYouCardContent: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 4, // Minimum 20px gap (16px existing gap + 4px padding)
  },
  characterAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    flexShrink: 0,
  },
  characterName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    marginBottom: 8,
    textAlign: 'left',
  },
  characterDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#E5E7EB',
    fontFamily: 'Inter',
    lineHeight: 18,
    textAlign: 'left',
  },
  placeholderName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'Inter',
    marginBottom: 8,
    textAlign: 'left',
  },
  placeholderDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'Inter',
    lineHeight: 18,
    textAlign: 'left',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    paddingVertical: 12,
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F3CC95',
    fontFamily: 'Inter',
    letterSpacing: 0.5,
  },
  categoriesGrid: {
    paddingHorizontal: 24,
    paddingTop: 15, // Minimum 15px space between header and first category
    gap: 16,
  },
  categoryCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 16,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#6B7280',
    flexShrink: 0,
  },
  categoryContent: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter',
    lineHeight: 18,
  },
});