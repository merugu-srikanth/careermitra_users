# CareerMitra – PWA → APK → Google Play Store Guide

## What Was Done (PWA Setup)

### Files Changed / Created

| File | What Changed |
|------|-------------|
| `vite.config.js` | Added `VitePWA` plugin with full manifest, workbox caching config |
| `index.html` | Added manifest link, theme-color, Apple PWA meta tags |
| `src/App.jsx` | Added `<PWAUpdatePrompt />` component |
| `src/components/PWAUpdatePrompt.jsx` | **NEW** – Shows "Update Available" banner when a new SW is deployed |
| `public/pwa-icons/` | **NEW** – 10 icon sizes (72 → 512px, standard + maskable) |
| `generate-pwa-icons.mjs` | **NEW** – Script to re-generate icons from `public/NewLogo.png` |

### PWA Features Enabled

- **Offline support** – App shell + static assets cached via Service Worker
- **Install prompt** – Users can "Add to Home Screen" on Android/iOS/desktop
- **Auto-update** – New deployments auto-update the service worker in the background
- **App shortcuts** – Long-press app icon → "Latest Jobs" / "Login" shortcuts
- **API caching** – `/api/jobs` cached for 24 hours (NetworkFirst strategy)
- **Font caching** – Google Fonts cached for 1 year (CacheFirst strategy)

---

## Step 1 – Deploy the PWA (Required Before APK)

Before generating an APK, your PWA must be live and accessible at `https://careermitra.in`.

```bash
npm run build        # Generates dist/ folder with sw.js + manifest.webmanifest
```

Upload the `dist/` folder to your hosting server. Verify these URLs work:
- `https://careermitra.in/manifest.webmanifest`
- `https://careermitra.in/sw.js`
- `https://careermitra.in/pwa-icons/icon-512x512.png`

---

## Step 2 – Generate APK Using PWABuilder (Easiest Method)

**Website:** https://www.pwabuilder.com

### Process:

1. Go to **https://www.pwabuilder.com**
2. Enter your URL: `https://careermitra.in`
3. Click **"Start"** – it will analyze your PWA score
4. Once analyzed, click **"Package for Stores"**
5. Select **"Android"**
6. Click **"Generate Package"**
7. Download the ZIP – it contains:
   - `careermitra.apk` – Direct install APK (for testing / sideloading)
   - `careermitra.aab` – Android App Bundle (for Play Store submission)
   - `assetlinks.json` – Required for Digital Asset Links

### What Type of APK is This?

PWABuilder creates a **TWA (Trusted Web Activity)** — a thin native Android shell that loads your website inside Chrome with no browser UI. It looks and feels like a fully native app.

---

## Step 3 – Test the APK on Your Phone

1. Enable **"Install Unknown Apps"** in Android Settings → Security
2. Transfer the `.apk` file to your phone via USB / Google Drive / WhatsApp
3. Tap the file to install
4. Open "CareerMitra" from your app drawer — it should open like a native app

---

## Step 4 – Set Up Digital Asset Links (Required for Play Store)

For the TWA to work without showing the browser URL bar, you must verify ownership of the website.

### What you need:

The `.assetlinks.json` file (from PWABuilder ZIP) must be hosted at:
```
https://careermitra.in/.well-known/assetlinks.json
```

### File content (PWABuilder generates this for you):
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "in.careermitra.app",
    "sha256_cert_fingerprints": ["YOUR_SIGNING_KEY_SHA256_HERE"]
  }
}]
```

### Steps:
1. Create folder `.well-known` in your web server root
2. Upload the `assetlinks.json` file from the PWABuilder ZIP
3. Verify it's accessible: `https://careermitra.in/.well-known/assetlinks.json`
4. Test with: https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://careermitra.in&relation=delegate_permission/common.handle_all_urls

---

## Step 5 – Publish to Google Play Store

### Prerequisites:
- Google Play Developer Account: https://play.google.com/console
- One-time fee: **$25 USD**
- The signed `.aab` file from PWABuilder

### Steps:

1. **Create Developer Account** at https://play.google.com/console/signup

2. **Create New App:**
   - Click "Create app"
   - App name: `CareerMitra – Govt Job Alerts`
   - Language: Hindi / English
   - App type: App
   - Free / Paid: Free

3. **Upload the AAB:**
   - Go to: Release → Testing → Internal testing (first) OR Production
   - Click "Create new release"
   - Upload your `.aab` file from PWABuilder
   - Add release notes (what's new)

4. **Fill Required Store Listing:**
   - Short description (80 chars): "Find Govt Jobs & Career Alerts for India"
   - Full description (4000 chars): Describe CareerMitra features
   - Category: **Education** or **Business**
   - Screenshots: Minimum 2 phone screenshots (use browser DevTools → mobile view → screenshot)
   - Feature graphic: 1024x500 banner image
   - App icon: 512x512 PNG (use `public/pwa-icons/icon-512x512.png`)

5. **Content Rating:**
   - Complete the content rating questionnaire
   - Likely gets: **Everyone** rating

6. **Privacy Policy:**
   - Required! Use your existing: `https://careermitra.in/privacy-policy`

7. **Submit for Review:**
   - Review takes 1-7 days for new apps
   - Google will email you when approved

---

## APK via Bubblewrap (Alternative – Advanced)

If you want more control, use Google's official **Bubblewrap** CLI tool:

```bash
# Install Bubblewrap globally
npm install -g @bubblewrap/cli

# Initialize TWA project (uses your manifest)
bubblewrap init --manifest https://careermitra.in/manifest.webmanifest

# Build APK + AAB
bubblewrap build

# Output: app-release-signed.apk + app-release-bundle.aab
```

Requirements:
- Java JDK 8 installed: https://adoptium.net
- Android SDK (Bubblewrap downloads this automatically)

---

## App Store Comparison

| Store | Tool | Cost | Time to Publish |
|-------|------|------|----------------|
| **Google Play Store** | PWABuilder / Bubblewrap | $25 one-time | 1-7 days |
| **Microsoft Store** | PWABuilder → Windows | Free | 1-3 days |
| **Direct APK Install** | PWABuilder | Free | Instant |
| **iOS App Store** | PWABuilder → iOS (limited) | $99/year | 1-14 days |

---

## Re-generating Icons

If you update the logo (`public/NewLogo.png`), regenerate all icons:

```bash
node generate-pwa-icons.mjs
npm run build
```

---

## PWA Checklist

- [x] Web App Manifest (`/manifest.webmanifest`)
- [x] Service Worker with offline support
- [x] HTTPS (careermitra.in)
- [x] App icons (72px → 512px)
- [x] Maskable icons (for Android adaptive icons)
- [x] Theme color set (#1e3a8a – CareerMitra blue)
- [x] App shortcuts (Latest Jobs, Login)
- [x] Auto-update prompt for users
- [x] API response caching (24hr)
- [x] Font caching (1yr)
- [ ] Digital Asset Links (`/.well-known/assetlinks.json`) — needed for Play Store
- [ ] Screenshots in manifest (add after deploying)

---

## Lighthouse PWA Score

After deploying, check your PWA score:
1. Open Chrome DevTools → Lighthouse tab
2. Select "Progressive Web App" category
3. Click "Analyze page load"
4. Target: 100/100 PWA score

Or use: https://web.dev/measure (enter `https://careermitra.in`)
