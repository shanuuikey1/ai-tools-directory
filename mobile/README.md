# Urban Services — Flutter App

A modern, production-style mobile app for the Urban Services marketplace
(book trusted home services in Chhindwara). Built with **Flutter** (Material 3).

## ✨ Features

- Animated splash + 3-screen onboarding
- Home with location header, search, promo banner, category grid and
  "most popular" services
- Browse by category and full-text service search
- Rich service detail screen with ratings, inclusions and a sticky price bar
- Booking flow: pick date, time and address → confirmation
- My Bookings tab: status chips, cancel, mark-done and star ratings
- Login / Sign-up (stored locally) and a polished profile screen
- Local persistence with `shared_preferences` — works fully offline

The app ships with a sample service catalogue so it is immediately usable
without a backend. It can later be wired to the Node/Express API in `../backend`.

## 🧱 Project structure

```
lib/
├── main.dart                 # App entry + theme wiring
├── theme.dart                # Colors, Material 3 theme, shadows
├── models.dart               # ServiceItem, Booking, AppUser, ...
├── sample_data.dart          # Categories + demo service catalogue
├── app_state.dart            # ChangeNotifier state + persistence
├── widgets/
│   └── service_list_tile.dart
└── screens/
    ├── splash_screen.dart
    ├── onboarding_screen.dart
    ├── auth_screen.dart
    ├── main_shell.dart        # Bottom navigation
    ├── home_screen.dart
    ├── category_screen.dart
    ├── search_screen.dart
    ├── service_detail_screen.dart
    ├── bookings_screen.dart
    └── profile_screen.dart
```

## 🚀 Run locally

```bash
cd mobile
flutter pub get
flutter run            # on a connected device / emulator
```

## 📦 Build the APK

```bash
flutter build apk --release
# output: build/app/outputs/flutter-apk/app-release.apk
```

Install on a phone by copying the APK and opening it (enable
"Install from unknown sources").

## 🎨 Design

- Material 3 with an indigo (`#4F46E5`) → violet brand gradient
- Rounded 16–20px cards with soft shadows
- Cyan accent, status colors for booking states
- Phone-friendly light theme

Requires Flutter 3.44+ (Dart 3.12+).
