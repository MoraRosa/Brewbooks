import React, { useState, useEffect } from 'react';
import { audiobookAPI } from '../api/audiobook-api.js';
import BookCard from '../components/BookCard.jsx';
import BookDetailModal from '../components/BookDetailModal.jsx';
import { GENRES, ALL_GENRES } from '../utils/genres.js';

const GenreView = () => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    if (selectedGenre) {
      loadGenreBooks(selectedGenre);
    }
  }, [selectedGenre]);

  const loadGenreBooks = async (genre) => {
    setLoading(true);
    
    // Search for books in this genre
    const result = await audiobookAPI.searchAll(genre.name, 50);
    
    if (result.success) {
      setBooks(result.books);
    }
    
    setLoading(false);
  };

  const handleShowDetail = (book) => {
    setSelectedBook(book);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedBook(null);
  };

  // Show genre grid if no genre selected
  if (!selectedGenre) {
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
              Browse by Genre
            </h1>
            <p className="text-secondary" style={{ fontSize: '0.9375rem' }}>
              Explore audiobooks by category
            </p>
          </div>

          {/* Genre Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-8)'
          }}>
            {ALL_GENRES.map(genre => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre)}
                className="card card-clickable"
                style={{
                  padding: 'var(--space-4)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-2)',
                  alignItems: 'center',
                  border: 'none',
                  background: 'var(--surface)'
                }}
              >
                <div style={{ 
                  fontSize: '2.5rem',
                  lineHeight: 1
                }}>
                  {genre.icon}
                </div>
                <div style={{
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)'
                }}>
                  {genre.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show books for selected genre
  return (
    <div className="view">
      <div className="container">
        {/* Header with back button */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <button
            onClick={() => setSelectedGenre(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent)',
              fontSize: '0.9375rem',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0,
              marginBottom: 'var(--space-3)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}
          >
            ← Back to Genres
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
            <div style={{ fontSize: '2.5rem' }}>
              {selectedGenre.icon}
            </div>
            <h1 style={{ 
              fontSize: '2rem',
              fontWeight: 700
            }}>
              {selectedGenre.name}
            </h1>
          </div>
          
          {!loading && books.length > 0 && (
            <p className="text-secondary" style={{ fontSize: '0.9375rem' }}>
              {books.length} audiobooks found
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 'var(--space-3)'
          }}>
            {[...Array(12)].map((_, i) => (
              <div key={i} className="card" style={{ height: '280px' }}>
                <div className="skeleton" style={{ height: '100%' }} />
              </div>
            ))}
          </div>
        )}

        {/* Books Grid */}
        {!loading && books.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 'var(--space-3)'
          }}>
            {books.map(book => (
              <BookCard key={book.id} book={book} onShowDetail={handleShowDetail} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && books.length === 0 && (
          <div className="card" style={{
            padding: 'var(--space-8)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>
              {selectedGenre.icon}
            </div>
            <h3 style={{ 
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: 'var(--space-2)'
            }}>
              No {selectedGenre.name} audiobooks found
            </h3>
            <p className="text-secondary">
              Try selecting a different genre
            </p>
          </div>
        )}

        {/* Book Detail Modal */}
        <BookDetailModal
          book={selectedBook}
          isOpen={showDetail}
          onClose={handleCloseDetail}
        />
      </div>
    </div>
  );
};

export default GenreView;
