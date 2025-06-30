import { useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function IntroScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/account-creation');
    }, 4000); // Show intro for 4 seconds before navigating

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../assets/images/spellnote ai logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <Text style={styles.description}>
            Your notes to yourself, texted to you when you need them most.
          </Text>
          <Text style={styles.subtitle}>
            Use with or without AI.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D2B4A',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 400,
    alignSelf: 'center',
    width: 336,
    padding: 10,
    paddingHorizontal: 8,
    flexDirection: 'column',
    gap: 46,
  },
  logo: {
    width: 360, // 150% of 240px
    height: 360, // 150% of 240px
    marginBottom: -97, // Previous -27px - 70px = -97px to move logo 70px higher
  },
  textContainer: {
    height: 80,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20, // 125% of 16px
    letterSpacing: -0.16,
    fontFamily: 'Inter',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20, // 125% of 16px
    letterSpacing: -0.16,
    fontFamily: 'Inter',
    marginTop: 30, // Move subtitle down 30px
  },
});