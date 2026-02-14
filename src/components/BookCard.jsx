import React, { useState } from 'react';
import { usePlayer } from '../contexts/PlayerContext.jsx';
import { storage } from '../utils/storage.js';
import { matchGenre } from '../utils/genres.js';

const BookCard = ({ book, layout = 'grid', onShowDetail }) => {
  const { playBook, currentBook, isPlaying } = usePlayer();
  const [isBookmarked, setIsBookmarked] = useState(
    storage.isBookmarked(book.id)
  );

  const isCurrentBook = currentBook?.id === book.id;
  const genre = matchGenre(book.genre);

  const handleCardClick = () => {
    if (onShowDetail) {
      onShowDetail(book);
    }
  };

  const handlePlay = (e) => {
    e.stopPropagation();
    playBook(book);
  };

  const toggleBookmark = (e) => {
    e.stopPropagation();
    if (isBookmarked) {
      storage.removeBookmark(book.id);
      setIsBookmarked(false);
    } else {
      storage.addBookmark(book);
      setIsBookmarked(true);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  // List layout (for search results, etc.)
  if (layout === 'list') {
    return (
      <div 
        className="card card-clickable"
        onClick={handleCardClick}
        style={{
          display: 'flex',
          gap: 'var(--space-3)',
          padding: 'var(--space-3)'
        }}
      >
        {/* Cover */}
        <div style={{
          position: 'relative',
          width: '80px',
          height: '80px',
          flexShrink: 0
        }}>
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={book.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 'var(--radius-sm)'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem'
            }}>
              📖
            </div>
          )}

          {isCurrentBook && (
            <div style={{
              position: 'absolute',
              bottom: '4px',
              left: '4px',
              right: '4px',
              background: 'var(--accent)',
              color: 'var(--surface)',
              fontSize: '0.625rem',
              fontWeight: 600,
              padding: '2px 4px',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              {isPlaying ? '▶' : '⏸'}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontSize: '0.9375rem',
            fontWeight: 600,
            marginBottom: 'var(--space-1)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {book.title}
          </h3>

          <p style={{
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-2)'
          }}>
            {book.author}
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {book.genre && (
              <span className="badge" style={{ fontSize: '0.6875rem' }}>
                {book.genre}
              </span>
            )}
            {book.duration > 0 && (
              <span className="badge" style={{ fontSize: '0.6875rem' }}>
                ⏱ {formatDuration(book.duration)}
              </span>
            )}
          </div>
        </div>

        {/* Bookmark */}
        <button
          onClick={toggleBookmark}
          className="btn-icon"
          style={{
            alignSelf: 'flex-start',
            fontSize: '1.25rem',
            background: 'transparent',
            border: 'none'
          }}
        >
          {isBookmarked ? '🔖' : '📑'}
        </button>
      </div>
    );
  }

  // Grid layout (default)
  return (
    <div 
      className="card card-clickable"
      onClick={handleCardClick}
      style={{
        padding: 0,
        overflow: 'hidden',
        height: '280px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Cover */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '100%', // Square like PodcastCard
        background: 'var(--surface-secondary)',
        overflow: 'hidden'
      }}>
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            color: 'var(--text-tertiary)'
          }}>
            📖
          </div>
        )}

        {/* Bookmark button */}
        <button
          onClick={toggleBookmark}
          style={{
            position: 'absolute',
            top: 'var(--space-2)',
            right: 'var(--space-2)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.95)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.125rem',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          {isBookmarked ? '🔖' : '📑'}
        </button>

        {/* Original Story Badge (Storynory) */}
        {book.isOriginal && (
          <div style={{
            position: 'absolute',
            top: 'var(--space-2)',
            left: 'var(--space-2)',
            padding: '2px 6px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent)',
            color: 'white',
            fontSize: '0.625rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: 'var(--shadow-md)'
          }}>
            Original
          </div>
        )}

        {/* Educational Badge (Lit2Go) */}
        {book.isEducational && !book.isOriginal && (
          <div style={{
            position: 'absolute',
            top: 'var(--space-2)',
            left: 'var(--space-2)',
            padding: '2px 6px',
            borderRadius: 'var(--radius-sm)',
            background: '#1976d2',
            color: 'white',
            fontSize: '0.625rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: 'var(--shadow-md)'
          }}>
            Educational
          </div>
        )}

        {/* Full-Cast Badge (BBC Radio) */}
        {book.isFullCast && !book.isOriginal && !book.isEducational && (
          <div style={{
            position: 'absolute',
            top: 'var(--space-2)',
            left: 'var(--space-2)',
            padding: '2px 6px',
            borderRadius: 'var(--radius-sm)',
            background: '#7b1fa2',
            color: 'white',
            fontSize: '0.625rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: 'var(--shadow-md)'
          }}>
            Full-Cast
          </div>
        )}

        {/* Now Playing */}
        {isCurrentBook && (
          <div style={{
            position: 'absolute',
            bottom: 'var(--space-2)',
            left: 'var(--space-2)',
            right: 'var(--space-2)',
            background: 'var(--accent)',
            color: 'var(--surface)',
            padding: 'var(--space-2)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            fontWeight: 600,
            textAlign: 'center'
          }}>
            {isPlaying ? '▶ Playing' : '⏸ Paused'}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ 
        padding: 'var(--space-3)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h3 style={{
          fontSize: '0.875rem',
          fontWeight: 600,
          marginBottom: 'var(--space-1)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          lineHeight: 1.3
        }}>
          {book.title}
        </h3>

        <p className="text-secondary" style={{
          fontSize: '0.75rem',
          marginBottom: 'var(--space-2)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {book.author}
        </p>

        {book.duration > 0 && (
          <p className="text-tertiary" style={{
            fontSize: '0.6875rem',
            marginTop: 'auto'
          }}>
            ⏱ {formatDuration(book.duration)}
          </p>
        )}
      </div>
    </div>
  );
};

export default BookCard;