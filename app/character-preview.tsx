import React, { useState } from 'react';
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
import { ArrowLeft, Heart, Star, Plus } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const { width: screenWidth } = Dimensions.get('window');

export default function CharacterPreview() {
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  const characterData = {
    id: params.characterId as string,
    name: params.characterName as string,
    description: params.characterDescription as string,
    vibes: params.characterVibes ? JSON.parse(params.characterVibes as string) : [],
    tagline: params.characterTagline as string,
    avatarUrl: params.avatarUrl as string,
    isPremade: params.isPremade === 'true'
  };

  const handleBack = () => {
    router.back();
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleAddCharacter = () => {
    Alert.alert(
      'Add Character',
      `Add ${characterData.name} to your characters?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add', 
          onPress: () => {
            // Navigate back to home with the new character data
            router.push({
              pathname: '/(tabs)',
              params: {
                userMode: 'character',
                characterType: 'character',
                characterName: characterData.name,
                characterDescription: characterData.description,
                characterVibes: JSON.stringify(characterData.vibes),
                characterTagline: characterData.tagline,
                userAvatarUri: characterData.avatarUrl
              }
            });
          }
        }
      ]
    );
  };

  const handleTryNotificationPreview = () => {
    // Navigate to notification preview with sample data
    router.push({
      pathname: '/notification-preview',
      params: {
        characterType: 'character',
        characterName: characterData.name,
        characterDescription: characterData.description,
        characterVibes: JSON.stringify(characterData.vibes),
        characterTagline: characterData.tagline,
        userAvatarUri: characterData.avatarUrl,
        // Sample notification data
        notificationHeader: 'Daily Reminder',
        notificationDetails: 'Remember to drink water and take a short walk to stay healthy and energized throughout the day.',
        startDate: new Date().toISOString(),
        time: '2:00 PM'
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
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#F3CC95" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.likeButton}
          onPress={handleLike}
          activeOpacity={0.7}
        >
          <Heart 
            size={24} 
            color={isLiked ? "#EF4444" : "#FFFFFF"} 
            fill={isLiked ? "#EF4444" : "transparent"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Character Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: characterData.avatarUrl }}
            style={styles.characterImage}
            resizeMode="cover"
          />
        </View>

        {/* Character Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.characterName}>{characterData.name}</Text>
          <Text style={styles.characterTagline}>{characterData.tagline}</Text>

          {/* Vibes */}
          <View style={styles.vibesSection}>
            <Text style={styles.vibesTitle}>Character Vibes</Text>
            <View style={styles.vibesContainer}>
              {characterData.vibes.map((vibe: string, index: number) => (
                <View key={index} style={styles.vibeTag}>
                  <Text style={styles.vibeText}>{vibe}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionTitle}>About</Text>
            <Text style={styles.descriptionText}>{characterData.description}</Text>
          </View>

          {/* Sample Interaction */}
          <View style={styles.sampleSection}>
            <Text style={styles.sampleTitle}>Sample Interaction</Text>
            <View style={styles.sampleNotification}>
              <View style={styles.notificationHeader}>
                <View style={styles.notificationAvatar}>
                  <Image 
                    source={{ uri: characterData.avatarUrl }}
                    style={styles.notificationAvatarImage}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.notificationInfo}>
                  <Text style={styles.notificationSender}>{characterData.name}</Text>
                  <Text style={styles.notificationTime}>now</Text>
                </View>
              </View>
              <Text style={styles.notificationText}>
                Hey there! Just a friendly reminder to drink some water and take a quick stretch break. Your body will thank you! 💧✨
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.previewButton}
              onPress={handleTryNotificationPreview}
              activeOpacity={0.8}
            >
              <Text style={styles.previewButtonText}>Try Notification Preview</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddCharacter}
              activeOpacity={0.8}
            >
              <Plus size={20} color="#1C1830" />
              <Text style={styles.addButtonText}>Add to My Characters</Text>
            </TouchableOpacity>
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
  likeButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    height: 300,
    marginHorizontal: 24,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
  },
  characterImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    paddingHorizontal: 24,
  },
  characterName: {
    fontSize: 28,
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  characterTagline: {
    fontSize: 16,
    fontWeight: '400',
    color: '#F3CC95',
    fontFamily: 'Inter',
    marginBottom: 24,
    lineHeight: 20,
  },
  vibesSection: {
    marginBottom: 24,
  },
  vibesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    marginBottom: 12,
  },
  vibesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  vibeTag: {
    backgroundColor: 'rgba(243, 204, 149, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  vibeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F3CC95',
    fontFamily: 'Inter',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#E5E7EB',
    fontFamily: 'Inter',
    lineHeight: 22,
  },
  sampleSection: {
    marginBottom: 32,
  },
  sampleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    marginBottom: 12,
  },
  sampleNotification: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  notificationAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 12,
  },
  notificationAvatarImage: {
    width: 40,
    height: 40,
  },
  notificationInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationSender: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter',
  },
  notificationTime: {
    fontSize: 14,
    fontWeight: '400',
    color: '#9CA3AF',
    fontFamily: 'Inter',
  },
  notificationText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#E5E7EB',
    fontFamily: 'Inter',
    lineHeight: 20,
  },
  actionButtons: {
    gap: 12,
  },
  previewButton: {
    backgroundColor: 'rgba(243, 204, 149, 0.2)',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(243, 204, 149, 0.4)',
  },
  previewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F3CC95',
    fontFamily: 'Inter',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F3CC95',
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1830',
    fontFamily: 'Inter',
  },
});