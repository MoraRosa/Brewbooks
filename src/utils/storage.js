/**
 * LocalStorage utilities for mobile app
 */

const KEYS = {
  theme: 'audiobook-theme',
  bookmarks: 'audiobook-bookmarks',
  recent: 'audiobook-recent',
  positions: 'audiobook-positions',
  settings: 'audiobook-settings'
};

export const storage = {
  // Theme
  getTheme() {
    return localStorage.getItem(KEYS.theme) || 'light';
  },

  setTheme(theme) {
    localStorage.setItem(KEYS.theme, theme);
    document.documentElement.setAttribute('data-theme', theme);
  },

  // Bookmarks
  getBookmarks() {
    try {
      const data = localStorage.getItem(KEYS.bookmarks);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addBookmark(book) {
    const bookmarks = this.getBookmarks();
    if (bookmarks.some(b => b.id === book.id)) {
      return bookmarks;
    }
    const updated = [{ ...book, bookmarkedAt: Date.now() }, ...bookmarks];
    localStorage.setItem(KEYS.bookmarks, JSON.stringify(updated));
    return updated;
  },

  removeBookmark(bookId) {
    const bookmarks = this.getBookmarks();
    const updated = bookmarks.filter(b => b.id !== bookId);
    localStorage.setItem(KEYS.bookmarks, JSON.stringify(updated));
    return updated;
  },

  isBookmarked(bookId) {
    return this.getBookmarks().some(b => b.id === bookId);
  },

  // Recently Played
  getRecent() {
    try {
      const data = localStorage.getItem(KEYS.recent);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addRecent(book) {
    let recent = this.getRecent();
    recent = recent.filter(b => b.id !== book.id);
    recent.unshift({ ...book, playedAt: Date.now() });
    recent = recent.slice(0, 50);
    localStorage.setItem(KEYS.recent, JSON.stringify(recent));
    return recent;
  },

  // Playback Positions
  getPosition(bookId) {
    try {
      const data = localStorage.getItem(KEYS.positions);
      const positions = data ? JSON.parse(data) : {};
      return positions[bookId] || 0;
    } catch {
      return 0;
    }
  },

  setPosition(bookId, position) {
    try {
      const data = localStorage.getItem(KEYS.positions);
      const positions = data ? JSON.parse(data) : {};
      positions[bookId] = position;
      localStorage.setItem(KEYS.positions, JSON.stringify(positions));
    } catch (error) {
      console.error('Failed to save position:', error);
    }
  },

  // Settings
  getSettings() {
    try {
      const data = localStorage.getItem(KEYS.settings);
      return data ? JSON.parse(data) : {
        playbackSpeed: 1.0,
        autoPlay: false,
        sleepTimer: null
      };
    } catch {
      return {
        playbackSpeed: 1.0,
        autoPlay: false,
        sleepTimer: null
      };
    }
  },

  updateSettings(settings) {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(KEYS.settings, JSON.stringify(updated));
    return updated;
  },

  clearAll() {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
  }
};
