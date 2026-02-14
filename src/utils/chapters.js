/**
 * Chapter Management Utilities
 * Fetch all audio files/chapters for a book from different sources
 */

/**
 * Fetch chapters from LibriVox
 */
export async function fetchLibriVoxChapters(bookId) {
  try {
    // LibriVox provides sections (chapters) in their API
    const response = await fetch(
      `https://librivox.org/api/feed/audiobooks/?id=${bookId}&format=json&extended=1`
    );
    const data = await response.json();
    
    if (!data.books || data.books.length === 0) {
      return { success: false, chapters: [] };
    }

    const book = data.books[0];
    
    // Get sections from the book
    const sections = book.sections || [];
    
    // Normalize chapters
    const chapters = sections.map((section, index) => ({
      id: section.id,
      number: index + 1,
      title: section.title || `Chapter ${index + 1}`,
      audioUrl: section.listen_url,
      duration: parseInt(section.totaltimesecs) || 0,
      reader: section.readers?.[0]?.display_name || 'Unknown'
    }));

    return {
      success: true,
      chapters,
      totalDuration: chapters.reduce((sum, ch) => sum + ch.duration, 0)
    };
  } catch (error) {
    console.error('Error fetching LibriVox chapters:', error);
    return { success: false, chapters: [], error: error.message };
  }
}

/**
 * Fetch chapters from Internet Archive
 */
export async function fetchInternetArchiveChapters(identifier) {
  try {
    const response = await fetch(`https://archive.org/metadata/${identifier}`);
    const data = await response.json();

    if (!data.files) {
      return { success: false, chapters: [] };
    }

    // Find audio files (MP3, OGG, etc.)
    const audioFiles = data.files.filter(file => 
      file.format === 'VBR MP3' || 
      file.format === 'Ogg Vorbis' ||
      file.format === '64Kbps MP3' ||
      file.format === 'MP3'
    );

    // Sort by name (usually numbered)
    audioFiles.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return nameA.localeCompare(nameB, undefined, { numeric: true });
    });

    const chapters = audioFiles.map((file, index) => {
      // Extract chapter number/name from filename
      const fileName = file.name.replace(/\.(mp3|ogg)$/i, '');
      const chapterName = fileName
        .replace(/_/g, ' ')
        .replace(/^\d+\s*-?\s*/, '') // Remove leading numbers
        .trim() || `Chapter ${index + 1}`;

      return {
        id: `${identifier}-${index}`,
        number: index + 1,
        title: chapterName,
        audioUrl: `https://archive.org/download/${identifier}/${file.name}`,
        duration: parseDuration(file.length),
        size: file.size
      };
    });

    return {
      success: true,
      chapters,
      totalDuration: chapters.reduce((sum, ch) => sum + ch.duration, 0)
    };
  } catch (error) {
    console.error('Error fetching Internet Archive chapters:', error);
    return { success: false, chapters: [], error: error.message };
  }
}

/**
 * Parse duration from various formats
 */
function parseDuration(lengthStr) {
  if (!lengthStr) return 0;
  
  // Handle formats like "1:23:45" or "23:45"
  const parts = lengthStr.split(':').map(Number);
  
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 1) {
    return parts[0];
  }
  
  return 0;
}

/**
 * Unified chapter fetcher - determines source and fetches accordingly
 */
export async function fetchBookChapters(book) {
  if (!book) {
    return { success: false, chapters: [] };
  }

  // Extract raw ID if available
  const rawId = book._rawId || book.id;

  if (book.source === 'librivox') {
    // Extract LibriVox ID (format: "librivox-12345")
    const librivoxId = rawId.replace('librivox-', '');
    return fetchLibriVoxChapters(librivoxId);
  } 
  
  if (book.source === 'archive' || book.source === 'internet-archive' || book.source === 'storynory' || book.source === 'lit2go' || book.source === 'bbc') {
    // Use the raw identifier
    const identifier = book._rawId || rawId.replace('archive-', '').replace('storynory-', '').replace('lit2go-', '').replace('bbc-', '');
    return fetchInternetArchiveChapters(identifier);
  }

  // For other sources or single-file books, return single chapter
  if (book.audioUrl) {
    return {
      success: true,
      chapters: [{
        id: book.id,
        number: 1,
        title: book.title,
        audioUrl: book.audioUrl,
        duration: book.duration || 0
      }],
      totalDuration: book.duration || 0
    };
  }

  return { success: false, chapters: [] };
}