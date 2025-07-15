import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="account-creation" />
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="phone-verification" />
        <Stack.Screen name="rules" />
        <Stack.Screen name="community-guidelines" />
        <Stack.Screen name="first-notification" />
        <Stack.Screen name="character-selection" />
        <Stack.Screen name="ai-free" />
        <Stack.Screen name="character-creation" />
        <Stack.Screen name="character-profile" />
        <Stack.Screen name="create-character" />
        <Stack.Screen name="onboarding-character-profile" />
        <Stack.Screen name="notification-preview-user" />
        <Stack.Screen name="spellbot" />
        <Stack.Screen name="notification-preview" />
        <Stack.Screen name="sms-integration" />
        <Stack.Screen name="switch-to-ai-free" />
        <Stack.Screen name="switch-to-ai-mode" />
        <Stack.Screen name="edit-notification" />
        <Stack.Screen name="my-goals" />
        <Stack.Screen name="add-goal" />
        <Stack.Screen name="onboarding-character-search" />
        <Stack.Screen name="browse-characters" />
        <Stack.Screen name="character-preview" />
        <Stack.Screen name="user-profile" />
        <Stack.Screen name="resources" />
        <Stack.Screen name="submit-feedback" />
        <Stack.Screen name="report-issue" />
        <Stack.Screen name="add-notification" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}