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

### 2. Build unsigned APK (quick test on your own device)

```bash
flutter build apk --release
```

If you have **not** set up a keystore yet, this still works — the project's
`android/app/build.gradle.kts` falls back to debug signing so the APK installs
on your own phone. (A debug-signed APK is fine for personal testing but
**cannot** be uploaded to the Play Store.)

The file lands at `build/app/outputs/apk/release/app-release.apk`.

### 3. Build a Play Store-ready signed APK / AAB

Your project is **already configured** to sign releases automatically — it reads
the keystore details from `android/key.properties`. There is no CLI flag for
signing; you just create that file once and Gradle does the rest.

**Step 3a — Create a keystore** (one time; keep it safe forever — you need the
same keystore for every future update):

```bash
keytool -genkey -v -keystore ghar-pahuch-seva.jks ^
  -keyalg RSA -keysize 2048 -validity 10000 ^
  -alias ghar-pahuch-seva
```

(On macOS/Linux replace the `^` line-continuations with `\`.)

It will ask for a password and your name/org details. Remember the password.
Move the `.jks` file somewhere safe, e.g. `mobile/android/app/ghar-pahuch-seva.jks`.

**Step 3b — Create `android/key.properties`** (this file is git-ignored, so it
never gets committed):

```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=ghar-pahuch-seva
storeFile=ghar-pahuch-seva.jks
```

> `storeFile` is relative to `android/app/`. If you put the `.jks` elsewhere,
> use an absolute path like `C:/Users/shanu/keys/ghar-pahuch-seva.jks`.

**Step 3c — Build.** With `key.properties` present, the same commands now
produce **signed** artifacts automatically:

```bash
flutter build apk --release        # signed APK
flutter build appbundle --release  # signed AAB (preferred for Play Store)
```

Outputs:
- **APK:** `build/app/outputs/apk/release/app-release.apk`
- **AAB:** `build/app/outputs/bundle/release/app-release.aab`

Google Play requires the **AAB** for new apps, so build the appbundle for
submission. The APK is handy for sideloading/testing.

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
| `Keystore not found` / signing error | Make sure `android/key.properties` paths/passwords are correct. To skip signing entirely, just delete `key.properties` — the build falls back to debug signing |
| `--sign-android` not recognized | That flag does not exist. Signing is automatic via `key.properties` (see step 3) |

## What's New in This Build

- ✅ Ghar Pahuch Seva branding (name, logo, splash, colors)
- ✅ Clash Display font globally applied
- ✅ Delete account feature (Profile → Delete my account)
- ✅ Material 3 design with adaptive icons
- ✅ Offline-first + backend sync when configured
