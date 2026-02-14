import React from 'react';

const PodcastCard = ({ podcast, onShowDetail }) => {
  const handleCardClick = () => {
    if (onShowDetail) {
      onShowDetail(podcast);
    }
  };

  return (
    <div 
      className="card card-clickable"
      onClick={handleCardClick}
      style={{
        padding: 0,
        overflow: 'hidden',
        height: '280px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Cover */}
      <div style={{ 
        position: 'relative',
        width: '100%',
        paddingBottom: '100%',
        background: 'var(--surface-secondary)',
        overflow: 'hidden'
      }}>
        {podcast.coverUrl ? (
          <img
            src={podcast.coverUrl}
            alt={podcast.title}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            color: 'var(--text-tertiary)'
          }}>
            🎙️
          </div>
        )}

        {/* Podcast Badge */}
        <div style={{
          position: 'absolute',
          top: 'var(--space-2)',
          left: 'var(--space-2)',
          padding: '2px 6px',
          borderRadius: 'var(--radius-sm)',
          background: '#e91e63',
          color: 'white',
          fontSize: '0.625rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          boxShadow: 'var(--shadow-md)'
        }}>
          Podcast
        </div>
      </div>

      {/* Info */}
      <div style={{ 
        padding: 'var(--space-3)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h3 style={{
          fontSize: '0.875rem',
          fontWeight: 600,
          marginBottom: 'var(--space-1)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          lineHeight: 1.3
        }}>
          {podcast.title}
        </h3>

        <p className="text-secondary" style={{
          fontSize: '0.75rem',
          marginBottom: 'var(--space-2)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {podcast.author}
        </p>

        {podcast.episodeCount > 0 && (
          <p className="text-tertiary" style={{
            fontSize: '0.6875rem',
            marginTop: 'auto'
          }}>
            {podcast.episodeCount} episodes
          </p>
        )}
      </div>
    </div>
  );
};

export default PodcastCard;
