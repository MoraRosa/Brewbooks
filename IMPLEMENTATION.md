# 🏗️ BrewBooks Implementation Plan

**Project:** BrewBooks - Your daily brew of classic stories  
**Status:** Core App Complete ✅ | Polish & Enhancement Phase 🚧  
**Last Updated:** February 14, 2026

---

## 📊 WHAT'S DONE

### ✅ **Core Features (Complete)**
- Mobile-first UI with bottom navigation
- Mini player + full-screen player
- Multi-source audiobook integration (Archive.org, LibriVox, Storynory, Lit2Go, BBC Radio)
- 31 genre system with Netflix-style home page
- Search with filters (collections, genres)
- Chapter/episode navigation in detail pages
- Bookmarks, history, playback positions
- Multi-chapter playback with auto-advance
- Podcast integration (iTunes API, subscriptions, progress tracking)
- Coffee & cream theme (light/dark modes)
- GitHub Pages deployment
- ~54,000+ audiobooks from multiple sources

---

## 🎯 PHASE 1: CRITICAL UX FIXES (This Week)

### **1.1 Progress Bar Scrubbing** 🔴 CRITICAL
**Problem:** Can't drag progress bar to skip through audiobook/podcast  
**Current:** Only clickable  
**Need:** Touch drag support with live preview

**Implementation:**
- Add `onTouchStart`, `onTouchMove`, `onTouchEnd` handlers
- Show time preview while dragging
- Smooth seeking animation
- Works on both mini and full player

**Files to Modify:**
- `src/components/MiniPlayer.jsx`
- `src/components/FullPlayer.jsx`

**Estimated Time:** 2 hours

---

### **1.2 Skip Buttons for Audiobooks** 🔴 CRITICAL
**Problem:** Audiobooks only have chapter prev/next, no 15s back / 30s forward  
**Current:** Podcasts have skip buttons, audiobooks don't  
**Need:** Universal skip buttons (15s back, 30s forward) for all content

**Implementation:**
- When chapters exist: Show chapter buttons
- When no chapters or podcast: Show 15s/30s skip buttons
- Add to both mini and full player

**Files to Modify:**
- `src/components/FullPlayer.jsx`
- `src/components/MiniPlayer.jsx`
- `src/contexts/PlayerContext.jsx` (ensure skipForward/skipBackward work)

**Estimated Time:** 1 hour

---

### **1.3 Continue Listening - Podcast Episodes** 🔴 CRITICAL
**Problem:** Continue Listening cards only show 1 episode for podcasts  
**Current:** Audiobooks show all chapters, podcasts show 1 episode  
**Need:** Show full episode list for podcasts in Continue Listening

**Implementation:**
- Store podcast metadata (podcastId, podcastTitle) with progress
- Fetch all episodes when displaying in Continue Listening
- Match UI to audiobook chapter display

**Files to Modify:**
- `src/views/PodcastView.jsx` (Continue Listening section)
- `src/utils/podcastStorage.js` (ensure metadata is stored)

**Estimated Time:** 2 hours

---

### **1.4 PWA Setup** 🔴 CRITICAL
**Goal:** Install app on mobile with custom icon and splash screen

**Features:**
- App name: "BrewBooks"
- Custom favicon (pending from user)
- Custom splash screen (pending from user)
- Install prompt
- App icons (multiple sizes: 192x192, 512x512)
- Standalone mode (no browser UI)

**Implementation:**
- Create `public/manifest.json`
- Add app icons to `public/icons/`
- Add meta tags for PWA
- Service worker for install prompt
- Test on iOS Safari and Chrome Android

**Files to Create/Modify:**
- `public/manifest.json` (NEW)
- `public/icons/` (NEW directory)
- `index.html` (MODIFY - add PWA meta tags)
- `src/components/InstallPrompt.jsx` (NEW)
- `vite.config.js` (MODIFY - PWA plugin)

**Estimated Time:** 3 hours

**Waiting On:** User to provide favicon and splash screen image

---

## 📚 PHASE 2: NEW AUDIOBOOK SOURCES (Next 2 Weeks)

### **2.1 Audiobook Treasury Collection** 🟢 EASY
**What:** Internet Archive curated collection of high-quality audiobooks  
**Why:** Better quality recordings, professionally curated  
**How:** Filter Archive.org search by collection name

**Implementation:**
- Add `collection:audiobook_treasury` to Archive.org queries
- Add "Treasury" badge to matching books
- Feature in home page section

**Files to Modify:**
- `src/api/audiobook-api.js` (add collection filter)
- `src/components/BookCard.jsx` (add Treasury badge)

**Estimated Time:** 1 hour

---

### **2.2 Open Culture Integration** 🟡 MEDIUM
**What:** Curated list of ~1,000 free audiobooks from various sources  
**Why:** Quality curation, diverse sources  
**How:** Research their catalog structure and integrate

