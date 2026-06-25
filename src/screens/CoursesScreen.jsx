import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { ROUTES } from '../constants/routes';
import { TopAppBar, CourseCard } from '../components';
import useContent from '../hooks/useContent';

const FILTER_OPTIONS = ['All', 'Online', 'Public', 'In-House'];

const CoursesScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { data: courses, loading } = useContent('courses');

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = useMemo(() => {
    if (!courses) return [];
    return courses.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'All' || c.type === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [courses, searchQuery, activeFilter]);

  return (
    <View style={styles.root}>
      <TopAppBar title="Courses" />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 96 },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            {/* Search Input */}
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={18} color={Colors.outline} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search courses..."
                placeholderTextColor={Colors.onSurfaceVariant + '80'}
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                accessibilityLabel="Search courses"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="close-circle" size={18} color={Colors.outline} />
                </TouchableOpacity>
              )}
            </View>

            {/* Filter Pills */}
            <View style={styles.filterRow}>
              {FILTER_OPTIONS.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterPill,
                    activeFilter === filter && styles.filterPillActive,
                  ]}
                  onPress={() => setActiveFilter(filter)}
                  activeOpacity={0.8}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: activeFilter === filter }}
                  accessibilityLabel={filter}
                >
                  <Text
                    style={[
                      styles.filterText,
                      activeFilter === filter && styles.filterTextActive,
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Results count */}
            <Text style={styles.resultsCount}>
              {filtered.length} course{filtered.length !== 1 ? 's' : ''} found
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <CourseCard
            course={item}
            onPress={() => navigation.navigate(ROUTES.COURSE_DETAILS, { courseId: item.id })}
          />
        )}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={Colors.outlineVariant} />
              <Text style={styles.emptyTitle}>No Courses Found</Text>
              <Text style={styles.emptySubtitle}>Try a different search term or filter</Text>
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: Spacing.containerPadding,
  },
  header: {
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainer,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    ...Typography.bodyMd,
    color: Colors.onSurface,
    flex: 1,
    padding: 0,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainer,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    ...Typography.labelMd,
    color: Colors.onSurfaceVariant,
  },
  filterTextActive: {
    color: Colors.onPrimary,
  },
  resultsCount: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    marginBottom: 8,
  },
  loader: {
    marginTop: 60,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    gap: 12,
  },
  emptyTitle: {
    ...Typography.headlineMd,
    color: Colors.onSurfaceVariant,
    fontSize: 18,
  },
  emptySubtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    opacity: 0.7,
  },
});

export default CoursesScreen;
