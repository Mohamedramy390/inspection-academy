import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, BorderRadius } from '../constants/theme';

/**
 * AccordionItem — animated expand/collapse content block.
 * Props:
 *  - title {string}      Section heading
 *  - children {node}     Collapsible content
 *  - defaultOpen {bool}  Start expanded (default false)
 */
const AccordionItem = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const animation = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;
  const rotateAnim = useRef(new Animated.Value(defaultOpen ? 1 : 0)).current;

  const toggle = () => {
    const toValue = open ? 0 : 1;
    Animated.parallel([
      Animated.spring(animation, { toValue, useNativeDriver: false, tension: 80, friction: 10 }),
      Animated.timing(rotateAnim, { toValue, duration: 200, useNativeDriver: true }),
    ]).start();
    setOpen(!open);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggle}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`${open ? 'Collapse' : 'Expand'} ${title}`}
        accessibilityState={{ expanded: open }}
      >
        <Text style={styles.title}>{title}</Text>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Ionicons name="chevron-down" size={20} color={Colors.onSurfaceVariant} />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View
        style={[
          styles.content,
          {
            maxHeight: animation.interpolate({ inputRange: [0, 1], outputRange: [0, 400] }),
            opacity: animation,
          },
        ]}
      >
        <View style={styles.contentInner}>{children}</View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  title: {
    ...Typography.bodyLg,
    fontWeight: '600',
    color: Colors.onSurface,
    flex: 1,
    fontSize: 17,
  },
  content: {
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
    backgroundColor: Colors.surfaceBright,
  },
  contentInner: {
    padding: 16,
  },
});

export default AccordionItem;
