import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { TopAppBar, FormInput, PrimaryButton } from '../components';
import useContent from '../hooks/useContent';

const ContactScreen = () => {
  const insets = useSafeAreaInsets();
  const { data: site } = useContent('site');

  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email address';
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    // TODO: wire to your backend / Firebase Function
    setTimeout(() => {
      setSubmitting(false);
      setForm({ name: '', email: '', company: '', message: '' });
      setErrors({});
      Alert.alert('Message Sent!', 'Our team will get back to you within 24 hours.', [
        { text: 'OK' },
      ]);
    }, 1500);
  };

  const handleEmail = () => Linking.openURL(`mailto:${site?.email}`);
  const handlePhone = () => Linking.openURL(`tel:${site?.phone}`);

  return (
    <View style={styles.root}>
      <TopAppBar title="Contact Us" rightAction={null} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 96 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Intro */}
        <View style={styles.introSection}>
          <Text style={styles.headline}>Get in Touch</Text>
          <Text style={styles.subtext}>
            Need specialized training or consultation? Our team of industrial experts is ready to assist you.
          </Text>
        </View>

        {/* Headquarters */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Headquarters</Text>

          <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL('maps:')}>
            <Ionicons name="location-outline" size={20} color={Colors.primary} />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Office Address</Text>
              <Text style={styles.contactValue}>{site?.address}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactRow} onPress={handlePhone}>
            <Ionicons name="call-outline" size={20} color={Colors.primary} />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={[styles.contactValue, styles.link]}>{site?.phone}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactRow} onPress={handleEmail}>
            <Ionicons name="mail-outline" size={20} color={Colors.primary} />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={[styles.contactValue, styles.link]}>{site?.email}</Text>
            </View>
          </TouchableOpacity>

          {/* Map placeholder */}
          <View style={styles.mapPlaceholder}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800' }}
              style={styles.mapImage}
              resizeMode="cover"
            />
            <View style={styles.mapOverlay}>
              <Ionicons name="location" size={32} color={Colors.secondary} />
            </View>
          </View>
        </View>

        {/* Contact Form */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Send a Message</Text>

          <FormInput
            label="Full Name"
            placeholder="Enter your full name"
            value={form.name}
            onChangeText={(v) => { setForm({ ...form, name: v }); setErrors({ ...errors, name: '' }); }}
            icon="person-outline"
            error={errors.name}
          />

          <FormInput
            label="Professional Email"
            placeholder="name@company.com"
            value={form.email}
            onChangeText={(v) => { setForm({ ...form, email: v }); setErrors({ ...errors, email: '' }); }}
            keyboardType="email-address"
            icon="mail-outline"
            error={errors.email}
          />

          <FormInput
            label="Company (Optional)"
            placeholder="Your organization"
            value={form.company}
            onChangeText={(v) => setForm({ ...form, company: v })}
            icon="business-outline"
          />

          <FormInput
            label="Message"
            placeholder="Describe your training or consulting needs..."
            value={form.message}
            onChangeText={(v) => setForm({ ...form, message: v })}
            multiline
            numberOfLines={4}
          />

          <PrimaryButton
            label={submitting ? 'Sending...' : 'Submit Request'}
            onPress={handleSubmit}
            fullWidth
            disabled={submitting}
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
    backgroundColor: Colors.background,
  },
  scroll: {
    padding: Spacing.containerPadding,
  },
  introSection: {
    gap: 8,
    marginBottom: 24,
  },
  headline: {
    ...Typography.displayLgMobile,
    color: Colors.primary,
  },
  subtext: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
  },
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: BorderRadius.xl,
    padding: Spacing.containerPadding,
    marginBottom: 20,
    ...Shadows.sm,
  },
  cardTitle: {
    ...Typography.headlineMd,
    color: Colors.primary,
    fontSize: 20,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceVariant,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  contactText: {
    flex: 1,
  },
  contactLabel: {
    ...Typography.labelMd,
    color: Colors.onSurface,
    marginBottom: 2,
  },
  contactValue: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
  },
  link: {
    color: Colors.secondary,
  },
  mapPlaceholder: {
    height: 140,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginTop: 8,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,20,48,0.2)',
  },
});

export default ContactScreen;
