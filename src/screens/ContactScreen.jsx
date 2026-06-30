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

  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim())    newErrors.name    = 'Name is required';
    if (!form.email.trim())   newErrors.email   = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email address';
    if (!form.phone.trim())   newErrors.phone   = 'Phone is required';
    if (!form.subject.trim()) newErrors.subject = 'Subject is required';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);

    // ── EmailJS credentials (same account as course registration) ────────────
    const EMAILJS_SERVICE_ID  = process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID;
    const EMAILJS_TEMPLATE_ID = process.env.EXPO_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID;
    const EMAILJS_PUBLIC_KEY  = process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY;
    const EMAILJS_PRIVATE_KEY = process.env.EXPO_PUBLIC_EMAILJS_PRIVATE_KEY;
    // ────────────────────────────────────────────────────────────────────────

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
            subject:   form.subject,
            name:     form.name,
            email:    form.email,
            phone:    form.phone,
            message:  form.message,
          },
        }),
      });

      if (response.ok) {
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
        setErrors({});
        Alert.alert('Message Sent!', 'Our team will get back to you within 24 hours.', [{ text: 'OK' }]);
      } else {
        const text = await response.text();
        throw new Error(text);
      }
    } catch (error) {
      Alert.alert('Failed to Send', 'Could not send your message. Please try again or contact us via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const LAT = 31.2215199;
  const LNG = 29.9439699;
  const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}`;
  const STATIC_MAP_URL =
    `https://maps.googleapis.com/maps/api/staticmap?center=${LAT},${LNG}&zoom=16&size=600x300&maptype=roadmap` +
    `&markers=color:red%7C${LAT},${LNG}&key=YOUR_GOOGLE_MAPS_KEY`;

  const handleOpenMaps = () => {
    Linking.openURL(MAPS_URL).catch(() =>
      Alert.alert('Error', 'Could not open Maps.')
    );
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

          <TouchableOpacity style={styles.contactRow} onPress={handleOpenMaps}>
            <Ionicons name="location-outline" size={20} color={Colors.primary} />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Office Address</Text>
              <Text style={[styles.contactValue, styles.link]}>{site?.address || 'Abou Quer, Sidi Gaber, Alexandria'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
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

          {/* Interactive Map */}
          <TouchableOpacity style={styles.mapContainer} onPress={handleOpenMaps} activeOpacity={0.9}>
            <Image
              source={{ uri: `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-l+C62828(${LNG},${LAT})/${LNG},${LAT},15,0/600x300@2x?access_token=${process.env.EXPO_PUBLIC_MAPBOX_TOKEN}` }}
              style={styles.mapImage}
              resizeMode="cover"
            />
            <View style={styles.mapOverlay}>
              <View style={styles.mapPin}>
                <Ionicons name="location" size={28} color="#C62828" />
              </View>
            </View>
            <View style={styles.mapDirectionsBar}>
              <Ionicons name="navigate-outline" size={16} color="#fff" />
              <Text style={styles.mapDirectionsText}>Tap to Get Directions</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Contact Form */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Send a Message</Text>

          <FormInput
            label="Full Name *"
            placeholder="Enter your full name"
            value={form.name}
            onChangeText={(v) => { setForm({ ...form, name: v }); setErrors({ ...errors, name: '' }); }}
            icon="person-outline"
            error={errors.name}
          />

          <FormInput
            label="Email *"
            placeholder="name@company.com"
            value={form.email}
            onChangeText={(v) => { setForm({ ...form, email: v }); setErrors({ ...errors, email: '' }); }}
            keyboardType="email-address"
            icon="mail-outline"
            error={errors.email}
          />

          <FormInput
            label="Phone *"
            placeholder="+1 234 567 8900"
            value={form.phone}
            onChangeText={(v) => { setForm({ ...form, phone: v }); setErrors({ ...errors, phone: '' }); }}
            keyboardType="phone-pad"
            icon="call-outline"
            error={errors.phone}
          />

          <FormInput
            label="Subject *"
            placeholder="e.g. Course Inquiry, General Question..."
            value={form.subject}
            onChangeText={(v) => { setForm({ ...form, subject: v }); setErrors({ ...errors, subject: '' }); }}
            icon="create-outline"
            error={errors.subject}
          />

          <FormInput
            label="Message *"
            placeholder="Describe your training or consulting needs..."
            value={form.message}
            onChangeText={(v) => { setForm({ ...form, message: v }); setErrors({ ...errors, message: '' }); }}
            multiline
            numberOfLines={4}
            error={errors.message}
          />

          <PrimaryButton
            label={submitting ? 'Sending...' : 'Send Message'}
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
  mapContainer: {
    height: 180,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginTop: 8,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPin: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  mapDirectionsBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,20,48,0.75)',
    paddingVertical: 10,
  },
  mapDirectionsText: {
    ...Typography.labelMd,
    color: '#fff',
    fontSize: 13,
  },
});

export default ContactScreen;
