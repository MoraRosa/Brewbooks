import React, { useState } from 'react';
import { usePlayer } from '../contexts/PlayerContext.jsx';
import ChapterList from './ChapterList.jsx';

const FullPlayer = ({ isOpen, onClose }) => {
  const {
    currentBook,
    isPlaying,
    currentTime,
    duration,
    volume,
    playbackSpeed,
    togglePlayPause,
    seek,
    skipForward,
    skipBackward,
    setVolume,
    setPlaybackSpeed,
    chapters,
    currentChapterIndex,
    nextChapter,
    previousChapter,
    getCurrentChapter
  } = usePlayer();

  const [showChapters, setShowChapters] = useState(true); // Default open!

  if (!isOpen || !currentBook) return null;

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    seek(newTime);
  };

  const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'var(--bg-primary)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-4)',
        paddingTop: 'max(var(--space-4), var(--safe-area-top))',
        borderBottom: '1px solid var(--border)'
      }}>
        <button
          onClick={onClose}
          className="btn-icon"
          style={{ 
            background: 'transparent', 
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '1.5rem'
          }}
        >
          ↓
        </button>
        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
          Now Playing
        </span>
        <div style={{ width: '44px' }} /> {/* Spacer */}
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--space-6) var(--space-4)',
        paddingBottom: 'max(var(--space-6), var(--safe-area-bottom))'
      }}>
        {/* Cover Art */}
        <div style={{
          width: '100%',
          maxWidth: '400px',
          margin: '0 auto var(--space-8)',
          aspectRatio: '1',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)'
        }}>
          {currentBook.coverUrl ? (
            <img
              src={currentBook.coverUrl}
              alt={currentBook.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '6rem'
            }}>
              📖
            </div>
          )}
        </div>

        {/* Book Info */}
        <div style={{ 
          textAlign: 'center',
          marginBottom: 'var(--space-8)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: 'var(--space-2)',
            lineHeight: 1.3
          }}>
            {currentBook.title}
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)'
          }}>
            {currentBook.author}
          </p>

          {/* Chapter/Episode Info */}
          {chapters.length > 0 && (
            <button
              onClick={() => setShowChapters(!showChapters)}
              className="btn"
              style={{
                marginTop: 'var(--space-3)',
                fontSize: '0.875rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}
            >
              {chapters.length > 1 ? (
                <>
                  📚 Chapter {currentChapterIndex + 1} of {chapters.length}
                  {getCurrentChapter()?.title && (
                    <span style={{ opacity: 0.7 }}>
                      • {getCurrentChapter().title}
                    </span>
                  )}
                </>
              ) : (
                <>📚 {currentBook.isPodcast ? 'Episode' : 'Chapter'}</>
              )}
              <span style={{ marginLeft: 'auto' }}>
                {showChapters ? '▼' : '▶'}
              </span>
            </button>
          )}
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div
            onClick={handleSeek}
            style={{
              height: '6px',
              background: 'var(--bg-tertiary)',
              borderRadius: '3px',
              cursor: 'pointer',
              marginBottom: 'var(--space-3)'
            }}
          >
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'var(--accent)',
              borderRadius: '3px',
              transition: 'width 0.1s linear'
            }} />
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            fontFamily: 'monospace'
          }}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-8)'
        }}>
          <button
            onClick={chapters.length > 1 ? previousChapter : () => skipBackward(15)}
            className="btn-icon"
            style={{
              width: '56px',
              height: '56px',
              fontSize: '0.875rem'
            }}
            title={chapters.length > 1 ? "Previous chapter" : "Skip back 15s"}
          >
            {chapters.length > 1 ? '⏮' : '⏮ 15'}
          </button>

          <button
            onClick={togglePlayPause}
            className="btn-icon"
            style={{
              width: '72px',
              height: '72px',
              fontSize: '1.75rem',
              background: 'var(--accent)',
              color: 'var(--surface)',
              border: 'none'
            }}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          <button
            onClick={chapters.length > 1 ? nextChapter : () => skipForward(30)}
            className="btn-icon"
            style={{
              width: '56px',
              height: '56px',
              fontSize: '0.875rem'
            }}
            title={chapters.length > 1 ? "Next chapter" : "Skip forward 30s"}
          >
            {chapters.length > 1 ? '⏭' : '30 ⏭'}
          </button>
        </div>

        {/* Speed & Volume */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-6)'
        }}>
          {/* Speed */}
          <div>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-3)'
            }}>
              Playback Speed
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

          {/* Volume */}
          <div>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-3)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>Volume</span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)'
            }}>
              <span style={{ fontSize: '1.25rem' }}>🔈</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                style={{ 
                  flex: 1,
                  height: '6px',
                  borderRadius: '3px'
                }}
              />
              <span style={{ fontSize: '1.25rem' }}>🔊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inline Chapter List */}
      {showChapters && chapters.length > 0 && (
        <div style={{
          padding: 'var(--space-4)',
          paddingTop: 0,
          maxHeight: '40vh',
          overflowY: 'auto'
        }}>
          <h3 style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-3)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {currentBook.isPodcast ? 'Episode' : `${chapters.length} Chapters`}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {chapters.map((chapter, index) => {
              const isActive = index === currentChapterIndex;
              const formatDuration = (seconds) => {
                if (!seconds) return '';
                const hours = Math.floor(seconds / 3600);
                const minutes = Math.floor((seconds % 3600) / 60);
                if (hours > 0) return `${hours}h ${minutes}m`;
                return `${minutes}m`;
              };

              return (
                <button
                  key={chapter.id}
                  onClick={() => {
                    playChapter(index);
                  }}
                  className="card card-clickable"
                  style={{
                    padding: 'var(--space-3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    background: isActive ? 'var(--accent)' : 'var(--surface)',
                    color: isActive ? 'var(--surface)' : 'var(--text-primary)',
                    border: 'none',
                    textAlign: 'left'
                  }}
                >
                  <div style={{
                    fontSize: '1.5rem',
                    flexShrink: 0
                  }}>
                    {isActive ? '▶' : `${index + 1}`}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      marginBottom: '2px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {chapter.title}
                    </div>
                    {chapter.duration > 0 && (
                      <div style={{
                        fontSize: '0.75rem',
                        opacity: 0.7
                      }}>
                        {formatDuration(chapter.duration)}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FullPlayer;