import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { TopAppBar } from '../components';
import useContent from '../hooks/useContent';

const StatItem = ({ value, label }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const AboutScreen = () => {
  const insets = useSafeAreaInsets();
  const { data: about, loading } = useContent('about');

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <TopAppBar title="About Us" rightAction={null} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 96 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero image */}
        <View style={styles.imageWrap}>
          <Image source={{ uri: about?.image }} style={styles.image} resizeMode="cover" />
          <View style={styles.imageOverlay} />
        </View>

        {/* Headline section */}
        <View style={styles.section}>
          <Text style={styles.headline}>{about?.headline}</Text>
          <Text style={styles.body}>{about?.body}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statsGrid}>
            {about?.stats?.map((s, i) => (
              <StatItem key={i} value={s.value} label={s.label} />
            ))}
          </View>
        </View>

        {/* Mission */}
        <View style={styles.missionCard}>
          <View style={styles.missionIconWrap}>
            <Ionicons name="flag" size={24} color={Colors.onPrimary} />
          </View>
          <Text style={styles.cardTitle}>Our Mission</Text>
          <Text style={styles.cardBody}>{about?.mission}</Text>
        </View>

        {/* Vision */}
        <View style={[styles.missionCard, styles.visionCard]}>
          <View style={[styles.missionIconWrap, styles.visionIconWrap]}>
            <Ionicons name="eye" size={24} color={Colors.onPrimary} />
          </View>
          <Text style={styles.cardTitle}>Our Vision</Text>
          <Text style={styles.cardBody}>{about?.vision}</Text>
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flexGrow: 1,
  },
  // Image
  imageWrap: {
    height: 240,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primary + '33',
  },
  // Text sections
  section: {
    padding: Spacing.containerPadding,
    gap: 12,
  },
  headline: {
    ...Typography.displayLgMobile,
    color: Colors.primary,
  },
  body: {
    ...Typography.bodyLg,
    color: Colors.onSurfaceVariant,
    lineHeight: 28,
  },
  // Stats
  statsCard: {
    marginHorizontal: Spacing.containerPadding,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: 20,
    marginBottom: 20,
    ...Shadows.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    paddingVertical: 16,
  },
  statValue: {
    ...Typography.headlineLg,
    color: Colors.onPrimary,
    fontSize: 28,
  },
  statLabel: {
    ...Typography.labelSm,
    color: Colors.primaryFixedDim,
    textAlign: 'center',
    marginTop: 4,
  },
  // Mission/Vision cards
  missionCard: {
    marginHorizontal: Spacing.containerPadding,
    marginBottom: 16,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: BorderRadius.xl,
    padding: 20,
    gap: 10,
    ...Shadows.sm,
  },
  visionCard: {
    marginBottom: 24,
  },
  missionIconWrap: {
    backgroundColor: Colors.primary,
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visionIconWrap: {
    backgroundColor: Colors.secondary,
  },
  cardTitle: {
    ...Typography.headlineMd,
    color: Colors.primary,
    fontSize: 20,
  },
  cardBody: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    lineHeight: 24,
  },
});

export default AboutScreen;
