/**
 * Genre definitions and utilities for Brewbooks
 */

export const GENRES = {
  // Fiction
  FICTION: { 
    id: 'fiction', 
    name: 'Fiction', 
    icon: '📚', 
    svgIcon: 'book',
    color: '#8d6e63' 
  },
  MYSTERY: { 
    id: 'mystery', 
    name: 'Mystery & Thriller', 
    icon: '🔍', 
    svgIcon: 'search',
    color: '#424242' 
  },
  ROMANCE: { 
    id: 'romance', 
    name: 'Romance', 
    icon: '💕', 
    svgIcon: 'heart',
    color: '#e91e63' 
  },
  SCIFI: { 
    id: 'science-fiction', 
    name: 'Science Fiction', 
    icon: '🚀', 
    svgIcon: 'rocket',
    color: '#2196f3' 
  },
  FANTASY: { 
    id: 'fantasy', 
    name: 'Fantasy', 
    icon: '🐉', 
    svgIcon: 'sparkles',
    color: '#9c27b0' 
  },
  HISTORICAL: { 
    id: 'historical-fiction', 
    name: 'Historical Fiction', 
    icon: '⌛', 
    svgIcon: 'landmark',
    color: '#795548' 
  },
  ADVENTURE: { 
    id: 'adventure', 
    name: 'Adventure', 
    icon: '🗺️', 
    svgIcon: 'compass',
    color: '#ff6f00' 
  },
  HORROR: { 
    id: 'horror', 
    name: 'Horror', 
    icon: '👻', 
    svgIcon: 'ghost',
    color: '#212121' 
  },
  HUMOR: { 
    id: 'humor', 
    name: 'Humor', 
    icon: '😄', 
    svgIcon: 'smile',
    color: '#ffc107' 
  },
  
  // Non-Fiction
  NONFICTION: { 
    id: 'non-fiction', 
    name: 'Non-Fiction', 
    icon: '📖', 
    svgIcon: 'book-open',
    color: '#6d4c41' 
  },
  BIOGRAPHY: { 
    id: 'biography', 
    name: 'Biography & Memoir', 
    icon: '👤', 
    svgIcon: 'user',
    color: '#546e7a' 
  },
  HISTORY: { 
    id: 'history', 
    name: 'History', 
    icon: '🏛️', 
    svgIcon: 'scroll',
    color: '#8d6e63' 
  },
  PHILOSOPHY: { 
    id: 'philosophy', 
    name: 'Philosophy', 
    icon: '💭', 
    svgIcon: 'lightbulb',
    color: '#5e35b1' 
  },
  SCIENCE: { 
    id: 'science', 
    name: 'Science & Nature', 
    icon: '🔬', 
    svgIcon: 'flask',
    color: '#00897b' 
  },
  RELIGION: { 
    id: 'religion', 
    name: 'Religion & Spirituality', 
    icon: '🕊️', 
    svgIcon: 'feather',
    color: '#673ab7' 
  },
  SELFHELP: { 
    id: 'self-help', 
    name: 'Self-Help', 
    icon: '🌟', 
    svgIcon: 'star',
    color: '#d32f2f' 
  },
  
  // Other
  POETRY: { 
    id: 'poetry', 
    name: 'Poetry', 
    icon: '✍️', 
    svgIcon: 'feather',
    color: '#c2185b' 
  },
  DRAMA: { 
    id: 'drama', 
    name: 'Drama & Plays', 
    icon: '🎭', 
    svgIcon: 'theater',
    color: '#7b1fa2' 
  },
  CHILDREN: { 
    id: 'children', 
    name: 'Children\'s Literature', 
    icon: '🧒', 
    svgIcon: 'baby',
    color: '#ff9800' 
  },
  YOUNGADULT: { 
    id: 'young-adult', 
    name: 'Young Adult', 
    icon: '📱', 
    svgIcon: 'users',
    color: '#00bcd4' 
  },
  CLASSICS: { 
    id: 'classics', 
    name: 'Classics', 
    icon: '📜', 
    svgIcon: 'scroll',
    color: '#5d4037' 
  },
  SHORTSTORIES: { 
    id: 'short-stories', 
    name: 'Short Stories', 
    icon: '📝', 
    svgIcon: 'file-text',
    color: '#26a69a' 
  }
};

