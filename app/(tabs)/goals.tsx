import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function GoalsTab() {
  const router = useRouter();

  useEffect(() => {
    // Immediately redirect to my-goals page
    router.replace('/my-goals');
  }, [router]);

  // Return null since we're immediately redirecting
  return null;
}