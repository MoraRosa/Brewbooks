/**
 * Storynory API Service
 * Free original children's audiobooks via RSS feed
 * https://www.storynory.com
 */

class StorynoryAPI {
  constructor() {
    this.feedUrl = 'https://www.storynory.com/feed/';
    // Try cors.eu.org instead of allorigins
    this.corsProxy = 'https://cors.eu.org/';
  }

  async search({ query = '', limit = 50 }) {
    try {
      // Fetch RSS feed through CORS proxy
      const proxyUrl = `${this.corsProxy}${this.feedUrl}`;
      console.log('Fetching Storynory from:', proxyUrl);
      
      const response = await fetch(proxyUrl);
      const text = await response.text();
      
      // Parse XML
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, 'text/xml');
      const items = xml.querySelectorAll('item');
      
      let books = [];
      
      for (let i = 0; i < items.length && books.length < limit; i++) {
        const item = items[i];
        const book = this.parseRSSItem(item);
        
        // Filter by query if provided
        if (query) {
          const searchTerm = query.toLowerCase();
          if (!book.title.toLowerCase().includes(searchTerm) && 
              !book.description.toLowerCase().includes(searchTerm)) {
            continue;
          }
        }
        
        books.push(book);
      }

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

  parseRSSItem(item) {
    const getTextContent = (selector) => {
      const element = item.querySelector(selector);
      return element ? element.textContent.trim() : '';
    };

    const title = getTextContent('title');
    const description = getTextContent('description');
    const link = getTextContent('link');
    const pubDate = getTextContent('pubDate');
    
    // Get audio URL from enclosure
    const enclosure = item.querySelector('enclosure');
    const audioUrl = enclosure ? enclosure.getAttribute('url') : null;
    
    // Get duration if available
    const itunesDuration = item.querySelector('duration');
    const duration = itunesDuration ? this.parseDuration(itunesDuration.textContent) : 0;
    
    // Get image
    const itunesImage = item.querySelector('image');
    const coverUrl = itunesImage ? itunesImage.getAttribute('href') : 
                     'https://www.storynory.com/wp-content/uploads/2023/08/Storynory-logo-2023.png';
    
    // Extract ID from link
    const id = link.split('/').filter(Boolean).pop() || Math.random().toString(36).substring(7);
    
    // Get category/genre
    const category = getTextContent('category') || 'Children\'s Stories';

    return {
      id: `storynory-${id}`,
      title: this.cleanTitle(title),
      author: 'Storynory',
      description: this.cleanDescription(description),
      language: 'en',
      genre: category,
      duration: duration,
      audioUrl: audioUrl,
      coverUrl: coverUrl,
      detailsUrl: link,
      source: 'storynory',
      sourceLabel: 'Storynory (Original)',
      pubDate: pubDate,
      isOriginal: true // Flag for "Original Story" badge
    };
  }

  cleanTitle(title) {
    // Remove "Storynory - " prefix if present
    return title.replace(/^Storynory\s*-\s*/i, '').trim();
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

  parseDuration(durationStr) {
    if (!durationStr) return 0;
    
    // Format: HH:MM:SS or MM:SS
    const parts = durationStr.split(':').map(Number);
    
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    
    return 0;
  }

  /**
   * Get featured/latest stories
   */
  async getFeatured(limit = 20) {
    return this.search({ limit });
  }
}

export const storynoryAPI = new StorynoryAPI();