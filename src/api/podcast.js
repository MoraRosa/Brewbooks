/**
 * iTunes Podcast API Service
 * Free podcast search and episode fetching
 * No API key required
 */

class PodcastAPI {
  constructor() {
    this.searchUrl = 'https://itunes.apple.com/search';
    this.lookupUrl = 'https://itunes.apple.com/lookup';
  }

  /**
   * Search for podcasts by query
   */
  async search({ query = '', limit = 50 }) {
    try {
      const params = new URLSearchParams({
        term: query,
        media: 'podcast',
        entity: 'podcast',
        limit: limit.toString()
      });

      const response = await fetch(`${this.searchUrl}?${params}`);
      const data = await response.json();

      const podcasts = (data.results || []).map(podcast => this.normalizePodcast(podcast));

      return {
        success: true,
        podcasts,
        total: podcasts.length,
        source: 'itunes'
      };
    } catch (error) {
      console.error('Podcast search error:', error);
      return {
        success: false,
        podcasts: [],
        error: error.message,
        source: 'itunes'
      };
    }
  }

  /**
   * Get podcast details and episodes by ID
   */
  async getPodcastById(podcastId) {
    try {
      const params = new URLSearchParams({
        id: podcastId,
        entity: 'podcastEpisode',
        limit: '100'
      });

      const response = await fetch(`${this.lookupUrl}?${params}`);
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        throw new Error('Podcast not found');
      }

      // First result is the podcast, rest are episodes
      const podcastData = data.results[0];
      const episodesData = data.results.slice(1);

      return {
        success: true,
        podcast: this.normalizePodcast(podcastData),
        episodes: episodesData.map(ep => this.normalizeEpisode(ep)),
        source: 'itunes'
      };
    } catch (error) {
      console.error('Podcast lookup error:', error);
      return {
        success: false,
        podcast: null,
        episodes: [],
        error: error.message,
        source: 'itunes'
      };
    }
  }

  /**
   * Get podcast feed URL and parse episodes
   */
  async getPodcastFeed(feedUrl) {
    try {
      // Use RSS2JSON to parse the feed
      const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
      
      const response = await fetch(proxyUrl);
      const data = await response.json();

      if (data.status !== 'ok') {
        throw new Error('Failed to fetch podcast feed');
      }

      const episodes = (data.items || []).map(item => this.normalizeRSSEpisode(item));

      return {
        success: true,
        episodes,
        total: episodes.length
      };
    } catch (error) {
      console.error('Feed fetch error:', error);
      return {
        success: false,
        episodes: [],
        error: error.message
      };
    }
  }

  /**
   * Get top podcasts by genre
   */
  async getTopPodcasts({ genre = 'all', limit = 50 }) {
    try {
      // iTunes top podcast chart
      const genreMap = {
        'all': '26',
        'comedy': '1303',
        'education': '1304',
        'fiction': '1483',
        'history': '1462',
        'news': '1489',
        'science': '1533',
        'society': '1324',
        'sports': '1545',
        'technology': '1318',
        'true-crime': '1488'
      };

      const genreId = genreMap[genre] || genreMap['all'];
      
      // Note: iTunes doesn't have a direct "top podcasts" endpoint in their free API
      // We'll search for popular terms as a workaround
      const popularTerms = {
        'all': 'podcast',
        'comedy': 'comedy podcast',
        'education': 'educational podcast',
        'fiction': 'fiction podcast',
        'history': 'history podcast',
        'news': 'news daily',
        'science': 'science podcast',
        'society': 'society culture',
        'sports': 'sports podcast',
        'technology': 'tech podcast',
        'true-crime': 'true crime'
      };

      return this.search({ query: popularTerms[genre] || 'podcast', limit });
    } catch (error) {
      console.error('Top podcasts error:', error);
      return {
        success: false,
        podcasts: [],
        error: error.message,
        source: 'itunes'
      };
    }
  }

  normalizePodcast(podcast) {
    return {
      id: `podcast-${podcast.collectionId || podcast.trackId}`,
      podcastId: podcast.collectionId || podcast.trackId,
      title: podcast.collectionName || podcast.trackName || 'Untitled Podcast',
      author: podcast.artistName || 'Unknown',
      description: this.cleanDescription(podcast.description || ''),
      genre: podcast.primaryGenreName || 'Podcast',
      coverUrl: this.getHighResCover(podcast.artworkUrl600 || podcast.artworkUrl100 || ''),
      feedUrl: podcast.feedUrl || '',
      episodeCount: podcast.trackCount || 0,
      detailsUrl: podcast.collectionViewUrl || podcast.trackViewUrl || '',
      source: 'podcast',
      sourceLabel: 'Podcast',
      isPodcast: true
    };
  }

  normalizeEpisode(episode) {
    return {
      id: `episode-${episode.trackId}`,
      episodeId: episode.trackId,
      title: episode.trackName || 'Untitled Episode',
      description: this.cleanDescription(episode.description || ''),
      audioUrl: episode.episodeUrl || '',
      duration: Math.floor((episode.trackTimeMillis || 0) / 1000),
      releaseDate: episode.releaseDate || '',
      episodeNumber: episode.trackNumber || null,
      coverUrl: this.getHighResCover(episode.artworkUrl600 || episode.artworkUrl160 || ''),
      source: 'podcast'
    };
  }

  normalizeRSSEpisode(item) {
    return {
      id: `episode-${item.guid || Math.random().toString(36).substring(7)}`,
      title: item.title || 'Untitled Episode',
      description: this.cleanDescription(item.description || ''),
      audioUrl: item.enclosure?.link || '',
      duration: 0, // RSS2JSON doesn't include duration
      releaseDate: item.pubDate || '',
      coverUrl: item.thumbnail || '',
      source: 'podcast'
    };
  }

  cleanDescription(desc) {
    if (!desc) return '';
    
    // Remove HTML tags
    const withoutTags = desc.replace(/<[^>]*>/g, '');
    
    // Decode HTML entities
    const textarea = document.createElement('textarea');
    textarea.innerHTML = withoutTags;
    
    return textarea.value.trim();
  }

  getHighResCover(url) {
    // iTunes returns URLs with size like artworkUrl100
    // Replace with 600x600 for better quality
    return url.replace(/\/\d+x\d+/, '/600x600');
  }
}

export const podcastAPI = new PodcastAPI();
