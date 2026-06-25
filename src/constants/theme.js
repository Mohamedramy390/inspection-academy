/**
 * Design tokens for Inspection Academy
 * Mirrors the original Tailwind color palette and typography
 */

export const Colors = {
  // Primary palette
  primary: '#001430',
  primaryContainer: '#002855',
  primaryFixed: '#d6e3ff',
  primaryFixedDim: '#aac7fd',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#7490c3',
  onPrimaryFixed: '#001b3d',
  onPrimaryFixedVariant: '#284775',
  inversePrimary: '#aac7fd',

  // Secondary palette
  secondary: '#ad3300',
  secondaryContainer: '#ff642d',
  secondaryFixed: '#ffdbd0',
  secondaryFixedDim: '#ffb59e',
  onSecondary: '#ffffff',
  onSecondaryContainer: '#5a1600',
  onSecondaryFixed: '#3a0b00',
  onSecondaryFixedVariant: '#842500',

  // Tertiary palette
  tertiary: '#121516',
  tertiaryContainer: '#26292a',
  tertiaryFixed: '#e1e3e4',
  tertiaryFixedDim: '#c5c7c8',
  onTertiary: '#ffffff',
  onTertiaryContainer: '#8e9091',
  onTertiaryFixed: '#191c1d',
  onTertiaryFixedVariant: '#454748',

  // Surface palette
  surface: '#fbf9f8',
  surfaceDim: '#dbd9d9',
  surfaceBright: '#fbf9f8',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f5f3f3',
  surfaceContainer: '#efeded',
  surfaceContainerHigh: '#eae8e7',
  surfaceContainerHighest: '#e4e2e2',
  surfaceVariant: '#e4e2e2',
  surfaceTint: '#415f8f',
  onSurface: '#1b1c1c',
  onSurfaceVariant: '#43474f',

  // Utility
  background: '#fbf9f8',
  onBackground: '#1b1c1c',
  outline: '#747780',
  outlineVariant: '#c4c6d0',
  inverseSurface: '#303030',
  inverseOnSurface: '#f2f0f0',

  // Error
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onError: '#ffffff',
  onErrorContainer: '#93000a',
};

export const Typography = {
  displayLg: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: '700',
    letterSpacing: -0.02 * 48,
    fontFamily: 'HankenGrotesk_700Bold',
  },
  displayLgMobile: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    fontFamily: 'HankenGrotesk_700Bold',
  },
  headlineLg: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '600',
    fontFamily: 'HankenGrotesk_600SemiBold',
  },
  headlineMd: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
    fontFamily: 'HankenGrotesk_600SemiBold',
  },
  bodyLg: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400',
    fontFamily: 'HankenGrotesk_400Regular',
  },
  bodyMd: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    fontFamily: 'HankenGrotesk_400Regular',
  },
  labelMd: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: 0.01 * 14,
    fontFamily: 'HankenGrotesk_500Medium',
  },
  labelSm: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    fontFamily: 'HankenGrotesk_600SemiBold',
  },
};

export const Spacing = {
  base: 8,
  containerPadding: 24,
  gutter: 24,
  sectionGapMobile: 48,
  sectionGapDesktop: 80,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
};