**Research Tasks:**
- Check if they have an API or RSS feed
- Determine source format (JSON, RSS, web scraping)
- Map to our book format

**Implementation:** TBD based on research

**Estimated Time:** 4 hours (research + implementation)

---

### **2.3 Audible Romance Package** 🟡 MEDIUM
**What:** Free romance audiobooks from Audible  
**Why:** Genre diversity, professionally recorded  
**How:** Research Audible's free content availability

**Research Tasks:**
- Check Audible Plus Catalog API access
- Determine if we can link/stream free content
- Legal considerations for embedding Audible content

**Implementation:** TBD based on research

**Estimated Time:** 4 hours (research + implementation)

---

### **2.4 YouTube Audiobooks** 🎯 INTERESTING (PHASE 3)
**What:** Public domain audiobooks on YouTube  
**Why:** Another source, video platform integration  
**How:** YouTube Data API v3 (free but rate-limited)

**User's Note:** "I have an idea for later"

**Status:** PARKED - Awaiting user's plan

---

## 🎨 PHASE 3: ADVANCED FEATURES (Month 2)

### **3.1 Podcast Seasons** 🟡 HIGH
**Goal:** Group podcast episodes by season

**Features:**
- Parse episode titles for season patterns (S01E05, Season 2 Episode 3, etc.)
- Group episodes by season
- Collapsible season sections
- "All Episodes" view option

**Implementation:**
- Create season detection algorithm
- Modify `PodcastDetailModal.jsx` UI
- Add season toggle

**Files to Modify:**
- `src/components/PodcastDetailModal.jsx`
- `src/utils/podcast-helpers.js` (NEW)

**Estimated Time:** 4 hours

---

### **3.2 Sleep Timer** 🟢 EASY
**Goal:** Auto-pause after X minutes

**Features:**
- Timer options: 5, 10, 15, 30, 60 mins, End of Chapter
- Show countdown in player
- Fade out audio (3 second fade)
- Cancel timer option
- Visual indicator in mini player

**Implementation:**
- Add timer state to PlayerContext
- Add timer UI to FullPlayer
- Implement fade-out logic

**Files to Modify:**
- `src/contexts/PlayerContext.jsx`
- `src/components/FullPlayer.jsx`

**Estimated Time:** 2 hours

---

### **3.3 Offline Downloads** 🔴 CRITICAL (Long-term)
**Goal:** Download audiobooks for offline listening

**Features:**
- Download entire book or selected chapters
- Show download progress
- Manage downloaded content (delete, re-download)
- Offline indicator in UI
- Service worker + IndexedDB storage

**Implementation:**
- Service worker for background downloads
- IndexedDB for storing audio files
- Download manager UI
- Offline detection

**Files to Create:**
- `src/service-worker.js` (NEW)
- `src/utils/download-manager.js` (NEW)
- `src/components/DownloadButton.jsx` (NEW)
- `src/views/DownloadsView.jsx` (NEW)

**Estimated Time:** 2 days

---

### **3.4 Playlists** 🟡 HIGH
**Goal:** Create custom book collections

**Features:**
- Create/edit/delete playlists
- Add books to playlists
- Reorder items (drag & drop)
- Play entire playlist
- Share playlists (export JSON)

**Implementation:**
- Playlist CRUD in localStorage
- Playlist view with drag-drop
- "Add to Playlist" button in book detail
- Queue integration

**Files to Create:**
- `src/views/PlaylistView.jsx` (NEW)
- `src/components/PlaylistManager.jsx` (NEW)
- `src/utils/storage.js` (MODIFY - add playlist functions)

**Estimated Time:** 1 day

---

### **3.5 Listening Statistics** 🟢 EASY
**Goal:** Track and visualize listening habits

**Stats to Track:**
- Total hours listened (all-time, this week, this month)
- Books completed
- Favorite genres (by time spent)
- Longest book listened to
- Current listening streak (days)
- Average listening time per day
- Books by source (LibriVox, Archive, Podcasts, etc.)

**Visualization:**
- Charts (weekly/monthly listening hours)
- Progress rings
- Badges/achievements

**Files to Create:**
- `src/views/StatsView.jsx` (NEW)
- `src/components/StatsChart.jsx` (NEW)
- `src/utils/storage.js` (MODIFY - track detailed stats)

**Estimated Time:** 1 day

---

## 🎭 PHASE 4: POLISH & COMMUNITY (Month 3)

### **4.1 Share Functionality** 🟢 EASY
**Goal:** Share books and progress with friends

**Share Options:**
- Copy book link
- Share to social media (Twitter, Facebook, WhatsApp)
- Share current listening progress
- Generate "Currently Listening" card (image with book cover + progress)
- Share playlist

