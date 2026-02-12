/**
 * Unified Audiobook API
 * Combines LibriVox, Internet Archive, Project Gutenberg
 * All APIs are free with no authentication required
 */

// LibriVox API Service
class LibriVoxAPI {
  constructor() {
    this.baseUrl = 'https://librivox.org/api/feed/audiobooks';
    // AllOrigins - reliable CORS proxy
    this.corsProxy = 'https://api.allorigins.win/raw?url=';
  }

  async search({ query = '', limit = 50, offset = 0 }) {
    try {
      const params = new URLSearchParams({
        format: 'json',
        limit: limit.toString(),
        offset: offset.toString(),
        extended: '1'
      });

      if (query) params.append('title', `^${query}`);

      const url = `${this.baseUrl}?${params}`;
      
      // Always use CORS proxy for LibriVox (they don't support CORS)
      const proxiedUrl = `${this.corsProxy}${encodeURIComponent(url)}`;
      const response = await fetch(proxiedUrl);
      const data = await response.json();
      
      return {
        success: true,
        books: (data.books || []).map(this.normalizeBook),
        total: data.books?.length || 0,
        source: 'librivox'
      };
    } catch (error) {
      return { success: false, books: [], error: error.message, source: 'librivox' };
    }
  }

  normalizeBook(book) {
    return {
      id: `librivox-${book.id}`,
      _rawId: book.id.toString(),
      title: book.title || 'Untitled',
      author: book.authors?.[0] 
        ? `${book.authors[0].first_name} ${book.authors[0].last_name}`.trim()
        : 'Unknown',
      description: book.description || '',
      language: book.language || 'en',
      genre: book.genres?.[0]?.name || 'General',
      duration: book.totaltimesecs || 0,
      sections: book.num_sections || 0,
      audioUrl: book.url_zip_file || null,
      coverUrl: book.url_cover || null,
      detailsUrl: book.url_librivox || `https://librivox.org/book/${book.id}`,
      source: 'librivox',
      sourceLabel: 'LibriVox'
    };
  }
}

// Internet Archive API Service
class InternetArchiveAPI {
  constructor() {
    this.baseUrl = 'https://archive.org/advancedsearch.php';
    this.corsProxy = 'https://api.allorigins.win/raw?url=';
  }

  async search({ query = '', limit = 50, page = 1 }) {
    try {
      const searchQuery = query 
        ? `(${query}) AND mediatype:audio AND (subject:audiobook OR subject:librivox)`
        : 'mediatype:audio AND (subject:audiobook OR subject:librivox)';

      const params = new URLSearchParams({
        q: searchQuery,
        fl: 'identifier,title,creator,description,date,downloads,runtime,subject,language',
        rows: limit.toString(),
        page: page.toString(),
        output: 'json',
        sort: 'downloads desc'
      });

      const url = `${this.baseUrl}?${params}`;
      
      // Try direct first (Archive.org usually allows CORS)
      let response;
      try {
        response = await fetch(url);
        if (!response.ok) throw new Error('Direct fetch failed');
      } catch (error) {
        // Fallback to proxy
        const proxiedUrl = `${this.corsProxy}${encodeURIComponent(url)}`;
        response = await fetch(proxiedUrl);
      }
      
      const data = await response.json();
      
      return {
        success: true,
        books: (data.response?.docs || []).map(this.normalizeBook),
        total: data.response?.numFound || 0,
        source: 'archive'
      };
    } catch (error) {
      return { success: false, books: [], error: error.message, source: 'archive' };
    }
  }

  async getBookAudio(identifier) {
    try {
      const response = await fetch(`https://archive.org/metadata/${identifier}`);
      const data = await response.json();
      
      const audioFiles = (data.files || []).filter(f => 
        f.format === 'VBR MP3' || f.format === 'Ogg Vorbis' || f.format === '64Kbps MP3'
      );

      return audioFiles.length > 0
        ? `https://archive.org/download/${identifier}/${audioFiles[0].name}`
        : null;
    } catch (error) {
      return null;
    }
  }

  normalizeBook(doc) {
    return {
      id: `archive-${doc.identifier}`,
      _rawId: doc.identifier,
      title: doc.title || 'Untitled',
      author: doc.creator || 'Unknown',
      description: doc.description || '',
      language: doc.language || 'en',
      genre: Array.isArray(doc.subject) ? doc.subject[0] : 'General',
      duration: this.parseRuntime(doc.runtime),
      audioUrl: null, // Will be fetched on-demand
      coverUrl: `https://archive.org/services/img/${doc.identifier}`,
      detailsUrl: `https://archive.org/details/${doc.identifier}`,
      downloads: doc.downloads || 0,
      source: 'archive',
      sourceLabel: 'Internet Archive'
    };
  }

  parseRuntime(runtime) {
    if (!runtime) return 0;
    const match = runtime.match(/(\d+):(\d+):(\d+)/);
    if (match) {
      return parseInt(match[1]) * 3600 + parseInt(match[2]) * 60 + parseInt(match[3]);
    }
    return 0;
  }
}

