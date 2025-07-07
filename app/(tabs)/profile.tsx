import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function ProfileTab() {
  const router = useRouter();

  useEffect(() => {
    // Immediately redirect to user profile page
    router.replace('/user-profile');
  }, [router]);

  // Return null since we're immediately redirecting
  return null;
}