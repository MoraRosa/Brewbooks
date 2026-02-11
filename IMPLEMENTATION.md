# 🏗️ Brewbooks Implementation Plan

**Project:** Brewbooks - Your daily brew of classic stories
**Status:** Phase 1 Complete ✅ | Phase 2 In Progress 🚧
**Last Updated:** February 11, 2025

---

## 📊 PROGRESS TRACKER

### ✅ COMPLETED (Phase 1)
- [x] Mobile-first UI with bottom navigation
- [x] Mini player + full-screen player
- [x] LibriVox API integration
- [x] Internet Archive API integration
- [x] Open Library API integration (metadata)
- [x] Coffee & cream theme (light/dark modes)
- [x] LocalStorage for bookmarks, history, positions
- [x] Basic search functionality
- [x] Home/Search/Library/Settings views
- [x] GitHub Pages deployment
- [x] Playback speed control (0.5× - 2×)
- [x] Volume control
- [x] Auto-resume playback position

### 🚧 IN PROGRESS (Phase 2)
- [ ] Book detail modal/page
- [ ] Multi-chapter playback support
- [ ] Chapter list & navigation
- [ ] Loyal Books API integration
- [ ] Project Gutenberg API integration
- [ ] Genre/category system
- [ ] Dark mode UI fixes (arrow visibility)
- [ ] Multi-source display per book

### 📋 PLANNED (Phase 3-6)
- [ ] See detailed roadmap below

---

## 🎯 PHASE 2: CORE EXPERIENCE (Current Priority)

### **2.1 Book Detail Page** 🔴 CRITICAL
**Goal:** Users can see full book info before playing

**Features:**
- [ ] Modal/page triggered by card tap
- [ ] Large cover art
- [ ] Full description
- [ ] Author name & bio (from Open Library)
- [ ] Genre tags
- [ ] Duration (total)
- [ ] Language
- [ ] Publication year
- [ ] Narrator info (if available)
- [ ] Chapter count
- [ ] Multiple source options (LibriVox, Archive, Loyal Books, etc.)
- [ ] Big "Play" button per source
- [ ] Bookmark button
- [ ] Share button
- [ ] "Add to Queue" button

**UI Pattern:**
```
Card Tap → Detail Modal → Choose Source → Play
```

**Files to Create/Modify:**
- `src/components/BookDetailModal.jsx` (NEW)
- `src/components/BookCard.jsx` (MODIFY - add tap handler)
- `src/views/HomeView.jsx` (MODIFY - handle modal state)
- `src/api/audiobook-api.js` (MODIFY - fetch full book details)

**Estimated Time:** 2 days

---

### **2.2 Multi-Chapter Playback** 🔴 CRITICAL
**Goal:** Play entire books, not just first chapter

**Problem:** 
- LibriVox books have multiple MP3 files (one per chapter)
- Internet Archive books are often ZIP files
- Need to extract, queue, and auto-advance

**Solution:**
- [ ] Fetch all audio files for selected book
- [ ] Create internal playlist/queue
- [ ] Auto-advance to next chapter on completion
- [ ] Show "Chapter X of Y" in player
- [ ] Allow manual chapter skip (Previous/Next)
- [ ] Save progress per chapter

**Technical Approach:**
- LibriVox: Use `sections` API endpoint
- Internet Archive: Use metadata API to get file list
- Parse ZIP contents or direct MP3 links

**Files to Create/Modify:**
- `src/contexts/PlayerContext.jsx` (MODIFY - add chapter queue)
- `src/api/audiobook-api.js` (MODIFY - fetch chapter list)
- `src/components/FullPlayer.jsx` (MODIFY - show chapters)
- `src/components/ChapterList.jsx` (NEW)

**Estimated Time:** 3 days

---

### **2.3 Chapter Navigation UI** 🟡 HIGH
**Goal:** Visual chapter list with tap-to-jump

**Features:**
- [ ] Chapter list in full player
- [ ] Tap chapter to jump to it
- [ ] Show current chapter highlighted
- [ ] Show chapter progress (played/unplayed)
- [ ] Chapter durations
- [ ] Collapse/expand chapter list

