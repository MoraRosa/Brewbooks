import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { storage } from '../utils/storage.js';
import { audiobookAPI } from '../api/audiobook-api.js';
import { fetchBookChapters } from '../utils/chapters.js';

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
  
  // Chapter state
  const [chapters, setChapters] = useState([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [loadingChapters, setLoadingChapters] = useState(false);
  
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
      // Auto-advance to next chapter
      if (currentChapterIndex < chapters.length - 1) {
        playChapter(currentChapterIndex + 1);
      } else {
        // End of book
        setIsPlaying(false);
        setCurrentTime(0);
      }
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
  }, [currentChapterIndex, chapters]);

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
    setLoadingChapters(true);

    // Get audio URL if from Internet Archive and not cached
    let audioUrl = book.audioUrl;
    if (book.source === 'archive' && !audioUrl && book._rawId) {
      audioUrl = await audiobookAPI.getArchiveAudioUrl(book._rawId);
      if (!audioUrl) {
        console.error('Could not get audio URL for Internet Archive book');
        setLoading(false);
        setLoadingChapters(false);
        return;
      }
    }

    // Set new book
    setCurrentBook({ ...book, audioUrl });
    
    // Fetch all chapters for this book
    const chaptersResult = await fetchBookChapters({ ...book, audioUrl });
    
    if (chaptersResult.success && chaptersResult.chapters.length > 0) {
      setChapters(chaptersResult.chapters);
      setCurrentChapterIndex(0);
      
      // Load first chapter
      const firstChapter = chaptersResult.chapters[0];
      audioRef.current.src = firstChapter.audioUrl;
      
      // Restore position if resuming
      const savedPosition = storage.getPosition(book.id);
      audioRef.current.currentTime = savedPosition;
    } else {
      // Fallback to single file
      if (audioUrl) {
        setChapters([{
          id: book.id,
          number: 1,
          title: book.title,
          audioUrl: audioUrl,
          duration: book.duration || 0
        }]);
        setCurrentChapterIndex(0);
        audioRef.current.src = audioUrl;
        
        const savedPosition = storage.getPosition(book.id);
        audioRef.current.currentTime = savedPosition;
      } else {
        console.error('No audio URL available');
        setLoading(false);
        setLoadingChapters(false);
        return;
      }
    }
    
    setLoadingChapters(false);
    
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

  const playChapter = async (chapterIndex) => {
    if (chapterIndex < 0 || chapterIndex >= chapters.length) return;
    
    setCurrentChapterIndex(chapterIndex);
    const chapter = chapters[chapterIndex];
    
    audioRef.current.src = chapter.audioUrl;
    audioRef.current.currentTime = 0;
    
    if (isPlaying) {
      try {
        await audioRef.current.play();
      } catch (err) {
        console.error('Chapter play error:', err);
      }
    }
  };

  const nextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      playChapter(currentChapterIndex + 1);
    }
  };

  const previousChapter = () => {
    // If more than 3 seconds into chapter, restart it
    // Otherwise go to previous chapter
    if (currentTime > 3) {
      seek(0);
    } else if (currentChapterIndex > 0) {
      playChapter(currentChapterIndex - 1);
    }
  };

  const getCurrentChapter = () => {
    return chapters[currentChapterIndex] || null;
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
      chapters,
      currentChapterIndex,
      loadingChapters,
      playBook,
      togglePlayPause,
      seek,
      skipForward,
      skipBackward,
      setVolume,
      setPlaybackSpeed,
      playChapter,
      nextChapter,
      previousChapter,
      getCurrentChapter
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