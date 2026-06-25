import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius } from '../constants/theme';

/**
 * FormInput — styled text input with label and optional icon.
 * Props:
 *  - label {string}
 *  - placeholder {string}
 *  - value {string}
 *  - onChangeText {fn}
 *  - keyboardType {string}
 *  - icon {string}   Ionicons icon name for left decoration
 *  - multiline {bool}
 *  - numberOfLines {number}
 *  - error {string}  Validation error message
 */
const FormInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  icon,
  multiline = false,
  numberOfLines = 1,
  error,
  ...rest
}) => {
  const [focused, setFocused] = React.useState(false);

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          focused && styles.focused,
          error && styles.errorBorder,
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={focused ? Colors.primary : Colors.onSurfaceVariant}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, multiline && { height: numberOfLines * 24, textAlignVertical: 'top' }]}
          placeholder={placeholder}
          placeholderTextColor={Colors.onSurfaceVariant + '80'}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    ...Typography.labelMd,
    color: Colors.onSurface,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  focused: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  errorBorder: {
    borderColor: Colors.error,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
    flex: 1,
    padding: 0,
  },
  error: {
    ...Typography.labelSm,
    color: Colors.error,
    marginTop: 4,
  },
});

export default FormInput;
