# ☕ Brewbooks - Free Audiobooks

**Your daily brew of classic stories**

A cozy, mobile-first audiobook player for classic literature. Listen to thousands of free public domain audiobooks from LibriVox, Internet Archive, and Open Library.

**No subscriptions. No ads. Just great stories.**

![Mobile-First Design](https://img.shields.io/badge/Design-Mobile%20First-orange)
![No API Key](https://img.shields.io/badge/API-No%20Key%20Required-green)
![Coffee Theme](https://img.shields.io/badge/Theme-Coffee%20%26%20Cream-brown)

## ✨ Features

### 🎵 **Triple API Integration**
- **LibriVox**: 20,000+ public domain audiobooks
- **Internet Archive**: 200,000+ audio recordings
- **Open Library**: Additional metadata and discovery
- **No API keys required** - all sources are completely free

### 📱 **Native Mobile App Experience**
- Bottom navigation bar (iOS/Android style)
- Mini player with expandable full-screen view
- Swipe-friendly card layouts
- Pull-to-refresh (planned)
- iOS safe area support
- Optimized for one-handed use

### ☕ **Coffee & Cream Design**
- Warm, cozy color palette
- Light & dark modes
- No harsh colors, no gradients
- Serif titles (Crimson Pro) + Sans UI (Inter)
- Professional, readable typography

### 🎧 **Full Audio Player**
- Play/pause with visual feedback
- Skip forward 30s / backward 15s
- Seekable progress bar
- Volume control
- Playback speed: 0.5× to 2×
- Auto-resume from last position
- Position saves every 5 seconds

### 📚 **Smart Organization**
- **Home**: Featured audiobooks + recently played
- **Search**: Fast search across all sources
- **Library**: Bookmarks + listening history
- **Settings**: Theme, speed, data management

## 🏗️ Architecture

```
/src
  /api
    audiobook-api.js       # Unified API (LibriVox + Archive + OpenLibrary)
  
  /components
    BottomNav.jsx          # Mobile bottom navigation
    MiniPlayer.jsx         # Collapsed player bar
    FullPlayer.jsx         # Expanded full-screen player
    BookCard.jsx           # Book display (grid + list layouts)
  
  /contexts
    PlayerContext.jsx      # Audio playback state
    ThemeContext.jsx       # Light/dark mode state
  
  /views
    HomeView.jsx           # Home screen
    SearchView.jsx         # Search interface
    LibraryView.jsx        # Bookmarks + recent
    SettingsView.jsx       # Settings panel
  
  /utils
    storage.js             # LocalStorage wrapper
  
  /styles
    mobile-design.css      # Mobile-first design system
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Opens at `http://localhost:5173`

**Test on mobile device:**
```bash
npm run dev
# Then visit http://YOUR_IP:5173 from phone
```

### 3. Build for Production

```bash
npm run build
```

## 📦 Deployment

### GitHub Pages

1. Update `vite.config.js`:
   ```js
   base: '/brewbooks/'  // Should already be set!
   ```

2. Deploy:
   ```bash
   npm run deploy
   ```

Live at: `https://your-username.github.io/brewbooks/`

### Netlify / Vercel

Just connect your repo - auto-detects Vite config.

## 🎨 Design System

### Coffee & Cream Palette

**Light Mode:**
- Background: `#faf8f5` (cream)
- Surface: `#ffffff` (white)
- Accent: `#8d6e63` (mocha)
- Text: `#3e2723` (coffee)

**Dark Mode:**
- Background: `#1a1412` (espresso)
- Surface: `#3a302b` (dark roast)
- Accent: `#a1887f` (light mocha)
- Text: `#faf8f5` (cream)

### Typography
- **Display/Headings**: Crimson Pro (serif)
- **UI/Body**: Inter (sans-serif)
- **Monospace**: System monospace

### Spacing
8px base system (4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px)

## 🔌 API Information

### LibriVox API
- **URL**: `https://librivox.org/api/feed/audiobooks`
- **Auth**: None required
- **Rate Limit**: None
- **Format**: JSON
- **Coverage**: 20,000+ public domain audiobooks

### Internet Archive API
- **URL**: `https://archive.org/advancedsearch.php`
- **Auth**: None required
- **Rate Limit**: Reasonable use
- **Format**: JSON
- **Coverage**: 200,000+ audio files

### Open Library API
- **URL**: `https://openlibrary.org/search.json`
- **Auth**: None required
- **Rate Limit**: Reasonable use
- **Coverage**: Metadata + some audio

**All APIs are 100% free with no authentication.**

## 💾 Data Storage

All data is stored locally using LocalStorage:

- **Theme**: Light/dark preference
- **Bookmarks**: Saved audiobooks
- **Recent**: Last 50 played books
- **Positions**: Playback position per book
- **Settings**: Speed, volume, preferences

**No backend required. No account needed. Privacy-first.**

## 📱 Mobile Best Practices

✅ **Touch Targets**: Minimum 44px (Apple HIG)
✅ **Bottom Navigation**: Thumb-friendly zone
✅ **Safe Areas**: iOS notch/home indicator support
✅ **One-Handed**: All controls reachable
✅ **Offline-Ready**: LocalStorage persistence
✅ **Fast Load**: Optimized Vite build
✅ **Smooth Animations**: 60fps CSS transitions

## 🎯 Portfolio Highlights

1. **Mobile-First**: Bottom nav, thumb zones, safe areas
2. **Triple API**: LibriVox + Archive + OpenLibrary
3. **State Management**: React Context (Player + Theme)
4. **Data Persistence**: LocalStorage with auto-save
5. **Responsive**: Works on all screen sizes
6. **Accessible**: Semantic HTML, ARIA, keyboard support
7. **Performant**: Lazy loading, optimized renders

## 🛠️ Tech Stack

- **React 18**: UI framework
- **Vite**: Build tool
- **HTML5 Audio**: Native playback
- **LocalStorage**: Client-side persistence
- **CSS Variables**: Dynamic theming

## 🔮 Future Enhancements

- [ ] Offline mode (Service Worker)
- [ ] Download for offline listening
- [ ] Playlists
- [ ] Sleep timer
- [ ] Chapter markers
- [ ] Share functionality
- [ ] iOS/Android PWA install prompts

## 📄 License

MIT - Free for personal and commercial use

## 🙏 Credits

- Audiobooks from LibriVox, Internet Archive, Open Library
- Fonts: Crimson Pro & Inter (Google Fonts)
- Built with React + Vite

---

**No API keys. No subscriptions. No ads. Just audiobooks. ☕📖**

*Brewbooks - Your daily brew of classic stories*
