import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
} from '@expo-google-fonts/hanken-grotesk';
import * as SplashScreen from 'expo-splash-screen';

import AppNavigator from './src/navigation/AppNavigator';
import {
  registerForPushNotificationsAsync,
  setupNotificationListeners,
} from './src/services/notificationService';

// Keep splash visible while fonts load
SplashScreen.preventAutoHideAsync();

export default function App() {
  const navigationRef = useRef(null);

  const [fontsLoaded] = useFonts({
    HankenGrotesk_400Regular,
    HankenGrotesk_500Medium,
    HankenGrotesk_600SemiBold,
    HankenGrotesk_700Bold,
  });

  // ── Firebase / Expo Push Notifications ──────────────────────────────────────
  useEffect(() => {
    let listeners;

    (async () => {
      // Request permission and get push token
      const token = await registerForPushNotificationsAsync();
      if (token) {
        console.log('[App] Push token registered:', token);
        // TODO: send token to your backend / Firestore
        // await saveTokenToFirestore(token);
      }

      // Set up notification listeners
      listeners = setupNotificationListeners(
        (notification) => {
          // Foreground notification received
          console.log('[App] Foreground notification:', notification);
        },
        (response) => {
          // User tapped a notification
          const screen = response.notification.request.content.data?.screen;
          if (screen && navigationRef.current) {
            navigationRef.current.navigate(screen);
          }
        },
      );
    })();

    return () => {
      listeners?.remove();
    };
  }, []);

  // Hide splash once fonts are ready
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <NavigationContainer ref={navigationRef}>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
