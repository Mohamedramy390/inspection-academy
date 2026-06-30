import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Share,
  ActivityIndicator,
  TextInput,
  Linking,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { ROUTES } from '../constants/routes';
import { AccordionItem, PrimaryButton, TrainingEventCard } from '../components';
import useContent from '../hooks/useContent';

const StatBadge = ({ icon, label, value }) => (
  <View style={styles.statBadge}>
    <Ionicons name={icon} size={28} color={Colors.primary} />
    <Text style={styles.statLabel}>{label.toUpperCase()}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const CourseDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { courseId } = route.params;

  const scrollViewRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    company: '',
    comment: ''
  });

  const { data: courses, loading } = useContent('courses');
  const { data: site } = useContent('site');
  const course = courses?.find((c) => c.id === courseId);

  const handleShare = async () => {
    if (!course) return;
    await Share.share({
      message: `Check out this course: ${course.title} — Inspection Academy`,
    });
  };

  const WA_NUMBER = process.env.EXPO_PUBLIC_WA_NUMBER || '201023467096';

  const openWhatsApp = (message) => {
    const url = `whatsapp://send?phone=${WA_NUMBER}&text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`).catch(() => {
        Alert.alert('Error', 'Make sure WhatsApp is installed on your device.');
      });
    });
  };

  const handleWhatsApp = () => {
    const message =
      `Hello Inspection Academy! 👋\n\n` +
      `I'm interested in the following course:\n` +
      `📚 *${course?.title || courseId}*\n\n` +
      `Please send me more details about dates, fees, and registration.\n\n` +
      `Thank you!`;
    openWhatsApp(message);
  };

  const handleQuickInquiry = () => {
    const message =
      `Hello Inspection Academy! 👋\n\n` +
      `I have a quick inquiry about:\n` +
      `📚 *${course?.title || courseId}*\n\n` +
      `Could you please assist me?`;
    openWhatsApp(message);
  };

  const handleRegisterNowClick = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone || !form.country || !form.comment) {
      Alert.alert('Required Fields', 'Please fill in all required fields marked with *');
      return;
    }
    
    setIsSubmitting(true);
    
    // ── EmailJS credentials ──────────────────────────────────────────────────
    const EMAILJS_SERVICE_ID  = process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID;
    const EMAILJS_TEMPLATE_ID = process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID;
    const EMAILJS_PUBLIC_KEY  = process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY;
    const EMAILJS_PRIVATE_KEY = process.env.EXPO_PUBLIC_EMAILJS_PRIVATE_KEY;
    // ────────────────────────────────────────────────────────────────────────

    try {
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id:  EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id:     EMAILJS_PUBLIC_KEY,
          accessToken: EMAILJS_PRIVATE_KEY,
          template_params: {
            course:   course?.title || courseId,
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
        Alert.alert('Success', 'Your registration has been sent successfully! We will contact you soon.');
        setForm({ name: '', email: '', phone: '', country: '', company: '', comment: '' });
      } else {
        const text = await response.text();
        throw new Error(text);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send your request. Please check your EmailJS credentials in the code or try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
        <Text style={styles.errorText}>Course not found</Text>
        <PrimaryButton label="Go Back" onPress={() => navigation.goBack()} style={{ marginTop: 16 }} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Custom Header */}
      <View style={[styles.header, { paddingTop: insets.top || 16 }]}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{course.id?.toUpperCase()}</Text>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={handleShare}
          accessibilityLabel="Share course"
        >
          <Ionicons name="share-social-outline" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 160 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <ImageBackground
          source={{ uri: course.image }}
          style={styles.heroImage}
        >
          <View style={styles.heroGradient} />
        </ImageBackground>

        {/* Intro */}
        <View style={styles.introSection}>
          <View style={styles.certBadge}>
            <Ionicons name="ribbon-outline" size={14} color={Colors.onPrimaryContainer} />
            <Text style={styles.certBadgeText}>{course.badge}</Text>
          </View>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.courseDescription}>{course.fullDescription}</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatBadge icon="speedometer-outline" label="Level" value={course.level} />
          <View style={styles.statDivider} />
          <StatBadge icon="laptop-outline" label="Type" value={course.type} />
          <View style={styles.statDivider} />
          <StatBadge icon="calendar-outline" label="Duration" value={course.daysCount} />
        </View>

        {/* Accordion Sections */}
        <View style={styles.accordionSection}>
          <AccordionItem title="Course Objectives">
            <Text style={styles.accordionText}>{course.objectives}</Text>
          </AccordionItem>

          <AccordionItem title="Required Materials">
            {course.materials?.map((mat, i) => (
              <View key={i} style={styles.bulletRow}>
                <Ionicons name="checkmark-circle-outline" size={16} color={Colors.secondary} />
                <Text style={styles.bulletText}>{mat}</Text>
              </View>
            ))}
          </AccordionItem>

          <AccordionItem title="Agenda Overview">
            {course.agenda?.map((item, i) => (
              <View key={i} style={styles.agendaRow}>
                <Text style={styles.agendaDay}>{item.day}</Text>
                <Text style={styles.agendaTopic}>{item.topic}</Text>
              </View>
            ))}
          </AccordionItem>
        </View>

        {/* ── Upcoming Trainings ── */}
        {course.trainings?.length > 0 && (
          <View style={styles.trainingsSection}>
            <Text style={styles.trainingsTitle}>Upcoming Trainings</Text>
            {course.trainings.map((training, idx) => (
              <TrainingEventCard
                key={idx}
                event={{ ...training, courseId: course.id }}
                course={course}
                onPress={() => navigation.navigate(ROUTES.CONTACT)}
              />
            ))}
          </View>
        )}

        {/* ── Registration Form ── */}
        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Register for this Course</Text>
          <Text style={styles.formSubtitle}>Fill out the form below and we will contact you shortly.</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Name *"
            placeholderTextColor={Colors.onSurfaceVariant}
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Email *"
            keyboardType="email-address"
            placeholderTextColor={Colors.onSurfaceVariant}
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone (WhatsApp) *"
            keyboardType="phone-pad"
            placeholderTextColor={Colors.onSurfaceVariant}
            value={form.phone}
            onChangeText={(text) => setForm({ ...form, phone: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Country *"
            placeholderTextColor={Colors.onSurfaceVariant}
            value={form.country}
            onChangeText={(text) => setForm({ ...form, country: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Company"
            placeholderTextColor={Colors.onSurfaceVariant}
            value={form.company}
            onChangeText={(text) => setForm({ ...form, company: text })}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Comment or Message *"
            placeholderTextColor={Colors.onSurfaceVariant}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={form.comment}
            onChangeText={(text) => setForm({ ...form, comment: text })}
          />
          <PrimaryButton
            label={isSubmitting ? "Sending..." : "Submit Registration"}
            onPress={handleSubmit}
            style={styles.submitBtn}
            disabled={isSubmitting}
          />

          {/* Quick Inquiry via WhatsApp */}
          <TouchableOpacity style={styles.quickInquiryBtn} onPress={handleQuickInquiry}>
            <Ionicons name="logo-whatsapp" size={18} color="#2E7D32" />
            <Text style={styles.quickInquiryText}>Quick Inquiry via WhatsApp</Text>
            <Ionicons name="arrow-forward" size={14} color="#2E7D32" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.cta, { paddingBottom: insets.bottom + 8 }]}>
        <PrimaryButton
          label="WhatsApp"
          variant="tonal"
          onPress={handleWhatsApp}
          style={[styles.ctaBtn, { backgroundColor: '#E8F5E9' }]}
          icon={<Ionicons name="logo-whatsapp" size={16} color="#2E7D32" />}
          textStyle={{ color: '#2E7D32' }}
        />
        <PrimaryButton
          label="Register Now"
          variant="filled"
          onPress={handleRegisterNowClick}
          style={styles.ctaBtn}
          icon={<Ionicons name="arrow-down" size={16} color={Colors.onPrimary} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    ...Typography.bodyLg,
    color: Colors.onSurfaceVariant,
  },
  // Custom header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    ...Typography.headlineMd,
    fontSize: 18,
    color: Colors.primary,
    flex: 1,
    textAlign: 'center',
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
  },
  // Hero
  heroImage: {
    height: 220,
    justifyContent: 'flex-end',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    background: 'linear-gradient(transparent, rgba(251,249,248,0.9))',
    backgroundColor: 'rgba(251,249,248,0.3)',
  },
  // Intro
  introSection: {
    paddingHorizontal: Spacing.containerPadding,
    paddingTop: 20,
    paddingBottom: 8,
    gap: 10,
  },
  certBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryContainer,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  certBadgeText: {
    ...Typography.labelSm,
    color: Colors.onPrimaryContainer,
  },
  courseTitle: {
    ...Typography.displayLgMobile,
    color: Colors.onSurface,
    lineHeight: 38,
  },
  courseDescription: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
  },
  // Stats
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.containerPadding,
    marginTop: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceContainerLowest,
    ...Shadows.sm,
    overflow: 'hidden',
  },
  statBadge: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    gap: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.outlineVariant,
    marginVertical: 12,
  },
  statLabel: {
    ...Typography.labelSm,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1,
    fontSize: 10,
  },
  statValue: {
    ...Typography.labelMd,
    color: Colors.onSurface,
    fontSize: 12,
    textAlign: 'center',
  },
  // Accordion
  accordionSection: {
    paddingHorizontal: Spacing.containerPadding,
    paddingTop: 16,
  },
  // Upcoming Trainings
  trainingsSection: {
    paddingHorizontal: Spacing.containerPadding,
    paddingTop: 8,
    paddingBottom: 8,
  },
  trainingsTitle: {
    ...Typography.headlineMd,
    color: Colors.primary,
    marginBottom: 14,
    fontSize: 18,
  },
  accordionText: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    lineHeight: 24,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  bulletText: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    flex: 1,
  },
  agendaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  agendaDay: {
    ...Typography.labelMd,
    color: Colors.primary,
    width: 70,
    fontWeight: '600',
  },
  agendaTopic: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    flex: 1,
  },
  // CTA
  cta: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: Spacing.containerPadding,
    paddingTop: 16,
    backgroundColor: Colors.surfaceContainerLowest,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
    ...Shadows.md,
  },
  ctaBtn: {
    flex: 1,
  },
  // Form
  formSection: {
    paddingHorizontal: Spacing.containerPadding,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: Colors.surfaceContainerLowest,
    marginTop: 16,
    marginHorizontal: Spacing.containerPadding,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    ...Shadows.sm,
  },
  formTitle: {
    ...Typography.headlineMd,
    color: Colors.primary,
    marginBottom: 4,
    fontSize: 20,
  },
  formSubtitle: {
    ...Typography.bodyMd,
    color: Colors.onSurfaceVariant,
    marginBottom: 20,
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
  submitBtn: {
    marginTop: 8,
  },
  quickInquiryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: '#2E7D32',
    backgroundColor: '#F1F8E9',
  },
  quickInquiryText: {
    ...Typography.labelMd,
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CourseDetailsScreen;
