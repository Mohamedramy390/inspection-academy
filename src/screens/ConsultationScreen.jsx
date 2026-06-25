import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { ROUTES } from '../constants/routes';
import { TopAppBar, PrimaryButton } from '../components';
import useContent from '../hooks/useContent';

const ConsultationCard = ({ service }) => (
  <View style={styles.serviceCard}>
    <View style={styles.serviceIconRow}>
      <View style={styles.serviceIconWrap}>
        <Ionicons name={service.icon} size={24} color={Colors.onPrimaryContainer} />
      </View>
      <Text style={styles.serviceTitle}>{service.title}</Text>
    </View>
    <Text style={styles.serviceDesc}>{service.description}</Text>
  </View>
);

const ConsultationScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { data: services, loading } = useContent('consultationServices');

  return (
    <View style={styles.root}>
      <TopAppBar title="Consultation" />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 96 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro */}
        <View style={styles.introSection}>
          <Text style={styles.headline}>Consultation Services</Text>
          <Text style={styles.subtext}>
            Expert engineering solutions and technical assessments to ensure safety, reliability,
            and regulatory compliance for your industrial assets.
          </Text>
        </View>

        {/* Services */}
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.cardsSection}>
            {services?.map((svc) => (
              <ConsultationCard key={svc.id} service={svc} />
            ))}
          </View>
        )}

        {/* CTA */}
        <View style={styles.ctaSection}>
          <PrimaryButton
            label="Get a Quote"
            variant="filled"
            fullWidth
            onPress={() => navigation.navigate(ROUTES.CONTACT)}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scroll: {
    padding: Spacing.containerPadding,
  },
  introSection: {
    gap: 10,
    marginBottom: 24,
  },
  headline: {
    ...Typography.displayLgMobile,
    color: Colors.primary,
  },
  subtext: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    lineHeight: 24,
  },
  cardsSection: {
    gap: 16,
  },
  serviceCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: BorderRadius.xl,
    padding: Spacing.containerPadding,
    gap: 12,
    ...Shadows.sm,
  },
  serviceIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  serviceIconWrap: {
    backgroundColor: Colors.primaryContainer,
    borderRadius: BorderRadius.md,
    padding: 10,
  },
  serviceTitle: {
    ...Typography.headlineMd,
    fontSize: 17,
    color: Colors.primary,
    flex: 1,
  },
  serviceDesc: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    lineHeight: 24,
  },
  ctaSection: {
    marginTop: 24,
  },
});

export default ConsultationScreen;