**UI Location:** 
- Swipe up from full player → Chapter list sheet

**Files to Create/Modify:**
- `src/components/ChapterList.jsx` (NEW)
- `src/components/FullPlayer.jsx` (MODIFY - add chapter UI)

**Estimated Time:** 1 day

---

### **2.4 Loyal Books API Integration** 🟢 EASY
**Goal:** Add another free audiobook source

**API Info:**
- Base: `http://www.loyalbooks.com/feed/`
- Format: RSS/JSON
- Coverage: ~7,000 audiobooks (mirrors LibriVox mostly)

**Implementation:**
- [ ] Create `src/api/loyal-books-api.js`
- [ ] Add to unified search in `audiobook-api.js`
- [ ] Normalize data format
- [ ] Add to multi-source display

**Files to Create/Modify:**
- `src/api/loyal-books-api.js` (NEW)
- `src/api/audiobook-api.js` (MODIFY - add Loyal Books)

**Estimated Time:** 1 day

---

### **2.5 Project Gutenberg Integration** 🟢 EASY
**Goal:** Add text + some audio books

**API Info:**
- Base: `https://gutendex.com/`
- Free, no key required
- Mostly text, some have audio versions

**Implementation:**
- [ ] Create `src/api/gutenberg-api.js`
- [ ] Filter for books with audio
- [ ] Add to unified search
- [ ] Link to audio files

**Files to Create/Modify:**
- `src/api/gutenberg-api.js` (NEW)
- `src/api/audiobook-api.js` (MODIFY)

**Estimated Time:** 1 day

---

### **2.6 Genre/Category System** 🟡 HIGH
**Goal:** Browse by genre, not just search

**Categories to Add:**
- Fiction
  - Mystery & Thriller
  - Romance
  - Science Fiction
  - Fantasy
  - Historical Fiction
  - Literary Fiction
- Non-Fiction
  - Biography & Memoir
  - History
  - Philosophy
  - Science & Nature
  - Self-Help
  - Religion & Spirituality
- Poetry
- Drama & Plays
- Children's Literature
- Young Adult
- Classics
- Short Stories
- Languages (English, Spanish, French, German, etc.)

**Implementation:**
- [ ] Add genre filtering to API calls
- [ ] Create genre landing pages
- [ ] Add genre tags to book cards
- [ ] Create "Browse by Genre" section on home
- [ ] Add genre filter to search

**Files to Create/Modify:**
- `src/views/GenreView.jsx` (NEW)
- `src/components/GenreGrid.jsx` (NEW)
- `src/utils/constants.js` (MODIFY - add genres)
- `src/api/audiobook-api.js` (MODIFY - genre filtering)

**Estimated Time:** 2 days

---

### **2.7 UI Bug Fixes** 🔴 CRITICAL
**Issues:**
- [ ] Dark mode: Arrow button not visible (FullPlayer.jsx)
- [ ] Replace emojis with SVG icons where needed (except nav)
- [ ] Add info (i) button to book cards
- [ ] Improve touch target sizes

**Files to Modify:**
- `src/components/FullPlayer.jsx`
- `src/components/BookCard.jsx`
- `src/styles/mobile-design.css`

**Estimated Time:** 0.5 days

---

## 🚀 PHASE 3: ADVANCED SOURCES & FEATURES

### **3.1 BBC Sounds Integration** 🟠 RESEARCH NEEDED
**Status:** Investigating feasibility

**What we want:**
- Radio dramas (full cast productions)
- Documentaries
- Classic adaptations

**Challenges:**
- No official public API
- Geo-restrictions (UK only)
- Legal/TOS concerns

**Research Tasks:**
- [ ] Check if BBC has any public RSS feeds
- [ ] Look for public domain BBC content on Internet Archive
- [ ] Investigate web scraping (legal implications)
- [ ] Check if VPN + API calls violate TOS
- [ ] Alternative: Link to BBC content without hosting

**Decision Point:** Implement only if legal & feasible

---

