import React, { useState, useEffect } from 'react';
import { audiobookAPI } from '../api/audiobook-api.js';
import { storynoryAPI } from '../api/storynory.js';
import { lit2goAPI } from '../api/lit2go.js';
import { bbcRadioAPI } from '../api/bbc-radio.js';
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
    
    let allBooks = [];
    
    // Special handling for Children's genre - include Storynory
    if (genre.id === 'children') {
      try {
        const storynoryResult = await storynoryAPI.getFeatured(50);
        if (storynoryResult.success) {
          allBooks = [...storynoryResult.books];
        }
      } catch (error) {
        console.error('Storynory error:', error);
      }
    }
    
    // Add Lit2Go for educational genres
    const educationalGenres = ['poetry', 'drama', 'classics', 'history', 'philosophy', 'science'];
    if (educationalGenres.includes(genre.id)) {
      try {
        const lit2goResult = await lit2goAPI.getFeatured(50);
        if (lit2goResult.success) {
          allBooks = [...allBooks, ...lit2goResult.books];
        }
      } catch (error) {
        console.error('Lit2Go error:', error);
      }
    }
    
    // Add BBC Radio for Drama genre
    if (genre.id === 'drama') {
      try {
        const bbcResult = await bbcRadioAPI.getByCategory('drama', 50);
        if (bbcResult.success) {
          allBooks = [...allBooks, ...bbcResult.books];
        }
      } catch (error) {
        console.error('BBC Radio error:', error);
      }
    }
    
    // Use Internet Archive for all genres (avoid LibriVox CORS)
    const searchTerms = {
      'mystery': 'mystery detective',
      'science-fiction': 'science fiction',
      'romance': 'romance love',
      'history': 'history historical',
      'classics': 'classic literature',
      'children': 'children juvenile',
      'fiction': 'fiction novel',
      'biography': 'biography memoir',
      'philosophy': 'philosophy',
      'poetry': 'poetry poems',
      'drama': 'drama plays',
      'literary-fiction': 'literary fiction',
      'fantasy': 'fantasy magic',
      'horror': 'horror gothic',
      'adventure': 'adventure',
      'humor': 'humor comedy',
      'non-fiction': 'nonfiction',
      'science': 'science nature',
      'religion': 'religion spirituality',
      'self-help': 'self help',
      'young-adult': 'young adult',
      'short-stories': 'short stories',
      // Languages - filter by language code
      'english': 'language:eng',
      'spanish': 'language:spa',
      'french': 'language:fre',
      'german': 'language:ger',
      'italian': 'language:ita',
      'portuguese': 'language:por',
      'chinese': 'language:chi',
      'japanese': 'language:jpn'
    };
    
    const searchTerm = searchTerms[genre.id] || genre.name;
    // Increase limit to 200 books per genre
    const result = await audiobookAPI.searchSource('archive', searchTerm, 200);
    
    if (result.success) {
      allBooks = [...allBooks, ...result.books];
    }
    
    setBooks(allBooks);
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
      {/* Compact Sticky Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        background: 'var(--bg-primary)',
        zIndex: 100,
        paddingTop: 'max(var(--space-3), var(--safe-area-top))',
        paddingBottom: 'var(--space-3)',
        paddingLeft: 'var(--space-4)',
        paddingRight: 'var(--space-4)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(var(--bg-primary-rgb), 0.95)'
      }}>
        {/* Back Button + Count on same line */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-2)'
        }}>
          <button
            onClick={() => setSelectedGenre(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)'
            }}
          >
            ←
          </button>
          
          {!loading && books.length > 0 && (
            <span className="text-secondary" style={{ 
              fontSize: '0.75rem',
              lineHeight: 1
            }}>
              {books.length} audiobooks
            </span>
          )}
        </div>

        {/* Title Row - Icon + Title */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--space-2)'
        }}>
          <div style={{ fontSize: '1.5rem', lineHeight: 1 }}>
            {selectedGenre.icon}
          </div>
          <h1 style={{ 
            fontSize: '1.25rem',
            fontWeight: 700,
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {selectedGenre.name}
          </h1>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 'var(--space-4)' }}>

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