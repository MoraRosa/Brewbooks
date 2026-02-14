import React, { useState, useEffect } from 'react';
import { storage } from '../utils/storage.js';
import BookCard from '../components/BookCard.jsx';
import BookDetailModal from '../components/BookDetailModal.jsx';
import SettingsView from './SettingsView.jsx';

const LibraryView = () => {
  const [activeTab, setActiveTab] = useState('bookmarks');
  const [bookmarks, setBookmarks] = useState([]);
  const [recent, setRecent] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadLibrary();
  }, []);

  const loadLibrary = () => {
    setBookmarks(storage.getBookmarks());
    setRecent(storage.getRecent());
  };

  const handleShowDetail = (book) => {
    setSelectedBook(book);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedBook(null);
    // Refresh library in case bookmark was toggled
    loadLibrary();
  };

  const renderContent = () => {
    const books = activeTab === 'bookmarks' ? bookmarks : recent;

    if (books.length === 0) {
      return (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-10) var(--space-4)',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>
            {activeTab === 'bookmarks' ? '🔖' : '🕐'}
          </div>
          <h3 style={{ marginBottom: 'var(--space-2)' }}>
            {activeTab === 'bookmarks' ? 'No bookmarks yet' : 'No listening history'}
          </h3>
          <p style={{ fontSize: '0.875rem' }}>
            {activeTab === 'bookmarks' 
              ? 'Bookmark audiobooks to save them for later'
              : 'Start listening to build your history'
            }
          </p>
        </div>
      );
    }

    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: 'var(--space-3)'
      }}>
        {books.map(book => (
          <BookCard key={book.id} book={book} onShowDetail={handleShowDetail} />
        ))}
      </div>
    );
  };

  return (
    <div className="view">
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h1 style={{ 
              fontSize: '2rem',
              fontWeight: 700
            }}>
              Library
            </h1>
            
            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(true)}
              className="btn"
              style={{
                padding: 'var(--space-2) var(--space-3)',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)'
              }}
            >
              ⚙️ Settings
            </button>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-2)',
            borderBottom: '1px solid var(--border)',
            paddingBottom: 'var(--space-2)'
          }}>
            {[
              { id: 'bookmarks', label: '🔖 Bookmarks', count: bookmarks.length },
              { id: 'recent', label: '🕐 Recent', count: recent.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: 'var(--space-3)',
                  background: activeTab === tab.id ? 'var(--accent)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--surface)' : 'var(--text-primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {tab.label}
                {tab.count > 0 && ` (${tab.count})`}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>

      {/* Book Detail Modal */}
      <BookDetailModal
        book={selectedBook}
        isOpen={showDetail}
        onClose={handleCloseDetail}
      />

      {/* Settings Modal */}
      {showSettings && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            overflowY: 'auto',
            background: 'var(--bg-primary)'
          }}
        >
          <div style={{
            position: 'sticky',
            top: 0,
            background: 'var(--bg-primary)',
            borderBottom: '1px solid var(--border)',
            padding: 'var(--space-4)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            zIndex: 10
          }}>
            <button
              onClick={() => setShowSettings(false)}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: 0,
                color: 'var(--text-primary)'
              }}
            >
              ←
            </button>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Settings</h2>
          </div>
          <SettingsView />
        </div>
      )}
    </div>
  );
};

export default LibraryView;