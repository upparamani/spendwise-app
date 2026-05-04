# SpendWise — APK & IPA Build Guide
## App ID: com.panlabs26.spendwise | Version 1.0.0

---

## FOLDER STRUCTURE (this zip)
```
spendwise-app/
├── www/                  ← The complete web app
│   ├── index.html        ← Full SpendWise v6 (single file)
│   ├── manifest.json     ← PWA manifest
│   ├── sw.js             ← Service worker (offline)
│   ├── icon-192.png      ← App icon
│   └── icon-512.png      ← App icon (large)
├── capacitor.config.ts   ← Capacitor config
├── package.json          ← npm deps
└── BUILD.md              ← This file
```

---

## OPTION A — PWA (Instant, No SDK needed)
**Works on Android right now. No installation needed.**

1. Copy `www/` folder to any web server or open `index.html` directly
2. On Android Chrome: open the URL → Menu (⋮) → **"Add to Home Screen"**
3. On iOS Safari: open the URL → Share → **"Add to Home Screen"**

Result: Full-screen app icon on home screen, works offline, no browser bar.

---

## OPTION B — Android APK (Native .apk)

### Prerequisites (one-time setup)
```bash
# 1. Install Android Studio
#    https://developer.android.com/studio

# 2. Install Java 17+
#    https://adoptium.net

# 3. Install Node.js 18+
#    https://nodejs.org
```

### Build Steps
```bash
# Step 1 — Enter project folder
cd spendwise-app

# Step 2 — Install dependencies
npm install

# Step 3 — Add Android platform
npx cap add android

# Step 4 — Sync web files into Android project
npx cap sync android

# Step 5a — Open in Android Studio (GUI build)
npx cap open android
# Then: Build → Generate Signed Bundle/APK → APK → fill keystore → Build

# Step 5b — OR build debug APK directly (no signing needed for testing)
cd android
./gradlew assembleDebug
# APK output: android/app/build/outputs/apk/debug/app-debug.apk

# Step 5c — Build release APK (signed, for sharing)
./gradlew assembleRelease
# (requires keystore — see signing section below)
```

### Create Keystore (one-time, save this file!)
```bash
keytool -genkey -v \
  -keystore spendwise.keystore \
  -alias spendwise \
  -keyalg RSA -keysize 2048 \
  -validity 10000 \
  -dname "CN=Pandurang Upparamani, OU=PanLabs, O=KLS GIT, L=Belagavi, S=Karnataka, C=IN"
```

### Sign Release APK
```bash
# In android/app/build.gradle, add under android {}:
signingConfigs {
    release {
        storeFile file('../../spendwise.keystore')
        storePassword 'YOUR_PASSWORD'
        keyAlias 'spendwise'
        keyPassword 'YOUR_PASSWORD'
    }
}
buildTypes {
    release { signingConfig signingConfigs.release }
}
```

---

## OPTION C — iOS IPA (Requires Mac + Xcode)

### Prerequisites
- macOS with Xcode 15+ installed
- Apple Developer account (free for testing on your own device, $99/yr for App Store)

### Build Steps
```bash
# Step 1
cd spendwise-app && npm install

# Step 2
npx cap add ios

# Step 3
npx cap sync ios

# Step 4 — Open Xcode
npx cap open ios

# In Xcode:
# → Select your team (Apple ID)
# → Set Bundle ID: com.panlabs26.spendwise
# → Product → Archive → Distribute App
# → Ad Hoc (share with specific devices) or Development (your device only)
```

---

## OPTION D — PWABuilder (Easiest for Store submission)

1. Host `www/` on any HTTPS server (GitHub Pages is free):
   - Push `www/` contents to `gh-pages` branch
   - URL becomes: `https://panlabs26.github.io/spendwise/`

2. Go to **https://www.pwabuilder.com**
3. Enter your URL → Build → Download Android Package or iOS Package
4. Follow PWABuilder's guided store submission

---

## ANDROID APP SETTINGS (already in capacitor.config.ts)
```
App ID:           com.panlabs26.spendwise
App Name:         SpendWise
Min SDK:          Android 7.0 (API 24)
Target SDK:       Android 14 (API 34)
Background:       #0c0c0e (near black)
Accent:           #c8f250 (lime green)
Orientation:      Portrait locked
Internet:         Not required (local storage)
Permissions:      None required
```

---

## QUICK SHARE (no store, no server)

### Share APK directly (WhatsApp/email):
```bash
# After building debug APK:
adb install android/app/build/outputs/apk/debug/app-debug.apk
# Or just share the .apk file — recipient enables "Install unknown apps" in settings
```

### Share via GitHub Pages (free HTTPS hosting):
```bash
cd www/
git init
git add .
git commit -m "SpendWise v6"
git remote add origin https://github.com/panlabs26/spendwise.git
git push -u origin main
# Settings → Pages → Source: main → Save
# Live at: https://panlabs26.github.io/spendwise/
```

---

## VERSION HISTORY
| Version | Date       | Notes                                      |
|---------|------------|--------------------------------------------|
| v6      | 2026-05-03 | Duplicate detection, Manage urgency sort   |
| v5      | 2026-05-03 | Delete everywhere, Important tab fixed     |
| v4      | 2026-05-02 | Live JSON data, Important/Manage/Next      |
| v3      | 2026-05-02 | Salary, Balance, FD Vault                  |
| v1      | 2026-05-01 | Core bill cycle tracker                    |

---

*Built by Claude for Pandurang Upparamani · KLS GIT · Belagavi, Karnataka*
