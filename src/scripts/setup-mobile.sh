#!/bin/bash

# SportXcel Mobile Setup Script
# This script sets up Capacitor for iOS and Android development

echo "🚀 Setting up SportXcel for mobile development with Capacitor..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2)
if ! [[ "$NODE_VERSION" > "18" ]]; then
    echo "⚠️  Node.js version $NODE_VERSION detected. Node.js 18+ is recommended."
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing project dependencies..."
npm install

# Install Capacitor CLI globally if not present
if ! command -v cap &> /dev/null; then
    echo "📦 Installing Capacitor CLI globally..."
    npm install -g @capacitor/cli
fi

# Build the web app
echo "🔨 Building React app for production..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Build failed. Please check your React app for errors."
    exit 1
fi

echo "✅ React app built successfully"

# Initialize Capacitor (if not already done)
if [ ! -f "capacitor.config.ts" ]; then
    echo "⚙️  Initializing Capacitor..."
    npx cap init SportXcel com.sportxcel.app
fi

# Add platforms
echo "📱 Adding mobile platforms..."

if [ ! -d "android" ]; then
    echo "🤖 Adding Android platform..."
    npx cap add android
    echo "✅ Android platform added"
else
    echo "✅ Android platform already exists"
fi

# Check for macOS before adding iOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    if [ ! -d "ios" ]; then
        echo "🍎 Adding iOS platform..."
        npx cap add ios
        echo "✅ iOS platform added"
    else
        echo "✅ iOS platform already exists"
    fi
else
    echo "⚠️  iOS development requires macOS. Skipping iOS platform."
fi

# Sync web assets to native projects
echo "🔄 Syncing web assets to native projects..."
npx cap sync

# Check Capacitor doctor
echo "🏥 Running Capacitor doctor to check setup..."
npx cap doctor

echo ""
echo "🎉 Mobile setup complete!"
echo ""
echo "Next steps:"
echo "1. For Android:"
echo "   - Install Android Studio: https://developer.android.com/studio"
echo "   - Open project: npx cap open android"
echo "   - Run on device: npx cap run android"
echo ""

if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "2. For iOS:"
    echo "   - Install Xcode from the Mac App Store"
    echo "   - Open project: npx cap open ios"
    echo "   - Run on device: npx cap run ios"
    echo ""
fi

echo "3. Development workflow:"
echo "   - Make changes to your React code"
echo "   - Run: npm run build && npx cap sync"
echo "   - Test on device/emulator"
echo ""
echo "4. Quick commands:"
echo "   - npm run cap:build:android"
echo "   - npm run cap:build:ios"
echo "   - npm run mobile:dev"
echo ""
echo "📖 See CAPACITOR_SETUP_GUIDE.md for detailed instructions"