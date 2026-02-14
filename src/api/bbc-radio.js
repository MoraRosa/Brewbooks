/**
 * BBC Radio API Service - Archive.org Version
 * Searches Archive.org for BBC Radio drama uploads
 * Full-cast productions, documentaries, comedy
 */

class BBCRadioAPI {
  constructor() {
    this.baseUrl = 'https://archive.org/advancedsearch.php';
  }

  async search({ query = '', limit = 100 }) {
    try {
      // Search Archive.org for BBC Radio content
      const searchQuery = query 
        ? `(BBC AND radio AND (drama OR comedy OR documentary)) AND (${query}) AND mediatype:audio`
        : '(BBC AND radio AND (drama OR comedy OR documentary)) AND mediatype:audio';

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
        source: 'bbc'
      };
    } catch (error) {
      console.error('BBC Radio API error:', error);
      return {
        success: false,
        books: [],
        error: error.message,
        source: 'bbc'
      };
    }
  }

  async getByCategory(category, limit = 100) {
    const categoryMap = {
      'drama': '(BBC AND radio AND drama) AND mediatype:audio',
      'comedy': '(BBC AND radio AND comedy) AND mediatype:audio',
      'documentary': '(BBC AND radio AND documentary) AND mediatype:audio',
      'scifi': '(BBC AND radio AND (science fiction OR sci-fi)) AND mediatype:audio'
    };

    const searchQuery = categoryMap[category] || categoryMap['drama'];

    const params = new URLSearchParams({
      q: searchQuery,
      fl: 'identifier,title,creator,description,date,downloads,runtime,subject,language',
      rows: limit.toString(),
      output: 'json',
      sort: 'downloads desc'
    });

    try {
      const response = await fetch(`${this.baseUrl}?${params}`);
      const data = await response.json();
      
      const books = (data.response?.docs || []).map(doc => this.normalizeBook(doc));

      return {
        success: true,
        books,
        total: books.length,
        source: 'bbc'
      };
    } catch (error) {
      console.error('BBC Radio category error:', error);
      return {
        success: false,
        books: [],
        error: error.message,
        source: 'bbc'
      };
    }
  }

  normalizeBook(doc) {
    // Determine genre from subjects and title
    const subjects = Array.isArray(doc.subject) ? doc.subject : [doc.subject].filter(Boolean);
    const genre = this.determineGenre(subjects, doc.title);

    return {
      id: `bbc-${doc.identifier}`,
      _rawId: doc.identifier,
      title: this.cleanTitle(doc.title || 'Untitled'),
      author: 'BBC Radio',
      description: doc.description || '',
      language: doc.language || 'en',
      genre: genre,
      duration: this.parseRuntime(doc.runtime),
      audioUrl: null,
      coverUrl: `https://archive.org/services/img/${doc.identifier}`,
      detailsUrl: `https://archive.org/details/${doc.identifier}`,
      downloads: doc.downloads || 0,
      source: 'bbc',
      sourceLabel: 'BBC Radio Drama',
      isFullCast: true // Flag for full-cast production badge
    };
  }

  cleanTitle(title) {
    // Remove "BBC Radio - " or "BBC - " prefix
    return title
      .replace(/^BBC\s+(Radio\s+)?[-:]\s*/i, '')
      .replace(/^Radio\s+[-:]\s*/i, '')
      .trim();
  }

  determineGenre(subjects, title = '') {
    const subjectStr = subjects.join(' ').toLowerCase();
    const titleLower = title.toLowerCase();
    const combined = `${subjectStr} ${titleLower}`;
    
    if (combined.includes('drama')) return 'Drama';
    if (combined.includes('comedy')) return 'Comedy';
    if (combined.includes('documentary')) return 'Documentary';
    if (combined.includes('science fiction') || combined.includes('sci-fi')) return 'Science Fiction';
    if (combined.includes('mystery') || combined.includes('detective')) return 'Mystery';
    if (combined.includes('horror')) return 'Horror';
    if (combined.includes('history')) return 'History';
    
    return 'Drama'; // Default for BBC Radio
  }

  parseRuntime(runtime) {
    if (!runtime) return 0;
    const match = runtime.match(/(\d+):(\d+):(\d+)/);
    if (match) {
      return parseInt(match[1]) * 3600 + parseInt(match[2]) * 60 + parseInt(match[3]);
    }
    return 0;
  }

  async getFeatured(limit = 50) {
    return this.search({ limit });
  }
}

export const bbcRadioAPI = new BBCRadioAPI();
