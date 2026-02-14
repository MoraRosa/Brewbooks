/**
 * Lit2Go API Service - Archive.org Version
 * Educational audiobooks from University of South Florida
 * Searches Archive.org for Lit2Go uploads
 */

class Lit2GoAPI {
  constructor() {
    this.baseUrl = 'https://archive.org/advancedsearch.php';
  }

  async search({ query = '', limit = 100 }) {
    try {
      console.log('Searching Archive.org for Lit2Go content...');
      
      // Search Archive.org for Lit2Go uploads
      const searchQuery = query 
        ? `(lit2go OR "lit 2 go" OR "lit-2-go") AND (${query}) AND mediatype:audio`
        : '(lit2go OR "lit 2 go" OR "lit-2-go") AND mediatype:audio';

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
      
      console.log('Found', books.length, 'Lit2Go books on Archive.org');

      return {
        success: true,
        books,
        total: books.length,
        source: 'lit2go'
      };
    } catch (error) {
      console.error('Lit2Go API error:', error);
      return {
        success: false,
        books: [],
        error: error.message,
        source: 'lit2go'
      };
    }
  }

  normalizeBook(doc) {
    // Determine genre from subjects
    const subjects = Array.isArray(doc.subject) ? doc.subject : [doc.subject].filter(Boolean);
    const genre = this.determineGenre(subjects);

    return {
      id: `lit2go-${doc.identifier}`,
      _rawId: doc.identifier,
      title: this.cleanTitle(doc.title || 'Untitled'),
      author: doc.creator || 'Lit2Go',
      description: doc.description || '',
      language: doc.language || 'en',
      genre: genre,
      duration: this.parseRuntime(doc.runtime),
      audioUrl: null, // Fetched on-demand
      coverUrl: `https://archive.org/services/img/${doc.identifier}`,
      detailsUrl: `https://archive.org/details/${doc.identifier}`,
      downloads: doc.downloads || 0,
      source: 'lit2go',
      sourceLabel: 'Lit2Go (Educational)',
      isEducational: true // Flag for educational badge
    };
  }

  cleanTitle(title) {
    // Remove "Lit2Go - " or "Lit2Go: " prefix
    return title.replace(/^Lit2Go\s*[-:]\s*/i, '').trim();
  }

  determineGenre(subjects) {
    const subjectStr = subjects.join(' ').toLowerCase();
    
    if (subjectStr.includes('poetry')) return 'Poetry';
    if (subjectStr.includes('drama') || subjectStr.includes('play')) return 'Drama';
    if (subjectStr.includes('fiction')) return 'Fiction';
    if (subjectStr.includes('children')) return 'Children\'s Literature';
    if (subjectStr.includes('history')) return 'History';
    if (subjectStr.includes('philosophy')) return 'Philosophy';
    if (subjectStr.includes('science')) return 'Science';
    
    return 'Educational';
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

export const lit2goAPI = new Lit2GoAPI();
