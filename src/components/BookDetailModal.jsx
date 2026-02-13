import React, { useState, useEffect } from 'react';
import { usePlayer } from '../contexts/PlayerContext.jsx';
import { storage } from '../utils/storage.js';
import { audiobookAPI } from '../api/audiobook-api.js';

const BookDetailModal = ({ book, isOpen, onClose }) => {
  const { playBook } = usePlayer();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [fullDetails, setFullDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (book) {
      setIsBookmarked(storage.isBookmarked(book.id));
    }
  }, [book]);

  useEffect(() => {
    if (isOpen && book) {
      loadFullDetails();
    }
  }, [isOpen, book]);

  const loadFullDetails = async () => {
    setLoading(true);
    // For now, use the book data we have
    // In future, fetch additional metadata from Open Library
    setFullDetails(book);
    setLoading(false);
  };

  const toggleBookmark = () => {
    if (isBookmarked) {
      storage.removeBookmark(book.id);
      setIsBookmarked(false);
    } else {
      storage.addBookmark(book);
      setIsBookmarked(true);
    }
  };

  const handlePlay = () => {
    playBook(book);
    onClose();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: book.title,
          text: `Listen to "${book.title}" by ${book.author} on Brewbooks`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'Unknown';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (!isOpen || !book) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'var(--bg-primary)',
        zIndex: 2000,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* Header */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          background: 'var(--surface-elevated)',
          borderBottom: '1px solid var(--border)',
          padding: 'var(--space-4)',
          paddingTop: 'max(var(--space-4), var(--safe-area-top))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(var(--bg-primary-rgb), 0.95)'
        }}
      >
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '1.5rem',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: 'var(--space-2)',
            margin: '-var(--space-2)'
          }}
        >
          ↓
        </button>

        <div style={{
          display: 'flex',
          gap: 'var(--space-3)'
        }}>
          <button
            onClick={handleShare}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.25rem',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: 'var(--space-2)'
            }}
          >
            🔗
          </button>

          <button
            onClick={toggleBookmark}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.25rem',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: 'var(--space-2)'
            }}
          >
            {isBookmarked ? '🔖' : '📑'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 'var(--space-4)', paddingBottom: 'calc(var(--space-8) + var(--safe-area-bottom))' }}>
        {/* Cover Art */}
        <div
          style={{
            width: '100%',
            maxWidth: '300px',
            margin: '0 auto var(--space-6)',
            aspectRatio: '2/3',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-xl)'
          }}
        >
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={book.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'var(--bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '5rem'
              }}
            >
              📖
            </div>
          )}
        </div>

        {/* Title & Author */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              marginBottom: 'var(--space-2)',
              lineHeight: 1.2
            }}
          >
            {book.title}
          </h1>
          <p
            style={{
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-3)'
            }}
          >
            {book.author}
          </p>

          {/* Metadata */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-2)',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            {book.genre && (
              <span className="badge">{book.genre}</span>
            )}
            {book.language && (
              <span className="badge">{book.language.toUpperCase()}</span>
            )}
            {book.duration > 0 && (
              <span className="badge">⏱ {formatDuration(book.duration)}</span>
            )}
            {book.sections > 0 && (
              <span className="badge">📚 {book.sections} chapters</span>
            )}
          </div>
        </div>

        {/* Description */}
        {book.description && (
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <h3
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                marginBottom: 'var(--space-3)',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              About This Book
            </h3>
            <p
              style={{
                fontSize: '0.9375rem',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                whiteSpace: 'pre-line'
              }}
            >
              {book.description.length > 500
                ? book.description.substring(0, 500) + '...'
                : book.description}
            </p>
          </div>
        )}

        {/* Source Info */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h3
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: 'var(--space-3)',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            Available From
          </h3>
          <div
            className="card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-3)'
            }}
          >
            <div>
              <div style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                {book.sourceLabel || book.source}
              </div>
              {book.duration > 0 && (
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {formatDuration(book.duration)}
                </div>
              )}
              {book.source === 'gutenberg' && (
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' }}>
                  📖 Text version - Check LibriVox for audio
                </div>
              )}
            </div>
            <a
              href={book.detailsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                padding: 'var(--space-2) var(--space-3)',
                fontSize: '0.875rem'
              }}
            >
              View Source
            </a>
          </div>
        </div>

        {/* Play Button */}
        {(book.audioUrl || book.source === 'archive' || book.source === 'librivox') && book.source !== 'gutenberg' && (
          <button
            onClick={handlePlay}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: 'var(--space-4)',
              fontSize: '1.125rem',
              fontWeight: 700,
              marginBottom: 'var(--space-3)'
            }}
          >
            ▶ Play Audiobook
          </button>
        )}

        {book.source === 'gutenberg' && (
          <div
            style={{
              padding: 'var(--space-4)',
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              marginBottom: 'var(--space-3)',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)'
            }}
          >
            📖 This is a text version. Search for "{book.title}" on LibriVox for audio.
          </div>
        )}

        {/* Secondary Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          <button
            onClick={toggleBookmark}
            className="btn"
            style={{
              padding: 'var(--space-3)',
              fontSize: '0.9375rem'
            }}
          >
            {isBookmarked ? '🔖 Bookmarked' : '📑 Bookmark'}
          </button>
          <button
            onClick={handleShare}
            className="btn"
            style={{
              padding: 'var(--space-3)',
              fontSize: '0.9375rem'
            }}
          >
            🔗 Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;