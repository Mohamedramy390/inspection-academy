# Inspection Academy — React Native App

A fully-featured mobile app for Inspection Academy built with Expo (React Native), Decap CMS, and Firebase Push Notifications.

## 🗂 Project Structure

```
IA-app/
├── App.js                          # Entry point — fonts, navigation, Firebase init
├── app.json                        # Expo config (plugins, Firebase, permissions)
├── google-services.json            # 🔴 Add yours from Firebase Console
│
├── src/
│   ├── constants/
│   │   ├── theme.js                # Design tokens (colors, typography, spacing)
│   │   ├── routes.js               # Route name constants
│   │   └── index.js                # Barrel export
│   │
│   ├── components/                 # Reusable UI components
│   │   ├── TopAppBar.jsx           # Shared header (back/menu + right action)
│   │   ├── CourseCard.jsx          # Card for courses list
│   │   ├── TrainingEventCard.jsx   # Upcoming event card on Home
│   │   ├── ServiceCard.jsx         # 2-col grid service card
│   │   ├── AccordionItem.jsx       # Animated expand/collapse section
│   │   ├── PrimaryButton.jsx       # filled / outlined / tonal CTA button
│   │   ├── FormInput.jsx           # Labeled input with icon & error state
│   │   └── index.js                # Barrel export
│   │
│   ├── screens/
│   │   ├── HomeScreen.jsx          # Hero, upcoming events, service grid
│   │   ├── CoursesScreen.jsx       # Searchable + filterable course list
│   │   ├── CourseDetailsScreen.jsx # Accordion details + register CTA
│   │   ├── ConsultationScreen.jsx  # Service cards + quote CTA
│   │   ├── AboutScreen.jsx         # Stats, mission, vision
│   │   └── ContactScreen.jsx       # Validated form + HQ details
│   │
│   ├── navigation/
│   │   └── AppNavigator.jsx        # Bottom tab + nested courses stack
│   │
│   ├── hooks/
│   │   └── useContent.js           # CMS data hook (local JSON → remote API)
│   │
│   └── services/
│       └── notificationService.js  # Firebase/Expo push notification helpers
│
└── cms/
    ├── admin/
    │   ├── index.html              # Decap CMS admin entry point
    │   └── config.yml              # CMS schema — collections & fields
    ├── content/
    │   └── data.json               # All app content (single source of truth)
    └── media/                      # CMS-uploaded images
```

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start the dev server
```bash
npx expo start
```

Scan the QR with the **Expo Go** app on your phone, or press:
- `a` — open on Android emulator
- `i` — open on iOS simulator

## 🔥 Firebase Push Notifications Setup

1. Go to [Firebase Console](https://console.firebase.google.com) → Create project
2. Add an **Android app** → download `google-services.json` → place in project root
3. Add an **iOS app** → download `GoogleService-Info.plist` → place in project root
4. Update `app.json`:
   - Set `extra.eas.projectId` from your EAS dashboard (`npx eas init`)
5. Build with EAS for real push support:
   ```bash
   npx eas build --profile development --platform android
   ```
6. In `notificationService.js`, uncomment the `saveTokenToFirestore` call and implement it to store tokens in Firestore.

### Firebase Cloud Messaging (FCM) Flow
```
User device → getExpoPushToken() → Your server → FCM → User device
```

## 📝 Decap CMS Setup

1. **Push to GitHub** (required for git-based CMS)
2. **Create a Netlify site** connected to the repo
3. In Netlify dashboard:
   - Enable **Identity** (`Site Settings → Identity → Enable`)  
   - Enable **Git Gateway** (`Identity → Services → Git Gateway`)
4. Visit `yoursite.netlify.app/admin` to log in and edit content
5. Content changes trigger a GitHub commit → your app reads the updated `cms/content/data.json`

### Local CMS Development
```bash
# Terminal 1 — CMS proxy (bypass Git auth locally)
npx netlify-cms-proxy-server

# Terminal 2 — serve the admin panel
npx serve cms/
```
Then visit `http://localhost:3000/admin`

## 🎨 Design System

All tokens live in `src/constants/theme.js`:
- **Colors** — full Material Design 3 color palette
- **Typography** — Hanken Grotesk type scale
- **Spacing** — 8px base grid
- **BorderRadius / Shadows** — consistent elevation

## 📦 Key Dependencies

| Package | Purpose |
|---|---|
| `expo` | React Native runtime |
| `@react-navigation/native` | Navigation |
| `@react-navigation/bottom-tabs` | Tab bar |
| `@react-navigation/native-stack` | Stack navigator |
| `expo-notifications` | Push notifications |
| `expo-device` | Physical device detection |
| `@expo-google-fonts/hanken-grotesk` | Custom typography |
| `react-native-safe-area-context` | Safe area insets |
| `react-native-gesture-handler` | Gesture support |
| `decap-cms` | Git-based CMS (served separately) |
