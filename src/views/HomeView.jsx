import React, { useState, useEffect } from 'react';
import { audiobookAPI } from '../api/audiobook-api.js';
import { storage } from '../utils/storage.js';
import BookCard from '../components/BookCard.jsx';

const HomeView = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    
    // Load featured books
    const featured = await audiobookAPI.getFeatured(20);
    if (featured.success) {
      setFeaturedBooks(featured.books);
    }

    // Load recently played
    const recent = storage.getRecent();
    setRecentBooks(recent.slice(0, 10));

    setLoading(false);
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

        {/* Recently Played */}
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
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: 'var(--space-3)'
            }}>
              {recentBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        )}

        {/* Featured / Popular */}
        <section>
          <h2 style={{ 
            fontSize: '1.25rem',
            fontWeight: 600,
            marginBottom: 'var(--space-4)'
          }}>
            Popular Audiobooks
          </h2>

          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: 'var(--space-3)'
            }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card" style={{ height: '280px' }}>
                  <div className="skeleton" style={{ height: '210px', marginBottom: 'var(--space-3)' }} />
                  <div className="skeleton" style={{ height: '16px', marginBottom: 'var(--space-2)' }} />
                  <div className="skeleton" style={{ height: '14px', width: '60%' }} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: 'var(--space-3)'
            }}>
              {featuredBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomeView;
