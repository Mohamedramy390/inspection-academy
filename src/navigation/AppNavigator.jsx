import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, BorderRadius } from '../constants/theme';
import { ROUTES } from '../constants/routes';

import HomeScreen from '../screens/HomeScreen';
import CoursesScreen from '../screens/CoursesScreen';
import CourseDetailsScreen from '../screens/CourseDetailsScreen';
import ConsultationScreen from '../screens/ConsultationScreen';
import AboutScreen from '../screens/AboutScreen';
import ContactScreen from '../screens/ContactScreen';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

// ── Tab bar icon config ───────────────────────────────────────────────────────
const TAB_ICONS = {
  [ROUTES.HOME]:         { inactive: 'home-outline',         active: 'home' },
  [ROUTES.COURSES]:      { inactive: 'school-outline',        active: 'school' },
  [ROUTES.CONSULTATION]: { inactive: 'construct-outline',     active: 'construct' },
  [ROUTES.ABOUT]:        { inactive: 'information-outline',   active: 'information-circle' },
  [ROUTES.CONTACT]:      { inactive: 'person-outline',        active: 'person' },
};

const CustomTabLabel = ({ label, focused }) => (
  <Text
    style={[
      styles.tabLabel,
      focused ? styles.tabLabelActive : styles.tabLabelInactive,
    ]}
    numberOfLines={1}
  >
    {label}
  </Text>
);

// ── Bottom Tab Navigator ──────────────────────────────────────────────────────
// CoursesScreen sits directly in the tab — no nested stack.
// CourseDetails lives at the ROOT level so any tab can open it cleanly.
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: true,
      tabBarStyle: styles.tabBar,
      tabBarItemStyle: styles.tabItem,
      tabBarIcon: ({ focused }) => {
        const icons = TAB_ICONS[route.name] || { inactive: 'ellipse-outline', active: 'ellipse' };
        return (
          <View style={[styles.tabIconWrap, focused && styles.tabIconWrapActive]}>
            <Ionicons
              name={focused ? icons.active : icons.inactive}
              size={22}
              color={focused ? Colors.onSecondaryContainer : Colors.onSurfaceVariant}
            />
          </View>
        );
      },
      tabBarLabel: ({ focused, children }) => (
        <CustomTabLabel label={children} focused={focused} />
      ),
      tabBarActiveTintColor: Colors.onSecondaryContainer,
      tabBarInactiveTintColor: Colors.onSurfaceVariant,
    })}
  >
    <Tab.Screen name={ROUTES.HOME}         component={HomeScreen}         options={{ title: 'Home' }} />
    <Tab.Screen name={ROUTES.COURSES}      component={CoursesScreen}      options={{ title: 'Courses' }} />
    <Tab.Screen name={ROUTES.CONSULTATION} component={ConsultationScreen} options={{ title: 'Consult' }} />
    <Tab.Screen name={ROUTES.ABOUT}        component={AboutScreen}        options={{ title: 'About' }} />
    <Tab.Screen name={ROUTES.CONTACT}      component={ContactScreen}      options={{ title: 'Contact' }} />
  </Tab.Navigator>
);

// ── Root Stack — wraps tabs + modal-style detail screens ─────────────────────
// Any screen can navigate to CourseDetails with:
//   navigation.navigate(ROUTES.COURSE_DETAILS, { courseId })
// without touching tab state.
const AppNavigator = () => (
  <RootStack.Navigator screenOptions={{ headerShown: false }}>
    <RootStack.Screen name="Main" component={TabNavigator} />
    <RootStack.Screen
      name={ROUTES.COURSE_DETAILS}
      component={CourseDetailsScreen}
      options={{ animation: 'slide_from_right' }}
    />
  </RootStack.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
    height: 72,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabItem: {
    paddingVertical: 4,
  },
  tabIconWrap: {
    width: 56,
    height: 32,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconWrapActive: {
    backgroundColor: Colors.secondaryContainer,
  },
  tabLabel: {
    ...Typography.labelSm,
    fontSize: 11,
  },
  tabLabelActive: {
    color: Colors.onSecondaryContainer,
  },
  tabLabelInactive: {
    color: Colors.onSurfaceVariant,
  },
});

export default AppNavigator;
