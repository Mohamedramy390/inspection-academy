import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, BorderRadius } from '../constants/theme';

/**
 * PrimaryButton — full-width or auto-width branded CTA button.
 * Props:
 *  - label {string}      Button text
 *  - onPress {fn}        Tap handler
 *  - variant {string}    'filled' | 'outlined' | 'tonal'
 *  - icon {node}         Optional right icon element
 *  - fullWidth {bool}    Stretch to container width
 *  - disabled {bool}     Disable state
 */
const PrimaryButton = ({
  label,
  onPress,
  variant = 'filled',
  icon,
  fullWidth = false,
  disabled = false,
  style,
}) => {
  const containerStyle = [
    styles.base,
    variant === 'filled' && styles.filled,
    variant === 'outlined' && styles.outlined,
    variant === 'tonal' && styles.tonal,
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.label,
    variant === 'filled' && styles.labelFilled,
    variant === 'outlined' && styles.labelOutlined,
    variant === 'tonal' && styles.labelTonal,
    disabled && styles.labelDisabled,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
    >
      <Text style={textStyle}>{label}</Text>
      {icon && <View style={styles.iconWrap}>{icon}</View>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    gap: 8,
  },
  filled: {
    backgroundColor: Colors.primary,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  tonal: {
    backgroundColor: Colors.secondaryContainer,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.38,
  },
  label: {
    ...Typography.labelMd,
    fontSize: 15,
  },
  labelFilled: {
    color: Colors.onPrimary,
  },
  labelOutlined: {
    color: Colors.primary,
  },
  labelTonal: {
    color: Colors.onSecondaryContainer,
  },
  labelDisabled: {
    color: Colors.onSurfaceVariant,
  },
  iconWrap: {
    marginLeft: 4,
  },
});

export default PrimaryButton;
