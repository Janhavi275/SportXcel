import React from 'react'
import ReactDOM from 'react-dom/client'
import { defineCustomElements } from '@ionic/pwa-elements/loader'
import App from '../App.tsx'
import '../styles/globals.css'

// Initialize Capacitor
import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'
import { StatusBar, Style } from '@capacitor/status-bar'

const initializeApp = async () => {
  // Configure status bar for mobile
  if (Capacitor.isNativePlatform()) {
    try {
      await StatusBar.setStyle({ style: Style.Default })
      await StatusBar.setBackgroundColor({ color: '#030213' })
      
      // Hide splash screen
      await SplashScreen.hide()
    } catch (error) {
      console.log('Native features not available:', error)
    }
  }
  
  // Define custom elements for camera functionality
  defineCustomElements(window)
}

// Initialize app
initializeApp()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)