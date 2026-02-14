import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { PlayerProvider } from './contexts/PlayerContext.jsx';

import BottomNav from './components/BottomNav.jsx';
import MiniPlayer from './components/MiniPlayer.jsx';
import FullPlayer from './components/FullPlayer.jsx';

import HomeView from './views/HomeView.jsx';
import SearchView from './views/SearchView.jsx';
import GenreView from './views/GenreView.jsx';
import PodcastView from './views/PodcastView.jsx';
import LibraryView from './views/LibraryView.jsx';
import SettingsView from './views/SettingsView.jsx';

import './styles/mobile-design.css';

function AppContent() {
  const [activeView, setActiveView] = useState('home');
  const [playerExpanded, setPlayerExpanded] = useState(false);

  const views = {
    home: HomeView,
    search: SearchView,
    genres: GenreView,
    podcasts: PodcastView,
    library: LibraryView,
    settings: SettingsView
  };

  const ActiveView = views[activeView];

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* Main Content */}
      <ActiveView />

      {/* Mini Player */}
      <MiniPlayer onExpand={() => setPlayerExpanded(true)} />

      {/* Bottom Navigation */}
      <BottomNav activeView={activeView} onViewChange={setActiveView} />

      {/* Full-Screen Player */}
      <FullPlayer 
        isOpen={playerExpanded} 
        onClose={() => setPlayerExpanded(false)} 
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <PlayerProvider>
        <AppContent />
      </PlayerProvider>
    </ThemeProvider>
  );
}

export default App;