// Organized by category
export const GENRE_CATEGORIES = {
  fiction: {
    name: 'Fiction',
    genres: [
      GENRES.FICTION,
      GENRES.MYSTERY,
      GENRES.ROMANCE,
      GENRES.SCIFI,
      GENRES.FANTASY,
      GENRES.HISTORICAL,
      GENRES.ADVENTURE,
      GENRES.HORROR,
      GENRES.HUMOR
    ]
  },
  nonfiction: {
    name: 'Non-Fiction',
    genres: [
      GENRES.NONFICTION,
      GENRES.BIOGRAPHY,
      GENRES.HISTORY,
      GENRES.PHILOSOPHY,
      GENRES.SCIENCE,
      GENRES.RELIGION,
      GENRES.SELFHELP
    ]
  },
  other: {
    name: 'Other Categories',
    genres: [
      GENRES.POETRY,
      GENRES.DRAMA,
      GENRES.CHILDREN,
      GENRES.YOUNGADULT,
      GENRES.CLASSICS,
      GENRES.SHORTSTORIES
    ]
  }
};

// All genres as flat array
export const ALL_GENRES = Object.values(GENRES);

// Map genre keywords to standardized genres
export const GENRE_KEYWORDS = {
  // Fiction
  'fiction': GENRES.FICTION,
  'novel': GENRES.FICTION,
  'literature': GENRES.FICTION,
  
  // Mystery
  'mystery': GENRES.MYSTERY,
  'detective': GENRES.MYSTERY,
  'thriller': GENRES.MYSTERY,
  'crime': GENRES.MYSTERY,
  
  // Romance
  'romance': GENRES.ROMANCE,
  'love': GENRES.ROMANCE,
  
  // Sci-Fi
  'science fiction': GENRES.SCIFI,
  'sci-fi': GENRES.SCIFI,
  'scifi': GENRES.SCIFI,
  
  // Fantasy
  'fantasy': GENRES.FANTASY,
  'magic': GENRES.FANTASY,
  
  // Historical
  'historical': GENRES.HISTORICAL,
  'historical fiction': GENRES.HISTORICAL,
  
  // Adventure
  'adventure': GENRES.ADVENTURE,
  'action': GENRES.ADVENTURE,
  
  // Horror
  'horror': GENRES.HORROR,
  'gothic': GENRES.HORROR,
  
  // Humor
  'humor': GENRES.HUMOR,
  'humour': GENRES.HUMOR,
  'comedy': GENRES.HUMOR,
  
  // Non-Fiction
  'non-fiction': GENRES.NONFICTION,
  'nonfiction': GENRES.NONFICTION,
  
  // Biography
  'biography': GENRES.BIOGRAPHY,
  'memoir': GENRES.BIOGRAPHY,
  'autobiography': GENRES.BIOGRAPHY,
  
  // History
  'history': GENRES.HISTORY,
  
  // Philosophy
  'philosophy': GENRES.PHILOSOPHY,
  
  // Science
  'science': GENRES.SCIENCE,
  'nature': GENRES.SCIENCE,
  'natural history': GENRES.SCIENCE,
  
  // Religion
  'religion': GENRES.RELIGION,
  'spirituality': GENRES.RELIGION,
  'theology': GENRES.RELIGION,
  
  // Self-Help
  'self-help': GENRES.SELFHELP,
  'self help': GENRES.SELFHELP,
  
  // Poetry
  'poetry': GENRES.POETRY,
  'poems': GENRES.POETRY,
  'verse': GENRES.POETRY,
  
  // Drama
  'drama': GENRES.DRAMA,
  'plays': GENRES.DRAMA,
  'theatre': GENRES.DRAMA,
  'theater': GENRES.DRAMA,
  
  // Children
  'children': GENRES.CHILDREN,
  'juvenile': GENRES.CHILDREN,
  
  // Young Adult
  'young adult': GENRES.YOUNGADULT,
  'ya': GENRES.YOUNGADULT,
  'teen': GENRES.YOUNGADULT,
  
  // Classics
  'classics': GENRES.CLASSICS,
  'classic': GENRES.CLASSICS,
  
  // Short Stories
  'short stories': GENRES.SHORTSTORIES,
  'short story': GENRES.SHORTSTORIES
};

/**
 * Match a genre string to a standardized genre
 */
export function matchGenre(genreString) {
  if (!genreString) return GENRES.FICTION; // Default
  
  const normalized = genreString.toLowerCase().trim();
  
  // Direct match
  if (GENRE_KEYWORDS[normalized]) {
    return GENRE_KEYWORDS[normalized];
  }
  
  // Partial match
  for (const [keyword, genre] of Object.entries(GENRE_KEYWORDS)) {
    if (normalized.includes(keyword)) {
      return genre;
    }
  }
  
  // Default
  return GENRES.FICTION;
}

/**
 * Get genre color
 */
export function getGenreColor(genreId) {
  const genre = Object.values(GENRES).find(g => g.id === genreId);
  return genre?.color || '#8d6e63';
}

/**
 * Get genre icon
 */
export function getGenreIcon(genreId) {
  const genre = Object.values(GENRES).find(g => g.id === genreId);
  return genre?.icon || '📚';
}