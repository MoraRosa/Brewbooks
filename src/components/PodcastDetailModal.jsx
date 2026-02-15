import React, { useState, useEffect } from 'react';
import { podcastAPI } from '../api/podcast.js';
import { podcastStorage } from '../utils/podcastStorage.js';
import { usePlayer } from '../contexts/PlayerContext.jsx';

const PodcastDetailModal = ({ podcast, isOpen, onClose }) => {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [playedEpisodes, setPlayedEpisodes] = useState([]);
  const { playBook } = usePlayer();

  useEffect(() => {
    if (isOpen && podcast) {
      loadEpisodes();
      setIsSubscribed(podcastStorage.isSubscribed(podcast.podcastId));
      setPlayedEpisodes(podcastStorage.getPlayedEpisodes());
    }
  }, [isOpen, podcast]);

  const loadEpisodes = async () => {
    setLoading(true);
    
    const result = await podcastAPI.getPodcastById(podcast.podcastId);
    
    if (result.success) {
      setEpisodes(result.episodes);
    }
    
    setLoading(false);
  };

  const handleSubscribe = () => {
    if (isSubscribed) {
      podcastStorage.unsubscribe(podcast.podcastId);
      setIsSubscribed(false);
    } else {
      podcastStorage.subscribe(podcast);
      setIsSubscribed(true);
    }
  };

  const handlePlayEpisode = (episode) => {
    // Convert episode to book format for player
    const episodeAsBook = {
      id: episode.id,
      title: episode.title,
      author: podcast.author,
      coverUrl: episode.coverUrl || podcast.coverUrl,
      audioUrl: episode.audioUrl,
      duration: episode.duration,
      source: 'podcast',
      isPodcast: true,
      podcastId: podcast.podcastId, // Add this!
      podcastTitle: podcast.title    // Add this!
    };
    
    playBook(episodeAsBook);
  };

  if (!isOpen || !podcast) return null;

  return (
    <div 
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        zIndex: 1000,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-primary)',
          minHeight: '100vh',
          paddingBottom: 'calc(var(--space-8) + var(--safe-area-bottom))'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'sticky',
            top: 'var(--space-4)',
            left: 'var(--space-4)',
            zIndex: 10,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(10px)',
            border: 'none',
            color: 'white',
            fontSize: '1.25rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'calc(-40px - var(--space-4))'
          }}
        >
          ✕
        </button>

        {/* Cover & Info */}
        <div style={{ padding: 'var(--space-4)', paddingTop: 'var(--space-8)' }}>
          <div style={{
            width: '200px',
            height: '200px',
            margin: '0 auto var(--space-4)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-xl)',
            background: 'var(--surface-secondary)'
          }}>
            {podcast.coverUrl ? (
              <img 
                src={podcast.coverUrl} 
                alt={podcast.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '5rem',
                color: 'var(--text-tertiary)'
              }}>
                🎙️
              </div>
            )}
          </div>

          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: 'var(--space-2)',
            textAlign: 'center'
          }}>
            {podcast.title}
          </h1>

          <p className="text-secondary" style={{
            fontSize: '0.9375rem',
            marginBottom: 'var(--space-3)',
            textAlign: 'center'
          }}>
            {podcast.author}
          </p>

          {podcast.description && (
            <p className="text-secondary" style={{
              fontSize: '0.875rem',
              lineHeight: 1.6,
              marginBottom: 'var(--space-4)'
            }}>
              {podcast.description}
            </p>
          )}

          {podcast.genre && (
            <div style={{
              display: 'inline-block',
              padding: 'var(--space-1) var(--space-2)',
              background: 'var(--surface-secondary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-4)'
            }}>
              {podcast.genre}
            </div>
          )}

          {/* Subscribe Button */}
          <button
            onClick={handleSubscribe}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: 'var(--space-4)',
              fontSize: '1rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-2)'
            }}
          >
            {isSubscribed ? '✓ Subscribed' : '+ Subscribe'}
          </button>
        </div>

        {/* Episodes */}
        <div style={{ padding: 'var(--space-4)' }}>
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            marginBottom: 'var(--space-4)'
          }}>
            Episodes
          </h2>

          {loading && (
            <div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="card" style={{ height: '80px', marginBottom: 'var(--space-3)' }}>
                  <div className="skeleton" style={{ height: '100%' }} />
                </div>
              ))}
            </div>
          )}

          {!loading && episodes.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {episodes.map(episode => {
                const isPlayed = playedEpisodes.includes(episode.id);
                const progress = podcastStorage.getEpisodeProgress(episode.id);
                
                return (
                  <div
                    key={episode.id}
                    className="card card-clickable"
                    onClick={() => handlePlayEpisode(episode)}
                    style={{
                      padding: 'var(--space-3)',
                      display: 'flex',
                      gap: 'var(--space-3)',
                      alignItems: 'center',
                      opacity: isPlayed ? 0.6 : 1
                    }}
                  >
                    {/* Play Icon */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: isPlayed ? 'var(--surface-secondary)' : 'var(--accent)',
                      color: isPlayed ? 'var(--text-tertiary)' : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '1.125rem',
                      position: 'relative'
                    }}>
                      {isPlayed ? '✓' : '▶'}
                      
                      {/* Progress Ring */}
                      {progress && !isPlayed && (
                        <svg
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            transform: 'rotate(-90deg)'
                          }}
                        >
                          <circle
                            cx="20"
                            cy="20"
                            r="18"
                            fill="none"
                            stroke="var(--accent)"
                            strokeWidth="3"
                            strokeDasharray={`${progress.percentage * 1.13} 113`}
                            opacity="0.3"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Episode Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        marginBottom: 'var(--space-1)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.3,
                        textDecoration: isPlayed ? 'line-through' : 'none'
                      }}>
                        {episode.title}
                      </h3>
                      
                      <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                        {episode.releaseDate && (
                          <p className="text-tertiary" style={{ fontSize: '0.75rem' }}>
                            {new Date(episode.releaseDate).toLocaleDateString()}
                          </p>
                        )}
                        {progress && !isPlayed && (
                          <p style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>
                            {Math.round(progress.percentage)}% complete
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && episodes.length === 0 && (
            <div className="card" style={{
              padding: 'var(--space-6)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>
                🎙️
              </div>
              <p className="text-secondary">
                No episodes available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PodcastDetailModal;