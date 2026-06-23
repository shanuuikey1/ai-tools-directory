# Building the Ghar Pahuch Seva APK Locally

The Flutter APK must be built on your machine where Flutter and Android SDK are installed.

## Prerequisites

- Flutter SDK (3.12.2 or later) installed and on your PATH
- Android SDK (API level 24+)
- Java Development Kit (JDK 11+)
- A code editor or terminal

## Before You Build

The code has been updated with the delete-account feature and Clash Display font. Pull the latest changes:

```bash
git pull origin claude/urban-company-chhindwara-ywd8k9
cd mobile
```

## Build Steps

### 1. Install dependencies
```bash
flutter pub get
```

### 2. Build unsigned APK (for testing / Google Play internal testing)
```bash
flutter build apk --release
```

This creates `build/app/outputs/apk/release/app-release.apk`.

### 3. Build signed APK (for Play Store release)

If you have your keystore from before:

```bash
flutter build apk --release \
  --sign-android \
  --android-gradle-log-output
```

When prompted, provide your keystore path and password (you set these up during the initial setup).

Or, if you lost the keystore, create a new one:

```bash
keytool -genkey -v -keystore ~/ghar-pahuch-seva.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias ghar-pahuch-seva-key
```

Then set the build.gradle signing config:

```gradle
signingConfigs {
  release {
    keystore file("/path/to/ghar-pahuch-seva.jks")
    keystorePassword "YOUR_PASSWORD"
    keyAlias "ghar-pahuch-seva-key"
    keyPassword "YOUR_PASSWORD"
  }
}
buildTypes {
  release {
    signingConfig signingConfigs.release
  }
}
```

Then build:

```bash
flutter build apk --release
```

### 4. Build AAB (App Bundle) for Google Play

```bash
flutter build appbundle --release
```

This creates `build/app/outputs/bundle/release/app-release.aab`.

## After Build

The APK/AAB will be at:
- **APK:** `build/app/outputs/apk/release/app-release.apk`
- **AAB:** `build/app/outputs/bundle/release/app-release.aab`

### Upload to GitHub (optional, for backup/sharing)

1. Replace the old files:
   ```bash
   rm apk/UrbanServices.*
   cp build/app/outputs/apk/release/app-release.apk apk/GharPahuchSeva.apk
   cp build/app/outputs/bundle/release/app-release.aab apk/GharPahuchSeva.aab
   ```

2. Commit and push:
   ```bash
   git add apk/GharPahuchSeva.*
   git commit -m "Update APK/AAB with delete-account feature and Clash Display font"
   git push origin claude/urban-company-chhindwara-ywd8k9
   ```

## Testing Before Upload

On an Android device or emulator:

```bash
flutter install  # installs the built APK to the connected device
```

Or, test on an emulator:

```bash
flutter emulators  # list available emulators
flutter emulators launch <name>  # start one
flutter run --release  # run the app
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Flutter command not found` | Add Flutter to PATH: `export PATH="$PATH:~/flutter/bin"` |
| `Android SDK not found` | Set `ANDROID_SDK_ROOT` env var: `export ANDROID_SDK_ROOT=~/Android/Sdk` |
| `Gradle build failed` | Run `flutter clean && flutter pub get` then retry |
| `Keystore not found` | Create a new keystore as shown above, or use `--no-sign` for testing |

## What's New in This Build

- ✅ Ghar Pahuch Seva branding (name, logo, splash, colors)
- ✅ Clash Display font globally applied
- ✅ Delete account feature (Profile → Delete my account)
- ✅ Material 3 design with adaptive icons
- ✅ Offline-first + backend sync when configured