### **3.2 Podcast Features** 🟢 APPROVED
**Goal:** Add podcast-style functionality

**Why:** Audiobooks and podcasts are similar media types

**Features to Add:**
- [ ] RSS feed support for podcast-style audiobooks
- [ ] Episode-style navigation (for serialized content)
- [ ] Auto-download new "episodes"
- [ ] Podcast-specific UI (episode art, show notes)
- [ ] Subscribe to series

**Use Cases:**
- Serialized audiobook releases
- Educational lecture series
- Story podcasts (Storynory)
- BBC radio dramas (if we can access them)

**APIs to Integrate:**
- [ ] iTunes Podcast API (free, no key)
- [ ] Podcast Index API (free, open)
- [ ] RSS parsers for direct feeds

**Files to Create:**
- `src/api/podcast-api.js` (NEW)
- `src/components/PodcastPlayer.jsx` (NEW)
- `src/views/PodcastView.jsx` (NEW)

**Estimated Time:** 3 days

---

### **3.3 Audiobook Bay Integration** ⚠️ GRAY AREA
**Status:** Portfolio project - coolness factor approved

**What it is:**
- Community-uploaded audiobooks
- Mix of public domain + copyrighted (gray area)
- Torrent-based downloads

**Approach:**
- [ ] Only link to public domain content
- [ ] Use as metadata source (ratings, reviews)
- [ ] Don't host or distribute copyrighted files
- [ ] Add disclaimer: "External links, use at own risk"

