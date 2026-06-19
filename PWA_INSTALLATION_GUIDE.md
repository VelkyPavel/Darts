# PWA Installation Guide

Your Darts Scorekeeper app is now a Progressive Web App (PWA) that can be installed as a native application on all major platforms!

## Features Enabled

✅ **Offline Support** - Play and track scores even without internet  
✅ **Native App Experience** - Runs standalone without browser UI  
✅ **Cross-Platform** - Works on iOS, Android, Mac, Windows, and Linux  
✅ **Fast Loading** - Service Worker caches assets for instant load times  
✅ **Auto-Updates** - Updates are fetched automatically in the background  

---

## Installation Instructions

### **iOS (iPhone/iPad)**

1. Open this app in Safari
2. Tap the **Share** button (bottom icon)
3. Scroll down and tap **"Add to Home Screen"**
4. Enter a name (e.g., "Darts Scorekeeper") and tap **"Add"**
5. The app will appear on your home screen

**Access:** Tap the app icon on your home screen to launch

### **Android**

1. Open this app in Chrome (or your default browser)
2. Tap the **menu** (⋮ button) in the top right
3. Tap **"Install app"** or **"Add to Home screen"**
4. Confirm when prompted
5. The app will appear on your home screen

**Access:** Tap the app icon on your home screen to launch

### **Mac (macOS)**

1. Open this app in Chrome or Safari
2. In the address bar, look for the **install icon** (usually on the right side)
3. Click the **install** icon
4. Confirm the installation
5. The app will launch in its own window

**Access:** Find "Darts Scorekeeper" in your Applications folder or Launchpad

### **Windows**

1. Open this app in Microsoft Edge or Chrome
2. Click the **install icon** (usually on the right side of the address bar)
3. Confirm when prompted
4. The app will be installed and available in your Start Menu

**Access:** Search for "Darts Scorekeeper" in the Start Menu, or find it in your app list

### **Linux**

1. Open this app in Chrome
2. Click the **install icon** (usually on the right side of the address bar)
3. Confirm installation
4. The app will appear in your applications menu

---

## Using the App

### **Install Button** (Optional UI Enhancement)

The app includes an "Install App" button that appears when installation is available. You can click this button instead of using your device's native install method.

To add the install button to your home screen or header:

```tsx
import InstallButton from './components/InstallButton';

// Add to your component
<InstallButton />
```

### **Offline Mode**

Once installed, the app continues to work offline:
- Your game history is saved locally
- Scores are synchronized when you go back online
- Settings and preferences persist

### **Features**

- **New Game Shortcut** - Quick access shortcut from home screen (long press on app icon)
- **History** - Quick access shortcut from home screen (long press on app icon)
- **Native App Feel** - No browser address bar or navigation buttons

---

## Troubleshooting

### **App Won't Install**

- Ensure you're using a supported browser (Chrome, Safari, Edge, or Firefox)
- Try accessing the app with HTTPS (most browsers require this for PWA installation)
- Clear browser cache and try again

### **Offline Features Not Working**

- Check that service worker is registered: Open DevTools (F12) → Application → Service Workers
- Ensure the app was installed properly
- Try clearing app data and reinstalling

### **Updates Not Appearing**

- Updates check automatically when the app launches
- Force refresh the app (pull down to refresh or reload)
- Updates appear in the background; restart the app to see new features

### **App Icon Wrong**

- For iOS: The icon is set from your home screen add action
- For Android/Mac/Windows: Clear app cache and reinstall
- Icons are defined in `manifest.json` in the public folder

---

## Technical Details

### **Files Involved**

- `public/manifest.json` - App metadata and configuration
- `public/sw.js` - Service Worker for offline support
- `public/browserconfig.xml` - Windows tile configuration
- `index.html` - PWA meta tags
- `vite.config.ts` - Build configuration for PWA

### **Supported Features**

- Web App Manifest (W3C standard)
- Service Workers for offline caching
- App shortcuts (quick actions from home screen)
- Adaptive icons for Android
- Windows Start Menu integration

---

## Need Help?

For issues specific to your device:
- **iOS**: See Apple's guide on web apps
- **Android**: Check Google's PWA documentation
- **Windows/Mac**: Refer to your browser's app documentation

Enjoy using your Darts Scorekeeper app! 🎯
