# SportXcel Mobile App - Quick Start Guide

## 🚀 Getting Started

### Step 1: Navigate to Your Project Directory
First, you need to be in your SportXcel project folder:

```bash
# If you're in C:\Users\riddh>, navigate to your project
# Replace "path-to-your-project" with the actual path
cd path-to-your-project

# For example, if your project is in Documents:
cd Documents\SportXcel

# Or if it's on Desktop:
cd Desktop\SportXcel
```

### Step 2: Run the Mobile Setup Script

**For Windows:**
```bash
# Make sure you're in the project directory (where package.json is located)
scripts\setup-mobile.bat
```

**For macOS/Linux:**
```bash
# Make sure you're in the project directory
chmod +x scripts/setup-mobile.sh
./scripts/setup-mobile.sh
```

### Step 3: Verify Project Structure
Make sure you're in the right directory by checking if these files exist:
```bash
# Check if you see these files
dir     # Windows
ls      # macOS/Linux

# You should see:
# - package.json
# - App.tsx
# - capacitor.config.ts
# - scripts folder
```

## 🛠️ Manual Setup (if script doesn't work)

If the script fails, you can run the commands manually:

```bash
# 1. Install dependencies
npm install

# 2. Install Capacitor CLI globally
npm install -g @capacitor/cli

# 3. Build the React app
npm run build

# 4. Add mobile platforms
npx cap add android
npx cap add ios    # macOS only

# 5. Sync web assets
npx cap sync

# 6. Check setup
npx cap doctor
```

## 📱 Testing Your Mobile App

### Android Testing
1. **Install Android Studio** from https://developer.android.com/studio
2. **Open the project:**
   ```bash
   npx cap open android
   ```
3. **Run on device/emulator:**
   ```bash
   npx cap run android
   ```

### iOS Testing (macOS only)
1. **Install Xcode** from the Mac App Store
2. **Open the project:**
   ```bash
   npx cap open ios
   ```
3. **Run on device/simulator:**
   ```bash
   npx cap run ios
   ```

## 🔧 Development Workflow

After making changes to your React code:

```bash
# 1. Build the web app
npm run build

# 2. Sync changes to mobile
npx cap sync

# 3. Test on mobile
npx cap run android
# or
npx cap run ios
```

## 🆘 Troubleshooting

### Common Issues:

1. **"Command not found" errors:**
   - Make sure you're in the project directory
   - Check that Node.js is installed: `node --version`

2. **Permission errors on scripts:**
   ```bash
   # Windows: Run as Administrator
   # macOS/Linux: Make executable
   chmod +x scripts/setup-mobile.sh
   ```

3. **Build errors:**
   ```bash
   # Clean and reinstall
   rm -rf node_modules   # macOS/Linux
   rmdir /s node_modules # Windows
   npm install
   ```

## 📞 Need Help?

If you encounter issues:
1. Check the detailed `CAPACITOR_SETUP_GUIDE.md`
2. Run `npx cap doctor` to diagnose problems
3. Ensure all prerequisites are installed

## 🎯 Quick Commands Reference

```bash
# Development
npm run build && npx cap sync    # Update mobile apps
npm run mobile:dev               # Quick mobile development

# Platform management
npx cap add android             # Add Android platform
npx cap add ios                 # Add iOS platform (macOS only)
npx cap sync                    # Sync web assets
npx cap doctor                  # Check setup

# Running apps
npx cap run android             # Run on Android
npx cap run ios                 # Run on iOS
npx cap open android            # Open in Android Studio
npx cap open ios                # Open in Xcode
```

Your SportXcel app is now ready to run as a native mobile application! 🎉