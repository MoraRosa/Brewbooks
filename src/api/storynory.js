/**
 * Storynory API Service - Archive.org Mirror Version
 * Searches Internet Archive for Storynory content
 * Storynory stories are often uploaded to Archive.org by community
 */

class StorynoryAPI {
  constructor() {
    this.baseUrl = 'https://archive.org/advancedsearch.php';
  }

  async search({ query = '', limit = 50 }) {
    try {
      // Search Archive.org for Storynory uploads
      const searchQuery = query 
        ? `(storynory OR "story nory") AND (${query}) AND mediatype:audio`
        : '(storynory OR "story nory") AND mediatype:audio';

      const params = new URLSearchParams({
        q: searchQuery,
        fl: 'identifier,title,creator,description,date,downloads,runtime,subject,language',
        rows: limit.toString(),
        output: 'json',
        sort: 'downloads desc'
      });

      const response = await fetch(`${this.baseUrl}?${params}`);
      const data = await response.json();
      
      const books = (data.response?.docs || []).map(doc => this.normalizeBook(doc));

      return {
        success: true,
        books,
        total: books.length,
        source: 'storynory'
      };
    } catch (error) {
      console.error('Storynory API error:', error);
      return {
        success: false,
        books: [],
        error: error.message,
        source: 'storynory'
      };
    }
  }

  normalizeBook(doc) {
    return {
      id: `storynory-${doc.identifier}`,
      _rawId: doc.identifier,
      title: this.cleanTitle(doc.title || 'Untitled'),
      author: 'Storynory',
      description: doc.description || '',
      language: doc.language || 'en',
      genre: 'Children\'s Stories',
      duration: this.parseRuntime(doc.runtime),
      audioUrl: null,
      coverUrl: `https://archive.org/services/img/${doc.identifier}`,
      detailsUrl: `https://archive.org/details/${doc.identifier}`,
      downloads: doc.downloads || 0,
      source: 'storynory',
      sourceLabel: 'Storynory (via Archive)',
      isOriginal: true
    };
  }

  cleanTitle(title) {
    return title.replace(/^Storynory\s*[-:]\s*/i, '').trim();
  }

  parseRuntime(runtime) {
    if (!runtime) return 0;
    const match = runtime.match(/(\d+):(\d+):(\d+)/);
    if (match) {
      return parseInt(match[1]) * 3600 + parseInt(match[2]) * 60 + parseInt(match[3]);
    }
    return 0;
  }

  async getFeatured(limit = 20) {
    return this.search({ limit });
  }
}

export const storynoryAPI = new StorynoryAPI();