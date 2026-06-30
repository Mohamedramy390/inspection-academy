import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Shadows, Spacing } from '../constants/theme';

/**
 * TrainingEventCard — upcoming training card on the Home screen.
 *
 * Props:
 *  - event  {object}  Upcoming event data  { courseId, dateRange, status, instructor }
 *  - course {object}  Matched course data  { title, daysCount, type, level }
 *  - onPress {fn}     Navigates to CourseDetailsScreen
 */
const WA_NUMBER = process.env.EXPO_PUBLIC_WA_NUMBER || '201023467096';

const TrainingEventCard = ({ event, course, onPress }) => {
  const { dateRange, status = 'open', instructor } = event;
  const title     = course?.title    || event.courseId;
  const daysCount = course?.daysCount || '';
  const type      = course?.type     || '';
  const level     = course?.level    || '';

  const isOpen = status?.toLowerCase() === 'open';

  const handleQuickInquiry = () => {
    const message =
      `Hello Inspection Academy! 👋\n\n` +
      `I'm interested in registering for the following training:\n` +
      `📚 *${title}*\n` +
      `📅 Date: ${dateRange}\n\n` +
      `Please provide registration details and fees.\n\nThank you!`;

    const url = `whatsapp://send?phone=${WA_NUMBER}&text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`).catch(() => {
        Alert.alert('Error', 'Make sure WhatsApp is installed on your device.');
      });
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={isOpen ? onPress : undefined}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${dateRange}`}
    >
      {/* ── Title ── */}
      <Text style={styles.title} numberOfLines={2}>{title}</Text>

      {/* ── Meta row: date · days · type ── */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={13} color={Colors.error} />
          <Text style={styles.metaText}>{dateRange}</Text>
        </View>
        {!!daysCount && (
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={13} color={Colors.onSurfaceVariant} />
            <Text style={styles.metaText}>{daysCount}</Text>
          </View>
        )}
        {!!type && (
          <View style={styles.metaItem}>
            <Ionicons name="globe-outline" size={13} color={Colors.onSurfaceVariant} />
            <Text style={styles.metaText}>{type}</Text>
          </View>
        )}
      </View>

      {/* ── Level & Instructor ── */}
      {!!level && (
        <Text style={styles.detail}>Level: {level}</Text>
      )}
      {!!instructor && (
        <Text style={styles.detail}>Instructor: {instructor}</Text>
      )}

      {/* ── Footer: status badge + Quick Inquiry ── */}
      <View style={styles.footer}>
        <View style={[styles.badge, isOpen ? styles.badgeOpen : styles.badgeClosed]}>
          <Text style={[styles.badgeText, isOpen ? styles.badgeTextOpen : styles.badgeTextClosed]}>
            {isOpen ? 'Open' : 'Closed'}
          </Text>
        </View>

        {isOpen && (
          <TouchableOpacity style={styles.inquiryBtn} onPress={handleQuickInquiry} activeOpacity={0.8}>
            <Ionicons name="logo-whatsapp" size={14} color="#fff" />
            <Text style={styles.inquiryBtnText}>Quick Inquiry</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: BorderRadius.xl,
    padding: 20,
    marginBottom: 12,
    ...Shadows.sm,
  },

  // Title
  title: {
    ...Typography.bodyMd,
    fontWeight: '700',
    color: Colors.onSurface,
    fontSize: 16,
    marginBottom: 10,
  },

  // Meta row
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    fontSize: 12,
  },

  // Detail lines
  detail: {
    ...Typography.bodySm,
    color: Colors.onSurfaceVariant,
    marginBottom: 4,
    fontSize: 13,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },

  // Status badge
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeOpen: {
    backgroundColor: '#ecfdf5',
    borderColor: '#6ee7b7',
  },
  badgeClosed: {
    backgroundColor: '#fff1f2',
    borderColor: '#fecdd3',
  },
  badgeText: {
    ...Typography.labelSm,
    fontWeight: '600',
    fontSize: 12,
  },
  badgeTextOpen: {
    color: '#059669',
  },
  badgeTextClosed: {
    color: '#e11d48',
  },

  // Quick Inquiry button
  inquiryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#25D366',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: BorderRadius.sm,
  },
  inquiryBtnText: {
    ...Typography.labelMd,
    color: '#fff',
    fontSize: 13,
  },
});

export default TrainingEventCard;
