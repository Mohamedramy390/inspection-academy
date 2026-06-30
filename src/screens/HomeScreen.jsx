import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { ROUTES } from '../constants/routes';
import { TopAppBar, TrainingEventCard, ServiceCard, PrimaryButton } from '../components';
import useContent from '../hooks/useContent';

const HomeScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { data: site } = useContent('site');
  const { data: courses } = useContent('courses');
  const { data: gridServices } = useContent('homeGridServices');

  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const getCourse = (courseId) => courses?.find((c) => c.id === courseId);

  // Navigate directly to CourseDetails (which is now in the root stack)
  const navigateToCourse = (courseId) =>
    navigation.navigate(ROUTES.COURSE_DETAILS, { courseId });

  // Flatten course.trainings → [{...training, courseId}]
  const allEvents = useMemo(() => {
    if (!courses) return [];
    return courses.flatMap((course) =>
      (course.trainings || []).map((t) => ({ ...t, courseId: course.id }))
    );
  }, [courses]);

  // Build unique filter tabs from courses that have trainings
  const filterTabs = useMemo(() => {
    if (!courses) return [];
    return courses
      .filter((c) => c.trainings?.length > 0)
      .map((c) => ({ id: c.id, label: c.title }));
  }, [courses]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    if (!selectedCourseId) return allEvents;
    return allEvents.filter((e) => e.courseId === selectedCourseId);
  }, [allEvents, selectedCourseId]);

  // Dynamic section title
  const sectionTitle = useMemo(() => {
    if (!selectedCourseId) return 'Upcoming Trainings';
    const course = getCourse(selectedCourseId);
    return `Upcoming ${course?.title || 'Training'}`;
  }, [selectedCourseId, courses]);

  return (
    <View style={styles.root}>
      <TopAppBar title="Inspection Academy" />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 96 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Banner ─────────────────────────────────────── */}
        <ImageBackground
          source={{ uri: site?.heroImage || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800' }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              {site?.tagline || 'Your Trusted Partner for Training Solutions & Consulting Services'}
            </Text>
            <Text style={styles.heroSubtitle}>
              {site?.description}
            </Text>
            <TouchableOpacity
              style={styles.heroBtn}
              onPress={() => navigation.navigate(ROUTES.COURSES)}
              activeOpacity={0.85}
            >
              <Text style={styles.heroBtnText}>Explore Courses</Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.onSecondaryContainer} />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* ── Upcoming Trainings ───────────────────────────────── */}
        <View style={styles.section}>
          {/* Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{sectionTitle}</Text>
            <TouchableOpacity onPress={() => navigation.navigate(ROUTES.COURSES)}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Course filter pills */}
          {filterTabs.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
            >
              <TouchableOpacity
                style={[styles.filterPill, !selectedCourseId && styles.filterPillActive]}
                onPress={() => setSelectedCourseId(null)}
              >
                <Text style={[styles.filterPillText, !selectedCourseId && styles.filterPillTextActive]}>
                  All
                </Text>
              </TouchableOpacity>
              {filterTabs.map((tab) => (
                <TouchableOpacity
                  key={tab.id}
                  style={[styles.filterPill, selectedCourseId === tab.id && styles.filterPillActive]}
                  onPress={() => setSelectedCourseId(tab.id === selectedCourseId ? null : tab.id)}
                >
                  <Text style={[styles.filterPillText, selectedCourseId === tab.id && styles.filterPillTextActive]}
                    numberOfLines={1}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Event cards */}
          {filteredEvents.map((event, idx) => {
            const course = getCourse(event.courseId);
            return (
              <TrainingEventCard
                key={`${event.courseId}-${idx}`}
                event={event}
                course={course}
                onPress={() => navigateToCourse(event.courseId)}
              />
            );
          })}
        </View>

        {/* ── Consultation Services ────────────────────────────── */}
        <View style={[styles.section, styles.consultSection]}>
          <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Consultation Services</Text>

          <View style={styles.grid}>
            {gridServices?.map((svc, idx) => (
              <ServiceCard
                key={idx}
                icon={svc.icon}
                label={svc.label}
                onPress={() => navigation.navigate(ROUTES.CONSULTATION)}
                style={{ width: '48%', flex: 0 }}
              />
            ))}
          </View>

          <PrimaryButton
            label="Request Consultation"
            variant="outlined"
            fullWidth
            onPress={() => navigation.navigate(ROUTES.CONSULTATION)}
            style={{ marginTop: 16 }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flexGrow: 1,
  },
  // Hero
  hero: {
    minHeight: 320,
    justifyContent: 'flex-end',
  },
  heroImage: {
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primary,
    opacity: 0.4, // Reduced overall opacity so the background image shows clearly
  },
  heroContent: {
    padding: 24,
    gap: 16,
    backgroundColor: 'rgba(0, 20, 48, 0.75)', // The new distinct layer just behind the text
    margin: Spacing.containerPadding,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)', // Subtle border for a glass effect
  },
  heroTitle: {
    ...Typography.displayLgMobile,
    color: '#ffffff', // Ensure pure white text on the dark layer
  },
  heroSubtitle: {
    ...Typography.bodyLg,
    color: Colors.primaryFixedDim,
  },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryContainer,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: BorderRadius.sm,
    gap: 8,
  },
  heroBtnText: {
    ...Typography.labelMd,
    color: Colors.onSecondaryContainer,
  },
  // Sections
  section: {
    paddingHorizontal: Spacing.containerPadding,
    paddingVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  sectionTitle: {
    ...Typography.headlineMd,
    color: Colors.primary,
    flex: 1,
    flexWrap: 'wrap',
  },
  viewAll: {
    ...Typography.labelSm,
    color: Colors.secondary,
    marginLeft: 8,
  },
  // Filter pills
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surface,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterPillText: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 12,
    maxWidth: 140,
  },
  filterPillTextActive: {
    color: Colors.onPrimary,
  },
  // Consultation
  consultSection: {
    backgroundColor: Colors.surfaceContainerLow,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});

export default HomeScreen;
