import React, { useState, useEffect } from 'react';
import { podcastAPI } from '../api/podcast.js';
import { podcastStorage } from '../utils/podcastStorage.js';
import PodcastCard from '../components/PodcastCard.jsx';
import PodcastDetailModal from '../components/PodcastDetailModal.jsx';

const PodcastView = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [query, setQuery] = useState('');
  const [podcasts, setPodcasts] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadFeatured();
    loadSubscriptions();
  }, []);

  const loadFeatured = async () => {
    setLoading(true);
    const result = await podcastAPI.getTopPodcasts({ limit: 20 });
    if (result.success) {
      setPodcasts(result.podcasts);
    }
    setLoading(false);
  };

  const loadSubscriptions = () => {
    setSubscriptions(podcastStorage.getSubscriptions());
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);

    const result = await podcastAPI.search({ query, limit: 50 });
    if (result.success) {
      setPodcasts(result.podcasts);
    }

    setLoading(false);
  };

  const handleCategorySearch = async (category) => {
    setLoading(true);
    setHasSearched(true);
    setQuery('');

    const result = await podcastAPI.getTopPodcasts({ genre: category, limit: 50 });
    if (result.success) {
      setPodcasts(result.podcasts);
    }

    setLoading(false);
  };

  const handleClear = () => {
    setQuery('');
    setHasSearched(false);
    loadFeatured();
  };

  const handleShowDetail = (podcast) => {
    setSelectedPodcast(podcast);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedPodcast(null);
    loadSubscriptions();
  };

  const categories = [
    { id: 'comedy', label: '😄 Comedy' },
    { id: 'true-crime', label: '🔍 True Crime' },
    { id: 'history', label: '🏛️ History' },
    { id: 'science', label: '🔬 Science' },
    { id: 'fiction', label: '📚 Fiction' },
    { id: 'news', label: '📰 News' },
  ];

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
            🎙️ Podcasts
          </h1>
          <p className="text-secondary" style={{ fontSize: '0.9375rem', marginBottom: 'var(--space-4)' }}>
            Millions of podcasts to explore
          </p>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-4)',
            background: 'var(--surface-secondary)',
            padding: 'var(--space-1)',
            borderRadius: 'var(--radius-md)'
          }}>
            {[
              { id: 'discover', label: 'Discover' },
              { id: 'subscriptions', label: `Subscribed (${subscriptions.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setHasSearched(false);
                  setQuery('');
                }}
                style={{
                  flex: 1,
                  padding: 'var(--space-2)',
                  background: activeTab === tab.id ? 'var(--accent)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--surface)' : 'var(--text-primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Categories - Only in Discover */}
          {activeTab === 'discover' && (
            <>
              <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: 'var(--space-4)' }}>
                <input
                  type="search"
                  className="input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search podcasts..."
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
                    Browse by Category
                  </h3>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySearch(cat.id)}
                        className="btn"
                        style={{ fontSize: '0.875rem' }}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Subscriptions Content */}
        {activeTab === 'subscriptions' && (
          <>
            <h2 style={{ 
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: 'var(--space-4)'
            }}>
              Your Subscriptions
            </h2>

            {subscriptions.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: 'var(--space-3)'
              }}>
                {subscriptions.map(podcast => (
                  <PodcastCard key={podcast.id} podcast={podcast} onShowDetail={handleShowDetail} />
                ))}
              </div>
            ) : (
              <div className="card" style={{
                padding: 'var(--space-8)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>
                  🎙️
                </div>
                <h3 style={{ 
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginBottom: 'var(--space-2)'
                }}>
                  No Subscriptions Yet
                </h3>
                <p className="text-secondary" style={{ marginBottom: 'var(--space-4)' }}>
                  Subscribe to podcasts to see them here
                </p>
                <button
                  onClick={() => setActiveTab('discover')}
                  className="btn btn-primary"
                >
                  Discover Podcasts
                </button>
              </div>
            )}
          </>
        )}

        {/* Discover Content */}
        {activeTab === 'discover' && (
          <>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <h2 style={{ 
                fontSize: '1.25rem',
                fontWeight: 600
              }}>
                {hasSearched ? `${podcasts.length} Results` : 'Popular Podcasts'}
              </h2>
              {hasSearched && (
                <button
                  onClick={handleClear}
                  className="btn"
                  style={{ fontSize: '0.875rem', marginTop: 'var(--space-2)' }}
                >
                  ← Back to Popular
                </button>
              )}
            </div>

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

            {!loading && podcasts.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: 'var(--space-3)'
              }}>
                {podcasts.map(podcast => (
                  <PodcastCard key={podcast.id} podcast={podcast} onShowDetail={handleShowDetail} />
                ))}
              </div>
            )}

            {!loading && podcasts.length === 0 && hasSearched && (
              <div className="card" style={{
                padding: 'var(--space-8)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>
                  🎙️
                </div>
                <h3 style={{ 
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginBottom: 'var(--space-2)'
                }}>
                  No Podcasts Found
                </h3>
                <p className="text-secondary">
                  Try a different search term
                </p>
              </div>
            )}
          </>
        )}

        <PodcastDetailModal
          podcast={selectedPodcast}
          isOpen={showDetail}
          onClose={handleCloseDetail}
        />
      </div>
    </div>
  );
};

export default PodcastView;