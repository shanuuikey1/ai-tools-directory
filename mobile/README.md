# Urban Services — Flutter App

A modern, production-style mobile app for the Urban Services marketplace
(book trusted home services in Chhindwara). Built with **Flutter** (Material 3).

## ✨ Features

- Branded launcher icon + native splash, animated in-app splash and onboarding
- Home with location header, search, promo banner, category grid and
  "most popular" services
- Browse by category and full-text service search
- Rich service detail screen with ratings, inclusions and a sticky price bar
- Booking flow: pick date, time and address → confirmation
- My Bookings tab: status chips, cancel, mark-done and star ratings
- Login / Sign-up with polished profile screen
- **Backend integration**: when a server URL is set (Profile → Server Settings),
  sign-up/login hit the Node/Express API and bookings sync to the database.
  With no URL it runs fully offline with a sample catalogue.

## 🧱 Project structure

```
lib/
├── main.dart                 # App entry + theme wiring
├── theme.dart                # Colors, Material 3 theme, shadows
├── models.dart               # ServiceItem, Booking, AppUser, ...
├── sample_data.dart          # Categories + demo service catalogue
├── app_state.dart            # State + persistence + API/offline switch
├── api_service.dart          # REST client + configurable base URL
├── widgets/
│   └── service_list_tile.dart
└── screens/
    ├── splash_screen.dart      onboarding_screen.dart   auth_screen.dart
    ├── main_shell.dart         home_screen.dart         category_screen.dart
    ├── search_screen.dart      service_detail_screen.dart
    ├── bookings_screen.dart    profile_screen.dart      server_settings_screen.dart
```

## 🚀 Run locally

```bash
cd mobile
flutter pub get
flutter run
```

## 📦 Build

```bash
flutter build apk --release        # build/app/outputs/flutter-apk/app-release.apk
flutter build appbundle --release  # build/app/outputs/bundle/release/app-release.aab (Play Store)
```

## 🔐 Release signing

Signing is configured via `android/key.properties` (kept out of git).
Copy `android/key.properties.example` to `android/key.properties` and point it
at your keystore. Without it, release builds fall back to debug keys.

To create a keystore:

```bash
keytool -genkeypair -v -keystore upload-keystore.jks -keyalg RSA \
  -keysize 2048 -validity 10000 -alias upload
```

## 🔌 Connecting to the backend

Open the app → **Profile → Server Settings** and paste your API base URL, e.g.
`https://my-urban-api.herokuapp.com/api`, then **Test connection** and **Save**.
The backend lives in `../backend`.

## 🎨 Design

- Material 3 with an indigo (`#4F46E5`) → violet brand gradient
- Rounded 16–20px cards with soft shadows, cyan accent, status colors
- Phone-friendly light theme

Requires Flutter 3.44+ (Dart 3.12+).