**Implementation:**
- [ ] Web scraping (no API exists)
- [ ] Parse search results
- [ ] Display as "Also available on: Audiobook Bay"
- [ ] External link only (don't download/stream directly)

**Legal Protection:**
- Linking (not hosting) is generally legal
- User clicks external link = user's choice
- Similar to how Google links to piracy sites

**Files to Create:**
- `src/api/audiobook-bay-scraper.js` (NEW)
- Add to multi-source display

**Estimated Time:** 2 days

---

### **3.4 Storynory Integration** 🟢 EASY
**Goal:** Add original kids' audiobooks

**API Info:**
- RSS feed available
- Free, original stories
- Great for children's section

**Implementation:**
- [ ] Parse RSS feed
- [ ] Add to children's category
- [ ] Tag as "Original Story"

**Files to Create:**
- `src/api/storynory-api.js` (NEW)

**Estimated Time:** 0.5 days

---

### **3.5 Lit2Go Integration** 🟢 EASY
**Goal:** Educational audiobooks

**API Info:**
- University of South Florida project
- Free educational audiobooks
- Good for students

**Implementation:**
- [ ] Parse their catalog
- [ ] Add to educational category
- [ ] Good metadata available

**Files to Create:**
- `src/api/lit2go-api.js` (NEW)

**Estimated Time:** 0.5 days

---

## 📚 PHASE 4: DISCOVERABILITY & CURATION

### **4.1 Curated Collections** 🟡 HIGH
**Goal:** Hand-picked audiobook lists

**Collections:**
- [ ] Brewbooks Picks (staff favorites)
- [ ] Trending This Week
- [ ] Classic Must-Reads
- [ ] Hidden Gems
- [ ] Best Narrations
- [ ] Short Listens (< 2 hours)
- [ ] Epic Adventures (> 20 hours)
- [ ] Cozy Mysteries
- [ ] Philosophy 101
- [ ] Language Learning

**Implementation:**
- Create JSON file with curated book IDs
- Display on home page
- Horizontal scrollable sections

**Files to Create:**
- `src/data/collections.json` (NEW)
- `src/components/CollectionRow.jsx` (NEW)

**Estimated Time:** 1 day

---

### **4.2 Search Filters & Sorting** 🟡 HIGH
**Filters:**
- [ ] Genre/Category
- [ ] Language
- [ ] Duration (< 1hr, 1-5hr, 5-10hr, 10hr+)
- [ ] Narrator
- [ ] Source (LibriVox, Archive, etc.)
- [ ] Completed (yes/no)

**Sort Options:**
- [ ] Most Popular
- [ ] Recently Added
- [ ] A-Z (Title)
- [ ] A-Z (Author)
- [ ] Shortest First
- [ ] Longest First

**Files to Modify:**
- `src/views/SearchView.jsx`
- `src/components/FilterSheet.jsx` (NEW)

**Estimated Time:** 2 days

---

### **4.3 Author Pages** 🟡 HIGH
**Goal:** Browse all books by specific author

**Features:**
- [ ] Author bio (from Open Library)
- [ ] Author photo
- [ ] List all books by author
- [ ] Related authors

**Files to Create:**
- `src/views/AuthorView.jsx` (NEW)
- `src/api/audiobook-api.js` (MODIFY - author search)

**Estimated Time:** 1 day

---

### **4.4 Recommendation Engine** 🟠 MEDIUM
**Goal:** "You might also like..."

**Approach (Client-Side):**
- Based on listening history
- Genre matching
- Author matching
- Similar books (from Open Library)

**Advanced (Future - Requires Backend):**
- Collaborative filtering
- ML-based recommendations

**Files to Create:**
- `src/utils/recommendations.js` (NEW)
- `src/components/RecommendedBooks.jsx` (NEW)

**Estimated Time:** 2 days

---

## 🎨 PHASE 5: POWER USER FEATURES

### **5.1 Download for Offline** 🔴 CRITICAL
**Goal:** Listen without internet

**Implementation:**
- [ ] Use Service Worker + Cache API
- [ ] Download book chapters to IndexedDB
- [ ] Show download progress
- [ ] Manage storage (delete downloads)
- [ ] Offline indicator

**Files to Create:**
- `src/service-worker.js` (NEW)
- `src/utils/download-manager.js` (NEW)
- `src/components/DownloadButton.jsx` (NEW)

**Estimated Time:** 3 days

---

### **5.2 Playlists** 🟡 HIGH
**Goal:** Create custom book collections

**Features:**
- [ ] Create/edit/delete playlists
- [ ] Add books to playlists
- [ ] Reorder playlist items
- [ ] Play entire playlist
- [ ] Share playlists (export JSON)

**Files to Create:**
- `src/views/PlaylistView.jsx` (NEW)
- `src/components/PlaylistManager.jsx` (NEW)
- `src/utils/storage.js` (MODIFY - playlist CRUD)

**Estimated Time:** 2 days

---

### **5.3 Sleep Timer** 🟢 EASY
**Goal:** Auto-pause after X minutes

**Features:**
- [ ] Set timer (5, 10, 15, 30, 60 mins, end of chapter)
- [ ] Show countdown
- [ ] Fade out audio
- [ ] Cancel timer

**Files to Modify:**
- `src/contexts/PlayerContext.jsx`
- `src/components/FullPlayer.jsx` (add timer UI)

**Estimated Time:** 0.5 days

---

### **5.4 Playback Queue** 🟡 HIGH
**Goal:** See & manage upcoming books/chapters

**Features:**
- [ ] View queue
- [ ] Reorder queue
- [ ] Remove from queue
- [ ] Clear queue
- [ ] Add to queue from detail page

**Files to Create:**
- `src/components/QueueSheet.jsx` (NEW)
- `src/contexts/PlayerContext.jsx` (MODIFY - queue state)

**Estimated Time:** 1 day

---

### **5.5 Listening Statistics** 🟢 EASY
**Goal:** Track listening habits

**Stats:**
- [ ] Total hours listened
- [ ] Books completed
- [ ] Favorite genres
- [ ] Longest book
- [ ] Listening streak
- [ ] Weekly/monthly charts

**Files to Create:**
- `src/views/StatsView.jsx` (NEW)
- `src/utils/storage.js` (MODIFY - track stats)

**Estimated Time:** 1 day

---

### **5.6 Chapter Bookmarks** 🟠 MEDIUM
**Goal:** Mark favorite moments

**Features:**
- [ ] Add bookmark at current time
- [ ] Name/note for bookmark
- [ ] Jump to bookmark
- [ ] List all bookmarks
- [ ] Export bookmarks

**Files to Create:**
- `src/components/BookmarkManager.jsx` (NEW)
- `src/utils/storage.js` (MODIFY)

**Estimated Time:** 1.5 days

---

## 🎭 PHASE 6: POLISH & COMMUNITY

### **6.1 Community Ratings** 🟠 MEDIUM
**Goal:** User reviews & ratings

**Approach (No Backend):**
- Store ratings in localStorage
- Aggregate ratings client-side
- Export/import rating data

**Future (With Backend):**
- Central rating database
- User reviews
- Helpful votes

**Files to Create:**
- `src/components/RatingWidget.jsx` (NEW)
- `src/utils/storage.js` (MODIFY)

**Estimated Time:** 1 day

---

### **6.2 Share Functionality** 🟢 EASY
**Goal:** Share books with friends

**Share Options:**
- [ ] Copy link
- [ ] Share to social media
- [ ] Generate listening progress card (image)
- [ ] Share playlist

**Implementation:**
- Use Web Share API
- Generate shareable URLs
- Create Open Graph meta tags

**Files to Create:**
- `src/utils/share.js` (NEW)
- `src/components/ShareButton.jsx` (NEW)

**Estimated Time:** 0.5 days

---

### **6.3 Accessibility Improvements** 🟡 HIGH
**Goal:** WCAG AA compliance

**Features:**
- [ ] Full keyboard navigation
- [ ] Screen reader optimization
- [ ] ARIA labels everywhere
- [ ] High contrast mode
- [ ] Dyslexia-friendly font option
- [ ] Font size controls
- [ ] Reduce motion option

**Files to Modify:**
- All components (add ARIA)
- `src/styles/mobile-design.css` (accessibility modes)

**Estimated Time:** 2 days

---

### **6.4 PWA Installation** 🟡 HIGH
**Goal:** "Add to Home Screen" prompt

**Features:**
- [ ] Web app manifest
- [ ] Service worker
- [ ] Install prompt
- [ ] App icons (multiple sizes)
- [ ] Splash screens

**Files to Create:**
- `public/manifest.json` (NEW)
- `public/icons/` (NEW - multiple sizes)
- `src/components/InstallPrompt.jsx` (NEW)

**Estimated Time:** 1 day

---

### **6.5 Performance Optimization** 🟠 MEDIUM
**Goal:** Lightning-fast app

**Optimizations:**
- [ ] Code splitting
- [ ] Lazy load routes
- [ ] Image optimization
- [ ] Virtual scrolling (large lists)
- [ ] Debounced search
- [ ] Memoization
- [ ] Bundle size analysis

**Files to Modify:**
- `vite.config.js` (optimization settings)
- All components (React.memo, useMemo)

**Estimated Time:** 2 days

---

## 📝 ADDITIONAL FEATURES (Future Considerations)

### **Nice to Have:**
- [ ] Dark/Light/Auto theme (system preference)
- [ ] Export listening history (CSV/JSON)
- [ ] Sync across devices (requires backend)
- [ ] CarPlay/Android Auto (PWA limitation)
- [ ] Home screen widget
- [ ] Browser extension
- [ ] Desktop app (Electron)
- [ ] Voice commands
- [ ] Chromecast support
- [ ] Variable speed per book
- [ ] Equalizer presets
- [ ] Reading mode (show text while listening)
- [ ] Translation support
- [ ] Chapter summaries (AI-generated)
- [ ] Author interviews (if available)
- [ ] Book clubs feature
- [ ] Gift audiobooks (share downloads)

---

## 🔬 RESEARCH TASKS

### **BBC Sounds Deep Dive**
**Goal:** Determine if we can legally access BBC content

**Research Questions:**
- [ ] Does BBC have any public domain content?
- [ ] Can we scrape BBC Sounds legally?
- [ ] Are there BBC shows on Internet Archive?
- [ ] What's their TOS on API access?
- [ ] Any RSS feeds available?
- [ ] Can we link to BBC content without embedding?

**Decision Criteria:**
- Must be legal
- Must not violate TOS
- Preferably no geo-restrictions workaround

**Status:** PENDING RESEARCH

---

### **Podcast Integration Research**
**Goal:** Best way to add podcast features

**Questions:**
- [ ] Which podcast APIs are best?
- [ ] How to handle RSS feeds?
- [ ] Auto-update new episodes?
- [ ] Podcast-specific UI patterns?

**Recommended APIs:**
1. iTunes Podcast Search API (free)
2. Podcast Index (open, free)
3. ListenNotes (freemium)

**Status:** APPROVED - Research specific implementation

---

## 📊 METRICS & SUCCESS CRITERIA

### **Performance Targets:**
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Bundle size < 500KB (gzipped)
- [ ] Lighthouse score > 90

### **Feature Completeness:**
- [ ] All critical features implemented
- [ ] All high-priority features implemented
- [ ] 50%+ medium-priority features
- [ ] Documentation complete

### **Quality:**
- [ ] Zero critical bugs
- [ ] < 5 known minor bugs
- [ ] 95%+ mobile usability score
- [ ] WCAG AA compliance

---

## 🗓️ ESTIMATED TIMELINE

### **Phase 2 (Core Experience):** 2 weeks
- Book detail page: 2 days
- Multi-chapter playback: 3 days
- Chapter navigation: 1 day
- Loyal Books API: 1 day
- Project Gutenberg: 1 day
- Genre system: 2 days
- UI fixes: 0.5 days
- Buffer: 2.5 days

### **Phase 3 (Advanced Sources):** 2 weeks
- BBC research: 2 days
- Podcast features: 3 days
- Audiobook Bay: 2 days
- Storynory: 0.5 days
- Lit2Go: 0.5 days
- Integration testing: 2 days
- Buffer: 4 days

### **Phase 4 (Discoverability):** 1 week
- Collections: 1 day
- Search filters: 2 days
- Author pages: 1 day
- Recommendations: 2 days
- Testing: 1 day

### **Phase 5 (Power Features):** 2 weeks
- Offline downloads: 3 days
- Playlists: 2 days
- Sleep timer: 0.5 days
- Queue: 1 day
- Stats: 1 day
- Bookmarks: 1.5 days
- Testing: 2 days
- Buffer: 3 days

### **Phase 6 (Polish):** 1 week
- Ratings: 1 day
- Share: 0.5 days
- Accessibility: 2 days
- PWA: 1 day
- Performance: 2 days
- Final testing: 0.5 days

**Total Estimated Time:** 8 weeks (2 months)

---

## 🏁 DEFINITION OF DONE

A feature is "done" when:
- [ ] Code implemented and tested
- [ ] Works on mobile (iOS Safari, Chrome Android)
- [ ] Works in light and dark modes
- [ ] No console errors
- [ ] Accessibility verified
- [ ] Documented in code comments
- [ ] User-facing docs updated (if needed)
- [ ] Committed to GitHub
- [ ] Deployed to GitHub Pages
- [ ] Verified on live site

---

## 📞 NEXT ACTIONS

### **Immediate (This Week):**
1. Research BBC Sounds feasibility
2. Start Book Detail Modal implementation
3. Begin Multi-Chapter Playback work

### **This Month:**
1. Complete Phase 2 (Core Experience)
2. Start Phase 3 (Advanced Sources)

### **This Quarter:**
1. Complete Phases 2-4
2. Begin Phase 5 (Power Features)

---

## 🤝 COLLABORATION NOTES

**Decision Making:**
- Major features: Discuss before implementing
- Minor features: Build and iterate
- Experimental: Mark as [BETA] in UI

**Code Standards:**
- Mobile-first always
- Coffee theme consistency
- Modular architecture
- Comment complex logic
- Use meaningful variable names

**Testing:**
- Test on real mobile devices
- Check both light/dark modes
- Verify on slow connections
- Test offline scenarios

---

**Last Updated:** February 11, 2025
**Next Review:** February 18, 2025 (weekly)
**Status:** Phase 1 Complete ✅ | Phase 2 Starting 🚀
