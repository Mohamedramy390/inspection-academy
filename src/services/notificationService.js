/**
 * Firebase Push Notification Service
 *
 * Uses Expo Notifications + Firebase Cloud Messaging (FCM).
 *
 * SETUP STEPS:
 * 1. Create a Firebase project at https://console.firebase.google.com
 * 2. Add an Android/iOS app and download google-services.json / GoogleService-Info.plist
 * 3. Place google-services.json in the project root (for Android)
 * 4. Run: npx expo install expo-notifications expo-device expo-constants
 * 5. Add the plugin to app.json (already configured below in app.json)
 * 6. Replace FIREBASE_CONFIG with your actual Firebase config object
 */

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';

// ─── Notification Display Behavior ────────────────────────────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// ─── Register for Push Notifications ─────────────────────────────────────────
/**
 * Requests permission and returns the Expo push token.
 * The token can be sent to your server to target this device.
 */
export async function registerForPushNotificationsAsync() {
  let token;

  if (!Device.isDevice) {
    console.warn('[Notifications] Must use physical device for push notifications');
    return null;
  }

  // Check existing permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert(
      'Permission Required',
      'Enable notifications in Settings to receive course updates and alerts.',
    );
    return null;
  }

  // Get Expo push token (works with FCM under the hood)
  try {
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    token = expoPushToken;
    console.log('[Notifications] Expo Push Token:', token);
  } catch (err) {
    console.error('[Notifications] Failed to get token:', err);
  }

  // Android channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Inspection Academy',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#001430',
      sound: 'default',
    });

    await Notifications.setNotificationChannelAsync('courses', {
      name: 'Course Updates',
      description: 'Notifications about new courses and upcoming events',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#ad3300',
    });
  }

  return token;
}

// ─── Notification Listeners ───────────────────────────────────────────────────
/**
 * Sets up foreground + background tap handlers.
 * Call this once in your root component or navigator.
 *
 * @param {function} onNotification   Foreground notification callback
 * @param {function} onNotificationResponse  Background tap callback
 * @returns {object} Subscription cleanup object — call remove() on unmount
 */
export function setupNotificationListeners(onNotification, onNotificationResponse) {
  const foregroundSub = Notifications.addNotificationReceivedListener(onNotification);
  const responseSub = Notifications.addNotificationResponseReceivedListener(onNotificationResponse);

  return {
    remove: () => {
      foregroundSub.remove();
      responseSub.remove();
    },
  };
}

// ─── Send Local Test Notification ────────────────────────────────────────────
/**
 * Schedules a local notification for testing.
 * Remove in production.
 */
export async function sendLocalTestNotification(title = 'New Course Available!', body = 'API 580 Risk-Based Inspection starts next week.') {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
      data: { screen: 'Courses' },
    },
    trigger: { seconds: 2 },
  });
}

// ─── FCM Token (Direct Firebase) ─────────────────────────────────────────────
/**
 * If you use @react-native-firebase/messaging directly (bare workflow):
 *
 * import messaging from '@react-native-firebase/messaging';
 *
 * export async function getFCMToken() {
 *   const token = await messaging().getToken();
 *   return token;
 * }
 *
 * export function subscribeToTopic(topic) {
 *   return messaging().subscribeToTopic(topic);
 * }
 */

export default {
  registerForPushNotificationsAsync,
  setupNotificationListeners,
  sendLocalTestNotification,
};
