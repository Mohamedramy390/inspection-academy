import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius, Shadows } from '../constants/theme';

/**
 * ServiceCard — grid card used in Home & Consultation pages.
 * Props:
 *  - icon {string}    Ionicons icon name
 *  - label {string}   Card label text
 *  - onPress {fn}     Optional press handler
 */
const ServiceCard = ({ icon, label, onPress, style }) => (
  <TouchableOpacity
    style={[styles.card, style]}
    onPress={onPress}
    activeOpacity={0.8}
    accessibilityRole="button"
    accessibilityLabel={label}
  >
    <Ionicons name={icon} size={32} color={Colors.secondary} />
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: BorderRadius.md,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 100,
    ...Shadows.sm,
  },
  label: {
    ...Typography.labelMd,
    color: Colors.onSurface,
    textAlign: 'center',
  },
});

export default ServiceCard;
