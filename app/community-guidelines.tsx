import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CommunityGuidelines() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Montserrat_700Bold,
  });

  const handleBack = () => {
    router.back();
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#F3CC95" />
          <Text style={styles.backText}>BACK</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>Community guidelines</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Introduction */}
        <View style={styles.bodyContainer}>
          <Text style={styles.bodyText}>
            We want you to have fun while staying on top of your goals. To keep our community safe and legal, please follow these simple rules.
          </Text>
          
          <Text style={styles.bodyText}>
            ⭐ <Text style={styles.boldText}>Important note:</Text> you also have the option to use this app without any AI at all. We know that sometimes, you'd rather hear some reminders from yourself rather than an AI assistant. Each reminder gives you the option to be sent without AI modification. 
          </Text>
        </View>

        {/* AI Use: What's Allowed */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>✅ AI Use: What's Allowed</Text></View>
          
          <View style={styles.bulletSection}>
            <Text style={styles.bulletHeader}>• Typical task reminders</Text>
            <Text style={styles.bulletText}>such as "call mom at 5 pm, get milk"</Text>
          </View>
          
          <View style={styles.bulletSection}>
            <Text style={styles.bulletHeader}>• Personal helpful notes</Text>
            <Text style={styles.bulletText}>Such as "Don't forget to ask these questions on your date" or "stop texting your ex"</Text>
          </View>
          

        {/* What's Not Allowed */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>🚫 What's Not Allowed</Text>
          
          <Text style={styles.subHeader}>These are risk factors for unhealthy AI emotional dependency</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletText}>• Making AI characters text you NSFW material</Text>
            <Text style={styles.bulletText}>• Soliciting emotionally intimate relationships with AI characters</Text>
            <Text style={styles.bulletText}>• Submitting copyrighted or NSFW characters for use</Text>
        
          </View>

          <Text style={styles.subHeader}>Copyrighted Characters</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletText}>• Characters from anime, manga, movies, or TV shows</Text>
            <Text style={styles.bulletText}>• Video game characters</Text>
            <Text style={styles.bulletText}>• Book characters</Text>
            <Text style={styles.bulletText}>• Comic book heroes or villains</Text>
            <Text style={styles.bulletText}>• Any character owned by a company</Text>
          </View>

          <Text style={styles.subHeader}>Inappropriate Content</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletText}>• No characters under 18 years old</Text>
            <Text style={styles.bulletText}>• No sexual, violent, or offensive personalities</Text>
            <Text style={styles.bulletText}>• No characters promoting harmful activities</Text>
            <Text style={styles.bulletText}>• No hate speech or discriminatory content</Text>
            <Text style={styles.bulletText}>• No characters encouraging dangerous behavior</Text>
          </View>
        </View>

        {/* Why These Guidelines Matter */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>💡 Why These Guidelines Matter</Text>
          <Text style={styles.bodyText}>
            These guidelines protect both you and our app from legal issues while keeping our community safe and welcoming for everyone.
          </Text>
          
          <Text style={styles.bodyText}>
            ⭐ Remember: You can create characters inspired by popular archetypes without copying specific characters. Think "eccentric swordsman" instead of naming a specific character!
          </Text>
        </View>

        {/* What Happens If Rules Are Broken */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>⚠️ What Happens If Rules Are Broken?</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletText}>• Character will be removed from the app</Text>
            <Text style={styles.bulletText}>• Account may be temporarily suspended</Text>
            <Text style={styles.bulletText}>• Repeated violations may result in permanent ban</Text>
            <Text style={styles.bulletText}>• We'll always give you a chance to fix minor issues first</Text>
          </View>
        </View>

        {/* Need Ideas */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>
            <Text style={styles.iconSmaller}>💡</Text> Need Ideas?
          </Text>
          
          <Text style={styles.subHeader}>
            <Text style={styles.iconSmaller}>💡</Text> Example Character Concepts:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletText}>• Supportive gym buddy</Text>
            <Text style={styles.bulletText}>• Wise coffee shop owner</Text>
            <Text style={styles.bulletText}>• Cheerful morning person</Text>
            <Text style={styles.bulletText}>• Focused study partner</Text>
            <Text style={styles.bulletText}>• Caring plant parent</Text>
            <Text style={styles.bulletText}>• Adventurous traveler</Text>
          </View>
        </View>

        {/* Contact Support - reduced padding by 50% */}
        <View style={styles.supportSection}>
          <Text style={styles.sectionHeader}>
            <Text style={styles.iconSmaller}>💡</Text> Questions? Contact our support team - we're here to help you create amazing characters that follow the rules!
          </Text>
        </View>

        {/* Agreement Statement */}
        <View style={styles.agreementSection}>
          <Text style={styles.agreementText}>
            ✅ By creating characters, you agree to follow these guidelines and confirm all characters are your own original creations.
          </Text>
          
          <Text style={styles.disclaimerText}>
            Spellnote is not responsible for any damages that may occur as per the characters' speech and any relationships formed.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D2B4A',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F3CC95',
    fontFamily: 'Inter',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Montserrat_700Bold',
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 36,
    letterSpacing: -0.28,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 60, // Increased bottom padding to ensure icons are fully visible
  },
  bodyContainer: {
    // CSS from user specifications
    display: 'flex',
    width: 295,
    height: 194,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    flexShrink: 0,
    marginBottom: 24,
  },
  bodyText: {
    // Typography from user specifications
    color: '#FFF',
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 17.5, // 125% of 14px
    marginBottom: 16,
  },
  boldText: {
    fontWeight: '700',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    // Subheader CSS from user specifications
    color: '#FFF',
    fontFamily: 'Inter',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 20, // 125% of 16px
    marginBottom: 12,
  },
  subHeader: {
    color: '#FFF',
    fontFamily: 'Inter',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 8,
    marginTop: 16,
  },
  bulletSection: {
    marginBottom: 12,
  },
  bulletHeader: {
    color: '#FFF',
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 17.5,
  },
  bulletText: {
    color: '#FFF',
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 17.5,
  },
  bulletList: {
    marginBottom: 16,
  },
  supportSection: {
    marginBottom: 12, // Reduced from 24 by 50%
  },
  iconSmaller: {
    fontSize: 14.4, // 10% smaller than 16px (16 * 0.9 = 14.4)
  },
  agreementSection: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#374151',
    marginBottom: 20, // Added margin to ensure content doesn't get cut off
  },
  agreementText: {
    color: '#E1B8B2', // Changed from #F3CC95 to #E1B8B2
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 17.5,
    marginBottom: 16,
  },
  disclaimerText: {
    color: '#9CA3AF',
    fontFamily: 'Inter',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 15,
    fontStyle: 'italic',
  },
});