**Implementation:**
- Use Web Share API (native mobile sharing)
- Generate shareable URLs with book ID
- Create listening card generator (canvas)
- Add share buttons to book detail and player

**Files to Create:**
- `src/utils/share.js` (NEW)
- `src/components/ShareButton.jsx` (NEW)
- `src/components/ListeningCard.jsx` (NEW - generates image)

**Estimated Time:** 3 hours

---

### **4.2 Accessibility Improvements** 🟡 HIGH
**Goal:** WCAG AA compliance

**Improvements:**
- Full keyboard navigation
- Screen reader optimization (ARIA labels)
- High contrast mode option
- Focus indicators
- Skip to content link
- Announced state changes
- Alt text for all images

**Files to Modify:**
- All components (add ARIA attributes)
- `src/styles/mobile-design.css` (focus styles, high contrast)

**Estimated Time:** 1 day

---

### **4.3 Performance Optimization** 🟠 MEDIUM
**Goal:** Lightning-fast load times

**Optimizations:**
- Code splitting (lazy load routes)
- Image optimization (WebP, lazy loading)
- Bundle size reduction
- Virtual scrolling for long lists
- Debounced search
- React.memo for expensive components
- Service worker caching

**Targets:**
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Bundle size < 500KB gzipped
- Lighthouse score > 90

**Files to Modify:**
- `vite.config.js` (optimization config)
- All route components (lazy loading)
- List components (virtual scrolling)

**Estimated Time:** 2 days

---

## 📝 ADDITIONAL IDEAS (Future Backlog)

### **Nice to Have (No Timeline):**
- [ ] Variable playback speed per book (remember speed for each book)
- [ ] Equalizer presets (bass boost, treble, etc.)
- [ ] Reading mode (show book text while listening - if available)
- [ ] Chromecast support
- [ ] CarPlay/Android Auto (PWA limitations)
- [ ] Browser extension
- [ ] Desktop app (Electron wrapper)
- [ ] Voice commands ("Hey BrewBooks, play Pride and Prejudice")
- [ ] Translation support (UI in multiple languages)
- [ ] AI-generated chapter summaries
- [ ] Book clubs feature (discussion forums)
- [ ] Narrator filter (find all books by specific narrator)
- [ ] Sync across devices (requires backend)

---

## 🗓️ ESTIMATED TIMELINE

### **Phase 1 (Critical UX Fixes):** 1 Week
- Progress bar scrubbing: 2 hours
- Skip buttons: 1 hour
- Continue Listening fix: 2 hours
- PWA setup: 3 hours
- Testing & polish: 2 hours
- **Total:** ~10 hours (1 week casual pace)

### **Phase 2 (New Sources):** 2 Weeks
- Audiobook Treasury: 1 hour
- Open Culture: 4 hours
- Audible Romance: 4 hours
- Testing: 3 hours
- **Total:** ~12 hours (2 weeks)

### **Phase 3 (Advanced Features):** 1 Month
- Podcast seasons: 4 hours
- Sleep timer: 2 hours
- Offline downloads: 2 days
- Playlists: 1 day
- Stats: 1 day
- Testing: 2 days
- **Total:** ~6 days (1 month casual pace)

### **Phase 4 (Polish):** 2 Weeks
- Share functionality: 3 hours
- Accessibility: 1 day
- Performance: 2 days
- Final testing: 1 day
- **Total:** ~4 days (2 weeks)

---

## 🏁 DEFINITION OF DONE

A feature is "done" when:
- [ ] Code implemented and tested
- [ ] Works on mobile (iOS Safari, Chrome Android)
- [ ] Works in light and dark modes
- [ ] No console errors
- [ ] Accessible (keyboard navigation, screen reader)
- [ ] Committed to GitHub
- [ ] Deployed to GitHub Pages
- [ ] Verified on live site

---

## 🎯 IMMEDIATE NEXT STEPS

### **This Session:**
1. ✅ Update IMPLEMENTATION.md (this file)
2. ⏳ Fix progress bar scrubbing
3. ⏳ Add 15s/30s skip buttons
4. ⏳ Fix Continue Listening podcast episodes

### **Waiting On User:**
- Favicon image for PWA
- Splash screen image for PWA
- YouTube audiobooks idea/plan

---

## 📞 COLLABORATION NOTES

**Decision Making:**
- Major features: Discuss before implementing
- Minor features: Build and iterate
- Experimental: Mark as [BETA] in UI

**Code Standards:**
- Mobile-first always
- Coffee theme consistency
- Modular architecture
- Comment complex logic
- Meaningful variable names

**Testing:**
- Test on real mobile devices
- Check both light/dark modes
- Verify on slow connections
- Test touch interactions

---

**Last Updated:** February 14, 2026  
**Next Review:** After Phase 1 completion