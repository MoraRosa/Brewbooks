import React, { useState } from 'react';
import { audiobookAPI } from '../api/audiobook-api.js';
import BookCard from '../components/BookCard.jsx';

const SearchView = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);

    const result = await audiobookAPI.searchAll(query, 50);
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
          <form onSubmit={handleSearch} style={{ position: 'relative' }}>
            <input
              type="search"
              className="input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or author..."
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
        </div>

        {/* Quick Suggestions */}
        {!hasSearched && (
          <div>
            <h3 style={{ 
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-3)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Try Searching For
            </h3>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              {['Shakespeare', 'Pride and Prejudice', 'Moby Dick', 'Sherlock Holmes', 'War and Peace'].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setQuery(suggestion);
                    handleSearch({ preventDefault: () => {} });
                  }}
                  className="btn"
                  style={{ fontSize: '0.875rem' }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

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
            </div>

            {/* Loading */}
            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="card" style={{ height: '100px', display: 'flex', gap: 'var(--space-3)' }}>
                    <div className="skeleton" style={{ width: '80px', height: '80px' }} />
                    <div style={{ flex: 1 }}>
                      <div className="skeleton" style={{ height: '16px', marginBottom: 'var(--space-2)' }} />
                      <div className="skeleton" style={{ height: '14px', width: '60%' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Results List */}
            {!loading && results.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {results.map(book => (
                  <BookCard key={book.id} book={book} layout="list" />
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && results.length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: 'var(--space-10) var(--space-4)',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🔍</div>
                <h3 style={{ marginBottom: 'var(--space-2)' }}>No results found</h3>
                <p style={{ fontSize: '0.875rem' }}>Try a different search term</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchView;
