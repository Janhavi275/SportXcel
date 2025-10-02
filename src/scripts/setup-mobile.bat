@echo off
REM SportXcel Mobile Setup Script for Windows
REM This script sets up Capacitor for Android development

echo 🚀 Setting up SportXcel for mobile development with Capacitor...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Install dependencies
echo 📦 Installing project dependencies...
npm install

REM Install Capacitor CLI globally if not present
cap --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing Capacitor CLI globally...
    npm install -g @capacitor/cli
)

REM Build the web app
echo 🔨 Building React app for production...
npm run build

REM Check if build was successful
if not exist "dist" (
    echo ❌ Build failed. Please check your React app for errors.
    pause
    exit /b 1
)

echo ✅ React app built successfully

REM Initialize Capacitor if not already done
if not exist "capacitor.config.ts" (
    echo ⚙️  Initializing Capacitor...
    npx cap init SportXcel com.sportxcel.app
)

REM Add Android platform
echo 📱 Adding Android platform...
if not exist "android" (
    echo 🤖 Adding Android platform...
    npx cap add android
    echo ✅ Android platform added
) else (
    echo ✅ Android platform already exists
)

REM Sync web assets to native projects
echo 🔄 Syncing web assets to native projects...
npx cap sync

REM Check Capacitor doctor
echo 🏥 Running Capacitor doctor to check setup...
npx cap doctor

echo.
echo 🎉 Mobile setup complete!
echo.
echo Next steps:
echo 1. For Android:
echo    - Install Android Studio: https://developer.android.com/studio
echo    - Configure environment variables (see CAPACITOR_SETUP_GUIDE.md)
echo    - Open project: npx cap open android
echo    - Run on device: npx cap run android
echo.
echo 2. Development workflow:
echo    - Make changes to your React code
echo    - Run: npm run build && npx cap sync
echo    - Test on device/emulator
echo.
echo 3. Quick commands:
echo    - npm run cap:build:android
echo    - npm run mobile:dev
echo.
echo 📖 See CAPACITOR_SETUP_GUIDE.md for detailed instructions
echo.
pause