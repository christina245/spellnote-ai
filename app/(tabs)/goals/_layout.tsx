import { Stack } from 'expo-router/stack';

export default function GoalsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="add-goal" options={{ headerShown: false }} />
    </Stack>
  );
}