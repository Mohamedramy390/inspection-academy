import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Typography } from '../constants/theme';

/**
 * TopAppBar — shared header used across all screens.
 * Props:
 *  - title {string}        Page title (default: 'Inspection Academy')
 *  - showBack {bool}       Show back arrow instead of menu icon
 *  - rightAction {string}  Icon name for right button ('search' | 'share' | null)
 *  - onRightPress {fn}     Callback for right button
 */
const TopAppBar = ({
  title = 'Inspection Academy',
  showBack = false,
  rightAction = 'search',
  onRightPress,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleLeftPress = () => {
    if (showBack) {
      navigation.goBack();
    }
    // Menu: drawer toggle can be wired here
  };

  const iconMap = {
    search: 'search-outline',
    share: 'share-social-outline',
    menu: 'menu-outline',
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top || StatusBar.currentHeight || 0 }]}>
      <StatusBar backgroundColor={Colors.surface} barStyle="dark-content" />
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={handleLeftPress}
        activeOpacity={0.7}
        accessibilityLabel={showBack ? 'Go back' : 'Open menu'}
      >
        <Ionicons
          name={showBack ? 'arrow-back-outline' : 'menu-outline'}
          size={24}
          color={Colors.primary}
        />
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {rightAction ? (
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onRightPress}
          activeOpacity={0.7}
          accessibilityLabel={rightAction}
        >
          <Ionicons name={iconMap[rightAction] || 'ellipsis-vertical-outline'} size={24} color={Colors.primary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconBtn} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
    paddingHorizontal: 8,
    minHeight: 64,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.headlineMd,
    color: Colors.primary,
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
  },
});

export default TopAppBar;
