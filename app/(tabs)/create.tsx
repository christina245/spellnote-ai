import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Sparkles, Users, TrendingUp } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

export default function ExploreTab() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  const handleBrowseCharacters = () => {
    router.push('/browse-characters');
  };

  const featuredCharacters = [
    {
      id: '1',
      name: 'Luna the Wise',
      category: 'Fantasy',
      imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
      likes: 1247
    },
    {
      id: '2',
      name: 'Captain Nova',
      category: 'Sci-Fi',
      imageUrl: 'https://images.pexels.com/photos/2182863/pexels-photo-2182863.jpeg?auto=compress&cs=tinysrgb&w=400',
      likes: 892
    },
    {
      id: '3',
      name: 'Zen Master Kiko',
      category: 'Modern',
      imageUrl: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
      likes: 2156
    }
  ];

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.subtitle}>Discover amazing characters and get inspired</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={handleBrowseCharacters}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconContainer}>
              <Search size={24} color="#F3CC95" />
            </View>
            <Text style={styles.actionTitle}>Browse All Characters</Text>
            <Text style={styles.actionDescription}>Explore our full collection of premade characters</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/create-character')}
            activeOpacity={0.8}
          >
            <View style={styles.actionIconContainer}>
              <Sparkles size={24} color="#F3CC95" />
            </View>
            <Text style={styles.actionTitle}>Create Character</Text>
            <Text style={styles.actionDescription}>Design your own unique character from scratch</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Characters */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Characters</Text>
            <TouchableOpacity onPress={handleBrowseCharacters} activeOpacity={0.7}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScroll}
          >
            {featuredCharacters.map(character => (
              <TouchableOpacity
                key={character.id}
                style={styles.featuredCard}
                onPress={handleBrowseCharacters}
                activeOpacity={0.8}
              >
                <Image 
                  source={{ uri: character.imageUrl }}
                  style={styles.featuredImage}
                  resizeMode="cover"
                />
                <View style={styles.featuredInfo}>
                  <Text style={styles.featuredName}>{character.name}</Text>
                  <Text style={styles.featuredCategory}>{character.category}</Text>
                  <View style={styles.featuredStats}>
                    <Users size={12} color="#9CA3AF" />
                    <Text style={styles.featuredLikes}>{character.likes}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Trending Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.trendingHeader}>
              <TrendingUp size={20} color="#F3CC95" />
              <Text style={styles.sectionTitle}>Trending Now</Text>
            </View>
          </View>

          <View style={styles.trendingList}>
            <View style={styles.trendingItem}>
              <Text style={styles.trendingRank}>#1</Text>
              <Text style={styles.trendingName}>Mystical Characters</Text>
              <Text style={styles.trendingGrowth}>+24%</Text>
            </View>
            <View style={styles.trendingItem}>
              <Text style={styles.trendingRank}>#2</Text>
              <Text style={styles.trendingName}>Sci-Fi Companions</Text>
              <Text style={styles.trendingGrowth}>+18%</Text>
            </View>
            <View style={styles.trendingItem}>
              <Text style={styles.trendingRank}>#3</Text>
              <Text style={styles.trendingName}>Motivational Coaches</Text>
              <Text style={styles.trendingGrowth}>+15%</Text>
            </View>
          </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter',
  },
  quickActions: {
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 16,
  },
  actionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(243, 204, 149, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    marginBottom: 8,
  },
  actionDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter',
    lineHeight: 18,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F3CC95',
    fontFamily: 'Inter',
  },
  featuredScroll: {
    paddingHorizontal: 24,
    gap: 16,
  },
  featuredCard: {
    width: 160,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: 120,
  },
  featuredInfo: {
    padding: 12,
  },
  featuredName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  featuredCategory: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter',
    marginBottom: 8,
  },
  featuredStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featuredLikes: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter',
  },
  trendingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trendingList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  trendingRank: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F3CC95',
    fontFamily: 'Inter',
    width: 32,
  },
  trendingName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    marginLeft: 12,
  },
  trendingGrowth: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    fontFamily: 'Inter',
  },
});