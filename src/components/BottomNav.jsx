import React from 'react';

const BottomNav = ({ activeView, onViewChange }) => {
  const navItems = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'search', icon: '🔍', label: 'Search' },
    { id: 'genres', icon: '📚', label: 'Genres' },
    { id: 'library', icon: '📖', label: 'Library' },
    { id: 'settings', icon: '⚙️', label: 'Settings' }
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 'var(--navbar-height)',
      background: 'var(--surface-elevated)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingBottom: 'max(var(--space-2), var(--safe-area-bottom))',
      boxShadow: 'var(--shadow-lg)',
      zIndex: 100
    }}>
      {navItems.map(item => {
        const isActive = activeView === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-1)',
              padding: 'var(--space-2)',
              background: 'transparent',
              border: 'none',
              color: isActive ? 'var(--accent)' : 'var(--text-tertiary)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              minHeight: '56px'
            }}
          >
            <span style={{ 
              fontSize: '1.5rem',
              filter: isActive ? 'none' : 'grayscale(1) opacity(0.6)',
              transition: 'all var(--transition-fast)'
            }}>
              {item.icon}
            </span>
            <span style={{ 
              fontSize: '0.75rem',
              fontWeight: isActive ? 600 : 400,
              transition: 'all var(--transition-fast)'
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;