// Open Library API Service (for metadata enrichment)
class OpenLibraryAPI {
  constructor() {
    this.baseUrl = 'https://openlibrary.org';
  }

  async search({ query = '', limit = 50 }) {
    try {
      const params = new URLSearchParams({
        q: query,
        limit: limit.toString(),
        fields: 'key,title,author_name,first_publish_year,cover_i,subject'
      });

      const response = await fetch(`${this.baseUrl}/search.json?${params}`);
      const data = await response.json();

      return {
        success: true,
        books: (data.docs || []).map(this.normalizeBook),
        total: data.numFound || 0,
        source: 'openlibrary'
      };
    } catch (error) {
      return { success: false, books: [], error: error.message, source: 'openlibrary' };
    }
  }

  normalizeBook(doc) {
    return {
      id: `ol-${doc.key.replace('/works/', '')}`,
      title: doc.title || 'Untitled',
      author: doc.author_name?.[0] || 'Unknown',
      description: '',
      language: 'en',
      genre: doc.subject?.[0] || 'General',
      duration: 0,
      audioUrl: null,
      coverUrl: doc.cover_i 
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
        : null,
      detailsUrl: `https://openlibrary.org${doc.key}`,
      pubYear: doc.first_publish_year,
      source: 'openlibrary',
      sourceLabel: 'Open Library'
    };
  }
}

// Project Gutenberg API Service (via Gutendex)
class ProjectGutenbergAPI {
  constructor() {
    this.baseUrl = 'https://gutendex.com/books';
  }

  async search({ query = '', limit = 32 }) {
    try {
      const params = new URLSearchParams();
      if (query) params.append('search', query);

      const response = await fetch(`${this.baseUrl}?${params}`);
      const data = await response.json();

      const books = (data.results || [])
        .slice(0, limit)
        .map(this.normalizeBook);

      return {
        success: true,
        books,
        total: data.count || books.length,
        source: 'gutenberg'
      };
    } catch (error) {
      console.error('Gutenberg error:', error);
      return { success: false, books: [], error: error.message, source: 'gutenberg' };
    }
  }

  normalizeBook(book) {
    const author = book.authors?.[0]?.name || 'Unknown';
    const subjects = book.subjects || [];
    const genre = subjects.find(s => !s.includes('--')) || 'General';
    const language = book.languages?.[0] || 'en';
    const coverUrl = book.formats?.['image/jpeg'] || null;

    return {
      id: `gutenberg-${book.id}`,
      title: book.title || 'Untitled',
      author: author,
      description: subjects.slice(0, 3).join('; ') || 'Classic literature from Project Gutenberg',
      language: language,
      genre: genre,
      duration: 0,
      audioUrl: null, // Gutenberg is text-only
      coverUrl: coverUrl,
      detailsUrl: `https://www.gutenberg.org/ebooks/${book.id}`,
      downloads: book.download_count || 0,
      source: 'gutenberg',
      sourceLabel: 'Project Gutenberg (Text)',
      _rawId: book.id.toString()
    };
  }
}

// Unified API
export class AudiobookAPI {
  constructor() {
    this.sources = {
      librivox: new LibriVoxAPI(),
      archive: new InternetArchiveAPI(),
      openlibrary: new OpenLibraryAPI(),
      gutenberg: new ProjectGutenbergAPI()
      // Note: Loyal Books temporarily disabled due to SSL/CORS issues
    };
  }

  /**
   * Search across all sources
   */
  async searchAll(query, limit = 50) {
    const promises = [
      this.sources.librivox.search({ query, limit: Math.floor(limit / 2) }),
      this.sources.archive.search({ query, limit: Math.floor(limit / 2) })
    ];

    const results = await Promise.all(promises);
    
    const allBooks = results
      .filter(r => r.success)
      .flatMap(r => r.books);

    // Remove duplicates
    const uniqueBooks = this.deduplicateBooks(allBooks);

    return {
      success: true,
      books: uniqueBooks,
      total: uniqueBooks.length,
      sources: results.map(r => ({ source: r.source, count: r.books.length }))
    };
  }

  /**
   * Search specific source
   */
  async searchSource(source, query, limit = 50) {
    if (!this.sources[source]) {
      return { success: false, error: 'Invalid source' };
    }
    return this.sources[source].search({ query, limit });
  }

  /**
   * Get featured/popular books
   */
  async getFeatured(limit = 20) {
    return this.sources.archive.search({ limit });
  }

  /**
   * Get audio URL for Internet Archive book
   */
  async getArchiveAudioUrl(rawId) {
    return this.sources.archive.getBookAudio(rawId);
  }

  /**
   * Remove duplicate books based on title similarity
   */
  deduplicateBooks(books) {
    const seen = new Map();
    
    return books.filter(book => {
      const key = this.normalizeString(book.title) + '_' + this.normalizeString(book.author);
      
      if (seen.has(key)) {
        return false;
      }
      
      seen.set(key, true);
      return true;
    });
  }

  normalizeString(str) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
  }
}

export const audiobookAPI = new AudiobookAPI();