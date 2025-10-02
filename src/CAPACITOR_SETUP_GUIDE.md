# SportXcel Capacitor Mobile App Setup Guide

## Overview
This guide will help you convert your SportXcel React web app into native iOS and Android mobile applications using Capacitor.

## Prerequisites

### Development Environment
- **Node.js 18+** (Latest LTS recommended)
- **npm** or **yarn** package manager

### For iOS Development
- **macOS** (required for iOS development)
- **Xcode 14+** from the Mac App Store
- **iOS Simulator** (included with Xcode)
- **Apple Developer Account** (for device testing and App Store distribution)

### For Android Development
- **Android Studio** (any OS)
- **Android SDK** and **SDK Tools**
- **Java 17** (JDK 17)
- **Android Virtual Device (AVD)** for testing

## Installation Steps

### 1. Install Dependencies

First, install all the required Capacitor dependencies:

```bash
# Install Capacitor CLI globally
npm install -g @capacitor/cli

# Install project dependencies
npm install

# Install iOS PWA Elements (for camera functionality)
npm install @ionic/pwa-elements
```

### 2. Build the Web App

Build your React app for production:

```bash
npm run build
```

### 3. Initialize Capacitor

```bash
# Initialize Capacitor (if not already done)
npx cap init SportXcel com.sportxcel.app

# Add iOS and Android platforms
npx cap add ios
npx cap add android

# Sync web assets to native projects
npx cap sync
```

### 4. Android Setup

#### Install Android Studio
1. Download and install [Android Studio](https://developer.android.com/studio)
2. Open Android Studio and follow the setup wizard
3. Install the latest Android SDK (API level 33+)

#### Configure Environment Variables
Add these to your shell profile (`~/.bash_profile`, `~/.zshrc`, etc.):

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

#### Create Virtual Device
1. Open Android Studio
2. Go to Tools → AVD Manager
3. Create a new Virtual Device (Pixel 6 or similar)
4. Choose API level 33+ system image
5. Finish setup and start the emulator

#### Run Android App
```bash
# Open Android project in Android Studio
npx cap open android

# Or run directly
npx cap run android
```

### 5. iOS Setup (macOS only)

#### Install Xcode
1. Install Xcode from the Mac App Store
2. Open Xcode and accept license agreements
3. Install additional components when prompted

#### Install Command Line Tools
```bash
xcode-select --install
```

#### Configure Development Team
1. Open Xcode
2. Go to Preferences → Accounts
3. Add your Apple ID
4. Download certificates and provisioning profiles

#### Run iOS App
```bash
# Open iOS project in Xcode
npx cap open ios

# Or run directly (requires physical device or simulator)
npx cap run ios
```

## Development Workflow

### Making Changes
After making changes to your React code:

```bash
# 1. Build the web app
npm run build

# 2. Sync changes to native projects
npx cap sync

# 3. Run on device/emulator
npx cap run android
# or
npx cap run ios
```

### Quick Development Commands
```bash
# Build and run on Android
npm run cap:build:android

# Build and run on iOS
npm run cap:build:ios

# Mobile development with auto-sync
npm run mobile:dev
```

## Camera Permissions

The app automatically handles camera permissions for both platforms:

### Android
- Permissions are declared in `android/app/src/main/AndroidManifest.xml`
- Runtime permissions are requested when camera is first accessed

### iOS
- Permissions are declared in `ios/App/App/Info.plist`
- User consent dialog appears when camera is first accessed

## Key Features Enabled

### Mobile-Optimized Video Capture
- Native camera access through Capacitor Camera plugin
- Video recording with MediaRecorder API (web) or native recording (mobile)
- File upload from device gallery
- Responsive mobile UI with touch-friendly controls

### Performance Optimizations
- Local video analysis for faster processing
- Background upload to Supabase server
- Optimized chunk-based video handling
- Efficient memory management

### Native Device Features
- Status bar customization
- Splash screen
- Push notifications support
- Device-specific optimizations

## Troubleshooting

### Common Android Issues

#### Gradle Build Errors
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npx cap sync android
```

#### Permission Errors
- Check AndroidManifest.xml permissions
- Ensure target SDK version is appropriate
- Test on different API levels

### Common iOS Issues

#### Code Signing Errors
1. Open project in Xcode
2. Select your app target
3. Go to Signing & Capabilities
4. Select your development team
5. Let Xcode automatically manage signing

#### Simulator Issues
```bash
# Reset iOS simulator
npx cap run ios --reset
```

### General Issues

#### Camera Not Working
1. Check permissions in device settings
2. Ensure HTTPS (required for camera API)
3. Test on physical device (camera may not work in all simulators)

#### Build Errors
```bash
# Reset everything
rm -rf node_modules
rm -rf android
rm -rf ios
npm install
npx cap add android
npx cap add ios
npx cap sync
```

## Production Build

### Android APK/AAB
1. Open Android Studio
2. Build → Generate Signed Bundle/APK
3. Follow the signing wizard
4. Choose release variant

### iOS App Store
1. Open Xcode
2. Select "Any iOS Device" target
3. Product → Archive
4. Upload to App Store Connect

## Environment Configuration

### Development
- Uses local development servers
- Hot reload enabled
- Debug mode active

### Production
- Builds optimized bundles
- Connects to production Supabase
- Analytics enabled

## Next Steps

1. **Test thoroughly** on both platforms
2. **Configure push notifications** if needed
3. **Set up analytics** tracking
4. **Prepare store listings** and metadata
5. **Submit to app stores**

## Support

### Resources
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Docs](https://developer.android.com/)
- [iOS Developer Docs](https://developer.apple.com/documentation/)

### Common Commands Reference
```bash
# Check Capacitor installation
npx cap doctor

# Update Capacitor
npm update @capacitor/cli @capacitor/core

# Add plugins
npm install @capacitor/[plugin-name]
npx cap sync

# Live reload during development
npx cap run android --livereload --external
npx cap run ios --livereload --external
```

This setup transforms your SportXcel React app into fully functional native mobile applications while maintaining all the features and performance optimizations you've built.