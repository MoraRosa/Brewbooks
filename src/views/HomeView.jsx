import React, { useState, useEffect } from 'react';
import { audiobookAPI } from '../api/audiobook-api.js';
import { storage } from '../utils/storage.js';
import BookCard from '../components/BookCard.jsx';
import BookDetailModal from '../components/BookDetailModal.jsx';
import { GENRES } from '../utils/genres.js';

const HomeView = () => {
  const [genreBooks, setGenreBooks] = useState({});
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  // Featured genres to show on home (Netflix-style rows)
  const featuredGenres = [
    GENRES.MYSTERY,
    GENRES.SCIFI,
    GENRES.ROMANCE,
    GENRES.HISTORY,
    GENRES.CLASSICS,
    GENRES.CHILDREN
  ];

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    
    try {
      // Load recently played
      const recent = storage.getRecent();
      setRecentBooks(recent.slice(0, 10));

      // Load books for each featured genre (from Internet Archive only)
      const genrePromises = featuredGenres.map(async (genre) => {
        const searchTerms = {
          'mystery': 'mystery detective',
          'science-fiction': 'science fiction',
          'romance': 'romance love',
          'history': 'history historical',
          'classics': 'classic literature',
          'children': 'children juvenile'
        };
        
        const searchTerm = searchTerms[genre.id] || genre.name;
        // Increase to 15 books per row
        const result = await audiobookAPI.searchSource('archive', searchTerm, 15);
        
        return {
          genre: genre,
          books: result.success ? result.books : []
        };
      });

      const results = await Promise.all(genrePromises);
      
      const booksMap = {};
      results.forEach(({ genre, books }) => {
        booksMap[genre.id] = books;
      });
      
      setGenreBooks(booksMap);
    } catch (error) {
      console.error('Error loading content:', error);
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
            ☕ Brewbooks
          </h1>
          <p className="text-secondary" style={{ fontSize: '0.9375rem' }}>
            Your daily brew of classic stories
          </p>
        </div>

        {/* Continue Listening */}
        {recentBooks.length > 0 && (
          <section style={{ marginBottom: 'var(--space-8)' }}>
            <h2 style={{ 
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: 'var(--space-4)'
            }}>
              Continue Listening
            </h2>
            <div style={{
              display: 'flex',
              gap: 'var(--space-3)',
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              paddingBottom: 'var(--space-2)',
              marginLeft: 'calc(var(--space-4) * -1)',
              marginRight: 'calc(var(--space-4) * -1)',
              paddingLeft: 'var(--space-4)',
              paddingRight: 'var(--space-4)'
            }}>
              {recentBooks.map(book => (
                <div
                  key={book.id}
                  style={{
                    flexShrink: 0,
                    width: '140px',
                    scrollSnapAlign: 'start'
                  }}
                >
                  <BookCard book={book} onShowDetail={handleShowDetail} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Loading */}
        {loading && (
          <div>
            {[...Array(3)].map((_, i) => (
              <section key={i} style={{ marginBottom: 'var(--space-8)' }}>
                <div className="skeleton" style={{ height: '24px', width: '200px', marginBottom: 'var(--space-4)' }} />
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="skeleton" style={{ width: '140px', height: '240px', flexShrink: 0 }} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Genre Rows - Netflix Style */}
        {!loading && featuredGenres.map((genre) => {
          const books = genreBooks[genre.id] || [];
          
          if (books.length === 0) return null;

          return (
            <section key={genre.id} style={{ marginBottom: 'var(--space-8)' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-4)'
              }}>
                <span style={{ fontSize: '1.5rem' }}>{genre.icon}</span>
                <h2 style={{ 
                  fontSize: '1.25rem',
                  fontWeight: 600
                }}>
                  {genre.name}
                </h2>
              </div>

              <div style={{
                display: 'flex',
                gap: 'var(--space-3)',
                overflowX: 'auto',
                overflowY: 'hidden',
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                paddingBottom: 'var(--space-2)',
                marginLeft: 'calc(var(--space-4) * -1)',
                marginRight: 'calc(var(--space-4) * -1)',
                paddingLeft: 'var(--space-4)',
                paddingRight: 'var(--space-4)'
              }}>
                {books.map(book => (
                  <div
                    key={book.id}
                    style={{
                      flexShrink: 0,
                      width: '140px',
                      scrollSnapAlign: 'start'
                    }}
                  >
                    <BookCard book={book} onShowDetail={handleShowDetail} />
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        <BookDetailModal
          book={selectedBook}
          isOpen={showDetail}
          onClose={handleCloseDetail}
        />
      </div>
    </div>
  );
};

export default HomeView;