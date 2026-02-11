import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { storage } from '../utils/storage.js';
import { audiobookAPI } from '../api/audiobook-api.js';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentBook, setCurrentBook] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [playbackSpeed, setPlaybackSpeed] = useState(() => {
    return storage.getSettings().playbackSpeed || 1.0;
  });
  const [loading, setLoading] = useState(false);
  
  const audioRef = useRef(new Audio());

  // Save position periodically
  useEffect(() => {
    if (!currentBook || !isPlaying) return;

    const interval = setInterval(() => {
      if (currentTime > 0) {
        storage.setPosition(currentBook.id, currentTime);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [currentBook, currentTime, isPlaying]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handleError = (e) => {
      console.error('Audio error:', e);
      setIsPlaying(false);
      setLoading(false);
    };
    const handleLoadStart = () => setLoading(true);
    const handleCanPlay = () => setLoading(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  // Update volume
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  // Update playback speed
  useEffect(() => {
    audioRef.current.playbackRate = playbackSpeed;
    storage.updateSettings({ playbackSpeed });
  }, [playbackSpeed]);

  const playBook = async (book) => {
    // Toggle if same book
    if (currentBook?.id === book.id) {
      togglePlayPause();
      return;
    }

    setLoading(true);

    // Get audio URL if from Internet Archive and not cached
    let audioUrl = book.audioUrl;
    if (book.source === 'archive' && !audioUrl && book._rawId) {
      audioUrl = await audiobookAPI.getArchiveAudioUrl(book._rawId);
      if (!audioUrl) {
        console.error('Could not get audio URL for Internet Archive book');
        setLoading(false);
        return;
      }
    }

    if (!audioUrl) {
      console.error('No audio URL available');
      setLoading(false);
      return;
    }

    // Set new book
    setCurrentBook({ ...book, audioUrl });
    audioRef.current.src = audioUrl;
    
    // Restore position
    const savedPosition = storage.getPosition(book.id);
    audioRef.current.currentTime = savedPosition;
    
    // Add to recent
    storage.addRecent(book);
    
    // Play
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.error('Playback error:', err);
      setIsPlaying(false);
    } finally {
      setLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error('Play error:', err));
    }
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const skipForward = (seconds = 30) => {
    const newTime = Math.min(currentTime + seconds, duration);
    seek(newTime);
  };

  const skipBackward = (seconds = 15) => {
    const newTime = Math.max(currentTime - seconds, 0);
    seek(newTime);
  };

  return (
    <PlayerContext.Provider value={{
      currentBook,
      isPlaying,
      currentTime,
      duration,
      volume,
      playbackSpeed,
      loading,
      playBook,
      togglePlayPause,
      seek,
      skipForward,
      skipBackward,
      setVolume,
      setPlaybackSpeed
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
};
