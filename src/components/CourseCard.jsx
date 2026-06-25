import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Shadows } from '../constants/theme';

/**
 * CourseCard — card displayed in the courses list.
 * Props:
 *  - course {object}   Course data object from CMS
 *  - onPress {fn}      Navigation callback
 */
const CourseCard = ({ course, onPress }) => {
  const { title, category, icon, duration, type, description } = course;

  const typeBadgeStyle = {
    Online: { bg: Colors.secondary, text: Colors.onSecondary },
    Public: { bg: Colors.primaryContainer, text: Colors.onPrimaryContainer },
    'In-House': { bg: Colors.tertiaryContainer, text: Colors.onTertiaryContainer },
  };

  const badge = typeBadgeStyle[type] || typeBadgeStyle.Online;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${title}`}
    >
      {/* Header strip */}
      <View style={styles.headerStrip}>
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.badgeText, { color: badge.text }]}>{type}</Text>
        </View>
      </View>

      <View style={styles.body}>
        {/* Category row */}
        <View style={styles.categoryRow}>
          <Ionicons name={icon || 'construct-outline'} size={16} color={Colors.primary} />
          <Text style={styles.category}>{category?.toUpperCase()}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>{title}</Text>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>{description}</Text>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.durationRow}>
            <Ionicons name="time-outline" size={14} color={Colors.onSurfaceVariant} />
            <Text style={styles.duration}>{duration}</Text>
          </View>
          <View style={styles.detailsBtn}>
            <Text style={styles.detailsBtnText}>View Details</Text>
            <Ionicons name="arrow-forward" size={14} color={Colors.onPrimary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    overflow: 'hidden',
    marginBottom: 16,
    ...Shadows.md,
  },
  headerStrip: {
    height: 8,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginTop: -4,
    alignSelf: 'flex-start',
  },
  badgeText: {
    ...Typography.labelSm,
  },
  body: {
    padding: 24,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  category: {
    ...Typography.labelSm,
    color: Colors.primary,
    letterSpacing: 1.2,
  },
  title: {
    ...Typography.headlineMd,
    fontSize: 20,
    color: Colors.onSurface,
    marginBottom: 8,
  },
  description: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  duration: {
    ...Typography.labelMd,
    color: Colors.onSurfaceVariant,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    gap: 6,
  },
  detailsBtnText: {
    ...Typography.labelMd,
    color: Colors.onPrimary,
  },
});

export default CourseCard;
