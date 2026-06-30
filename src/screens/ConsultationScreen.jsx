import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { TopAppBar, PrimaryButton } from '../components';
import useContent from '../hooks/useContent';

// ─── EmailJS shared credentials ───────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY  = process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY;
const EMAILJS_PRIVATE_KEY = process.env.EXPO_PUBLIC_EMAILJS_PRIVATE_KEY;
// ─────────────────────────────────────────────────────────────────────────────

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
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef(null);
  const { data: services, loading } = useContent('consultationServices');

  const [form, setForm] = useState({
    name: '', email: '', phone: '', country: '', company: '', comment: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScrollToForm = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone || !form.country || !form.comment) {
      Alert.alert('Required Fields', 'Please fill in all required fields marked with *');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id:  EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id:     EMAILJS_PUBLIC_KEY,
          accessToken: EMAILJS_PRIVATE_KEY,
          template_params: {
            course:   'Consultation Services Request',
            name:     form.name,
            email:    form.email,
            phone:    form.phone,
            country:  form.country,
            company:  form.company || 'N/A',
            message:  form.comment,
          },
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Your consultation request has been sent! We will contact you shortly.');
        setForm({ name: '', email: '', phone: '', country: '', company: '', comment: '' });
      } else {
        const text = await response.text();
        throw new Error(text);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send your request. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.root}>
      <TopAppBar title="Consultation" />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]}
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

        {/* CTA scroll to form */}
        <View style={styles.ctaSection}>
          <PrimaryButton
            label="Request a Consultation"
            variant="filled"
            fullWidth
            onPress={handleScrollToForm}
            icon={<Ionicons name="arrow-down" size={16} color={Colors.onPrimary} />}
          />
        </View>

        {/* ── Consultation Request Form ── */}
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Request a Consultation</Text>
          <Text style={styles.formSubtitle}>
            Fill in the form below and our experts will get back to you within 24 hours.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Name *"
            placeholderTextColor={Colors.onSurfaceVariant}
            value={form.name}
            onChangeText={(t) => setForm({ ...form, name: t })}
          />
          <TextInput
            style={styles.input}
            placeholder="Email *"
            keyboardType="email-address"
            placeholderTextColor={Colors.onSurfaceVariant}
            value={form.email}
            onChangeText={(t) => setForm({ ...form, email: t })}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone (WhatsApp) *"
            keyboardType="phone-pad"
            placeholderTextColor={Colors.onSurfaceVariant}
            value={form.phone}
            onChangeText={(t) => setForm({ ...form, phone: t })}
          />
          <TextInput
            style={styles.input}
            placeholder="Country *"
            placeholderTextColor={Colors.onSurfaceVariant}
            value={form.country}
            onChangeText={(t) => setForm({ ...form, country: t })}
          />
          <TextInput
            style={styles.input}
            placeholder="Company"
            placeholderTextColor={Colors.onSurfaceVariant}
            value={form.company}
            onChangeText={(t) => setForm({ ...form, company: t })}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Comment or Message *"
            placeholderTextColor={Colors.onSurfaceVariant}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={form.comment}
            onChangeText={(t) => setForm({ ...form, comment: t })}
          />

          <PrimaryButton
            label={isSubmitting ? 'Sending...' : 'Submit Request'}
            onPress={handleSubmit}
            disabled={isSubmitting}
            fullWidth
            icon={<Ionicons name="send-outline" size={16} color={Colors.onPrimary} />}
            style={{ marginTop: 8 }}
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
    marginBottom: 8,
  },
  // Form
  formSection: {
    marginTop: 24,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: BorderRadius.lg,
    padding: Spacing.containerPadding,
    ...Shadows.sm,
  },
  formTitle: {
    ...Typography.headlineMd,
    color: Colors.primary,
    fontSize: 20,
    marginBottom: 4,
  },
  formSubtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    marginBottom: 20,
    lineHeight: 22,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    ...Typography.bodyMd,
    color: Colors.onSurface,
  },
  textArea: {
    height: 100,
    paddingTop: 14,
  },
});

export default ConsultationScreen;
