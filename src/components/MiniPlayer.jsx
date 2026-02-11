import React from 'react';
import { usePlayer } from '../contexts/PlayerContext.jsx';

const MiniPlayer = ({ onExpand }) => {
  const { currentBook, isPlaying, togglePlayPause, currentTime, duration } = usePlayer();

  if (!currentBook) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      onClick={onExpand}
      style={{
        position: 'fixed',
        bottom: 'var(--navbar-height)',
        left: 0,
        right: 0,
        height: 'var(--player-height)',
        background: 'var(--surface-elevated)',
        borderTop: '1px solid var(--border)',
        cursor: 'pointer',
        zIndex: 99,
        boxShadow: 'var(--shadow-xl)'
      }}
    >
      {/* Progress Bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'var(--bg-tertiary)'
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'var(--accent)',
          transition: 'width 0.1s linear'
        }} />
      </div>

      {/* Content */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-3) var(--space-4)',
        height: '100%'
      }}>
        {/* Cover */}
        {currentBook.coverUrl ? (
          <img
            src={currentBook.coverUrl}
            alt={currentBook.title}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-sm)',
              objectFit: 'cover',
              flexShrink: 0
            }}
          />
        ) : (
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            flexShrink: 0
          }}>
            📖
          </div>
        )}

        {/* Info */}
        <div style={{ 
          flex: 1, 
          minWidth: 0,
          marginRight: 'var(--space-2)'
        }}>
          <div style={{
            fontSize: '0.9375rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginBottom: 'var(--space-1)'
          }}>
            {currentBook.title}
          </div>
          <div style={{
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {currentBook.author}
          </div>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlayPause();
          }}
          className="btn-icon"
          style={{
            background: 'var(--accent)',
            color: 'var(--surface)',
            border: 'none',
            fontSize: '1.25rem',
            flexShrink: 0
          }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>
    </div>
  );
};

export default MiniPlayer;
