/**
 * Podcast Subscription Storage
 * Manages subscribed podcasts and episode progress
 */

const STORAGE_KEYS = {
  SUBSCRIPTIONS: 'brewbooks_podcast_subscriptions',
  EPISODE_PROGRESS: 'brewbooks_episode_progress',
  PLAYED_EPISODES: 'brewbooks_played_episodes'
};

class PodcastStorage {
  /**
   * SUBSCRIPTIONS
   */
  
  subscribe(podcast) {
    const subscriptions = this.getSubscriptions();
    
    // Check if already subscribed
    if (subscriptions.find(p => p.podcastId === podcast.podcastId)) {
      return;
    }
    
    subscriptions.push({
      ...podcast,
      subscribedAt: Date.now()
    });
    
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subscriptions));
  }
  
  unsubscribe(podcastId) {
    const subscriptions = this.getSubscriptions();
    const filtered = subscriptions.filter(p => p.podcastId !== podcastId);
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(filtered));
  }
  
  getSubscriptions() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      return [];
    }
  }
  
  isSubscribed(podcastId) {
    const subscriptions = this.getSubscriptions();
    return subscriptions.some(p => p.podcastId === podcastId);
  }
  
  /**
   * EPISODE PROGRESS
   */
  
  saveEpisodeProgress(episodeId, currentTime, duration) {
    const progress = this.getEpisodeProgress();
    
    progress[episodeId] = {
      currentTime,
      duration,
      timestamp: Date.now(),
      percentage: duration > 0 ? (currentTime / duration) * 100 : 0
    };
    
    localStorage.setItem(STORAGE_KEYS.EPISODE_PROGRESS, JSON.stringify(progress));
  }
  
  getEpisodeProgress(episodeId = null) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EPISODE_PROGRESS);
      const progress = data ? JSON.parse(data) : {};
      
      if (episodeId) {
        return progress[episodeId] || null;
      }
      
      return progress;
    } catch (error) {
      console.error('Error loading episode progress:', error);
      return episodeId ? null : {};
    }
  }
  
  clearEpisodeProgress(episodeId) {
    const progress = this.getEpisodeProgress();
    delete progress[episodeId];
    localStorage.setItem(STORAGE_KEYS.EPISODE_PROGRESS, JSON.stringify(progress));
  }
  
  /**
   * PLAYED EPISODES
   */
  
  markAsPlayed(episodeId) {
    const played = this.getPlayedEpisodes();
    
    if (!played.includes(episodeId)) {
      played.push(episodeId);
      localStorage.setItem(STORAGE_KEYS.PLAYED_EPISODES, JSON.stringify(played));
    }
    
    // Also clear progress since it's completed
    this.clearEpisodeProgress(episodeId);
  }
  
  markAsUnplayed(episodeId) {
    const played = this.getPlayedEpisodes();
    const filtered = played.filter(id => id !== episodeId);
    localStorage.setItem(STORAGE_KEYS.PLAYED_EPISODES, JSON.stringify(filtered));
    
    // Also clear progress
    this.clearEpisodeProgress(episodeId);
  }
  
  getPlayedEpisodes() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLAYED_EPISODES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading played episodes:', error);
      return [];
    }
  }
  
  isPlayed(episodeId) {
    const played = this.getPlayedEpisodes();
    return played.includes(episodeId);
  }
  
  /**
   * UTILITY
   */
  
  getInProgressEpisodes() {
    const progress = this.getEpisodeProgress();
    const played = this.getPlayedEpisodes();
    
    // Get episodes with progress that aren't marked as played
    return Object.entries(progress)
      .filter(([episodeId]) => !played.includes(episodeId))
      .map(([episodeId, data]) => ({
        episodeId,
        ...data
      }))
      .sort((a, b) => b.timestamp - a.timestamp); // Most recent first
  }
  
  clearAllData() {
    localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTIONS);
    localStorage.removeItem(STORAGE_KEYS.EPISODE_PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.PLAYED_EPISODES);
  }
}

export const podcastStorage = new PodcastStorage();
