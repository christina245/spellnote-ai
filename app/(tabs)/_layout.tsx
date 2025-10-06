import { Tabs } from 'expo-router';
import { Compass, Home, User } from 'lucide-react-native';
import { usePathname } from 'expo-router';

export default function TabLayout() {
  const pathname = usePathname();


  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1C1830',
          borderTopColor: '#374151',
          borderTopWidth: 1,
          paddingTop: 10,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: '#F3CC95',
        tabBarInactiveTintColor: '#9CA3AF',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Explore',
          tabBarIcon: ({ size, color }) => (
            <Compass size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}