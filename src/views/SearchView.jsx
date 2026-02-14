import React, { useState } from 'react';
import { audiobookAPI } from '../api/audiobook-api.js';
import { bbcRadioAPI } from '../api/bbc-radio.js';
import { storynoryAPI } from '../api/storynory.js';
import { lit2goAPI } from '../api/lit2go.js';
import BookCard from '../components/BookCard.jsx';
import BookDetailModal from '../components/BookDetailModal.jsx';

const SearchView = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);

    const result = await audiobookAPI.searchAll(query, 50);
    if (result.success) {
      setResults(result.books);
    }

    setLoading(false);
  };

  const handleFilterSearch = async (filterType) => {
    setLoading(true);
    setHasSearched(true);
    setQuery('');
    
    let result;
    
    switch(filterType) {
      case 'bbc':
        result = await bbcRadioAPI.getFeatured(50);
        break;
      case 'storynory':
        result = await storynoryAPI.getFeatured(50);
        break;
      case 'lit2go':
        result = await lit2goAPI.getFeatured(50);
        break;
      case 'drama':
        result = await audiobookAPI.searchAll('drama plays', 50);
        break;
      case 'mystery':
        result = await audiobookAPI.searchAll('mystery detective', 50);
        break;
      case 'scifi':
        result = await audiobookAPI.searchAll('science fiction', 50);
        break;
      case 'children':
        result = await audiobookAPI.searchAll('children juvenile', 50);
        break;
      case 'classics':
        result = await audiobookAPI.searchAll('classic literature', 50);
        break;
      case 'poetry':
        result = await audiobookAPI.searchAll('poetry poems', 50);
        break;
      default:
        result = { success: false, books: [] };
    }
    
    if (result.success) {
      setResults(result.books);
    }
    
    setLoading(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
  };

  const handleShowDetail = (book) => {
    setSelectedBook(book);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedBook(null);
  };

  const quickFilters = [
    { id: 'bbc', label: '🎭 BBC Radio' },
    { id: 'storynory', label: '⭐ Original Stories' },
    { id: 'lit2go', label: '📚 Educational' },
  ];

  const genreFilters = [
    { id: 'drama', label: 'Drama' },
    { id: 'mystery', label: 'Mystery' },
    { id: 'scifi', label: 'Sci-Fi' },
    { id: 'children', label: 'Children' },
    { id: 'classics', label: 'Classics' },
    { id: 'poetry', label: 'Poetry' },
  ];

  return (
    <div className="view">
      <div className="container">
        {/* Search Header */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <h1 style={{ 
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: 'var(--space-4)'
          }}>
            Search
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: 'var(--space-4)' }}>
            <input
              type="search"
              className="input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, author, or keyword..."
              style={{
                paddingRight: query ? 'var(--space-12)' : 'var(--space-4)',
                fontSize: '1rem'
              }}
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                style={{
                  position: 'absolute',
                  right: 'var(--space-2)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.25rem',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            )}
          </form>

          {/* Quick Filters */}
          {!hasSearched && (
            <>
              <h3 style={{ 
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-3)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Browse by Collection
              </h3>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-5)' }}>
                {quickFilters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => handleFilterSearch(filter.id)}
                    className="btn"
                    style={{ 
                      fontSize: '0.875rem',
                      padding: 'var(--space-2) var(--space-3)'
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <h3 style={{ 
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-3)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Browse by Genre
              </h3>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {genreFilters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => handleFilterSearch(filter.id)}
                    className="btn"
                    style={{ fontSize: '0.875rem' }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Results */}
        {hasSearched && (
          <div>
            {/* Results Header */}
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--space-4)'
            }}>
              <h2 style={{ 
                fontSize: '1.125rem',
                fontWeight: 600
              }}>
                {loading ? 'Searching...' : `${results.length} Results`}
              </h2>
              <button
                onClick={handleClear}
                className="btn"
                style={{ fontSize: '0.875rem' }}
              >
                New Search
              </button>
            </div>

            {/* Loading */}
            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card" style={{ height: '120px' }}>
                    <div className="skeleton" style={{ height: '100%' }} />
                  </div>
                ))}
              </div>
            )}

            {/* Results Grid */}
            {!loading && results.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: 'var(--space-3)'
              }}>
                {results.map(book => (
                  <BookCard key={book.id} book={book} onShowDetail={handleShowDetail} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && results.length === 0 && (
              <div className="card" style={{
                padding: 'var(--space-8)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>
                  🔍
                </div>
                <h3 style={{ 
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginBottom: 'var(--space-2)'
                }}>
                  No Results Found
                </h3>
                <p className="text-secondary">
                  Try a different search term or browse by collection
                </p>
              </div>
            )}
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

export default SearchView;