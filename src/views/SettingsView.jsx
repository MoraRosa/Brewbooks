import React from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { usePlayer } from '../contexts/PlayerContext.jsx';
import { storage } from '../utils/storage.js';

const SettingsView = () => {
  const { theme, toggleTheme } = useTheme();
  const { playbackSpeed, setPlaybackSpeed } = usePlayer();

  const handleClearData = () => {
    if (confirm('Clear all app data? This cannot be undone.')) {
      storage.clearAll();
      window.location.reload();
    }
  };

  const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

  return (
    <div className="view">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ 
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: 'var(--space-2)'
          }}>
            Settings
          </h1>
          <p className="text-secondary" style={{ fontSize: '0.9375rem' }}>
            Customize your experience
          </p>
        </div>

        {/* Settings Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Appearance */}
          <section className="card">
            <h2 style={{ 
              fontSize: '1.125rem',
              fontWeight: 600,
              marginBottom: 'var(--space-4)'
            }}>
              Appearance
            </h2>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 500, marginBottom: 'var(--space-1)' }}>
                  Theme
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {theme === 'light' ? 'Light mode' : 'Dark mode'}
                </div>
              </div>

              <button
                onClick={toggleTheme}
                className="btn"
                style={{ fontSize: '1.5rem' }}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>
          </section>

          {/* Playback */}
          <section className="card">
            <h2 style={{ 
              fontSize: '1.125rem',
              fontWeight: 600,
              marginBottom: 'var(--space-4)'
            }}>
              Playback
            </h2>

            <div>
              <div style={{ 
                fontWeight: 500, 
                marginBottom: 'var(--space-3)' 
              }}>
                Default Speed: {playbackSpeed}×
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 'var(--space-2)'
              }}>
                {speeds.map(speed => (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className="btn"
                    style={{
                      background: playbackSpeed === speed ? 'var(--accent)' : 'var(--surface)',
                      color: playbackSpeed === speed ? 'var(--surface)' : 'var(--text-primary)',
                      borderColor: playbackSpeed === speed ? 'var(--accent)' : 'var(--border)',
                      fontSize: '0.875rem',
                      padding: 'var(--space-2)'
                    }}
                  >
                    {speed}×
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* About */}
          <section className="card">
            <h2 style={{ 
              fontSize: '1.125rem',
              fontWeight: 600,
              marginBottom: 'var(--space-4)'
            }}>
              About
            </h2>

            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 'var(--space-3)',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)'
            }}>
              <div>
                <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
                  Brewbooks
                </div>
                Your daily brew of classic stories ☕📖
              </div>

              <div>
                <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
                  Version
                </div>
                1.0.0
              </div>

              <div>
                <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
                  Audio Sources
                </div>
                LibriVox • Internet Archive • Open Library
              </div>

              <div>
                <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
                  All audiobooks are free and in the public domain
                </div>
                No subscription required. No ads. No tracking.
              </div>
            </div>
          </section>

          {/* Data Management */}
          <section className="card">
            <h2 style={{ 
              fontSize: '1.125rem',
              fontWeight: 600,
              marginBottom: 'var(--space-4)'
            }}>
              Data
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                All data is stored locally on your device. No account required.
              </div>

              <button
                onClick={handleClearData}
                className="btn"
                style={{
                  background: 'var(--error)',
                  color: 'var(--surface)',
                  borderColor: 'var(--error)'
                }}
              >
                Clear All Data
              </button>
            </div>
          </section>

          {/* Credits */}
          <section className="card" style={{ background: 'var(--bg-tertiary)', border: 'none' }}>
            <div style={{ 
              textAlign: 'center',
              fontSize: '0.8125rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6
            }}>
              <div style={{ marginBottom: 'var(--space-2)' }}>
                ☕ Brewbooks
              </div>
              <div style={{ marginBottom: 'var(--space-2)' }}>
                Your daily brew of classic stories
              </div>
              <div>
                Powered by LibriVox, Internet Archive & Open Library
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
