import React from 'react';
import { usePlayer } from '../contexts/PlayerContext.jsx';

const ChapterList = ({ isOpen, onClose }) => {
  const { chapters, currentChapterIndex, playChapter } = usePlayer();

  if (!isOpen || chapters.length === 0) return null;

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: '70vh',
        background: 'var(--surface-elevated)',
        borderTopLeftRadius: 'var(--radius-xl)',
        borderTopRightRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-xl)',
        zIndex: 3000,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideUp 0.3s ease-out'
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-4)',
          borderBottom: '1px solid var(--border)',
          position: 'sticky',
          top: 0,
          background: 'var(--surface-elevated)',
          borderTopLeftRadius: 'var(--radius-xl)',
          borderTopRightRadius: 'var(--radius-xl)'
        }}
      >
        {/* Drag Handle */}
        <div
          style={{
            position: 'absolute',
            top: 'var(--space-2)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '40px',
            height: '4px',
            background: 'var(--border)',
            borderRadius: '2px'
          }}
        />

        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginTop: 'var(--space-2)' }}>
          Chapters ({chapters.length})
        </h3>

        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '1.5rem',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: 'var(--space-2)',
            marginTop: 'var(--space-2)'
          }}
        >
          ✕
        </button>
      </div>

      {/* Chapter List */}
      <div
        style={{
          overflowY: 'auto',
          flex: 1,
          paddingBottom: 'max(var(--space-4), var(--safe-area-bottom))'
        }}
      >
        {chapters.map((chapter, index) => {
          const isActive = index === currentChapterIndex;

          return (
            <button
              key={chapter.id}
              onClick={() => {
                playChapter(index);
                onClose();
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-4)',
                background: isActive ? 'var(--accent-primary)' : 'transparent',
                color: isActive ? 'var(--surface)' : 'var(--text-primary)',
                border: 'none',
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition-fast)'
              }}
            >
              {/* Chapter Number */}
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: isActive ? 'var(--surface)' : 'var(--bg-tertiary)',
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  flexShrink: 0
                }}
              >
                {isActive ? '▶' : chapter.number}
              </div>

              {/* Chapter Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.9375rem',
                    marginBottom: 'var(--space-1)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {chapter.title}
                </div>
                {chapter.reader && (
                  <div
                    style={{
                      fontSize: '0.8125rem',
                      opacity: isActive ? 0.9 : 0.7
                    }}
                  >
                    {chapter.reader}
                  </div>
                )}
              </div>

              {/* Duration */}
              {chapter.duration > 0 && (
                <div
                  style={{
                    fontSize: '0.8125rem',
                    opacity: isActive ? 0.9 : 0.7,
                    fontFamily: 'monospace'
                  }}
                >
                  {formatDuration(chapter.duration)}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ChapterList;
