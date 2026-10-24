/**
 * Cover Service: Fetches and caches high-definition book cover images
 * Uses Open Library Covers API with local storage caching and graceful fallbacks.
 */

const CACHE_PREFIX = 'mindsprint_cover_';

const CURATED_COVERS: Record<string, string> = {
  'thinking-fast-slow': 'https://covers.openlibrary.org/b/id/13290711-L.jpg',
  'atomic-habits': 'https://covers.openlibrary.org/b/id/12539702-L.jpg',
  'principles-dalio': 'https://covers.openlibrary.org/b/id/8315355-L.jpg',
  'good-to-great': 'https://covers.openlibrary.org/b/id/14389659-L.jpg',
  'deep-work': 'https://covers.openlibrary.org/b/id/7988607-L.jpg',
  'psychology-of-money': 'https://covers.openlibrary.org/b/id/10389354-L.jpg',
  'antifragile': 'https://covers.openlibrary.org/b/id/9180157-L.jpg',
  'high-output-mgmt': 'https://covers.openlibrary.org/b/id/421244-L.jpg',
  'essentialism': 'https://covers.openlibrary.org/b/id/7285986-L.jpg',
  'sapiens': 'https://covers.openlibrary.org/b/id/8634250-L.jpg',
  'meditations': 'https://covers.openlibrary.org/b/id/13202688-L.jpg',
  'the-republic': 'https://covers.openlibrary.org/b/id/14418448-L.jpg',
  'art-of-war': 'https://covers.openlibrary.org/b/id/4849549-L.jpg',
  'nicomachean-ethics': 'https://covers.openlibrary.org/b/id/12593945-L.jpg',
  'thinking-in-systems': 'https://covers.openlibrary.org/b/id/14420637-L.jpg'
};

export async function fetchBookCover(title: string, author?: string, bookId?: string): Promise<string | null> {
  // 1. Check curated mapping first
  if (bookId && CURATED_COVERS[bookId]) {
    return CURATED_COVERS[bookId];
  }

  const normalizedKey = `${title.toLowerCase().trim()}_${(author || '').toLowerCase().trim()}`;
  
  // 2. Check localStorage cache
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + normalizedKey);
    if (cached) {
      return cached;
    }
  } catch (e) {
    // LocalStorage might be sandboxed or disabled
  }

  // 3. Dynamic Open Library search
  try {
    const query = encodeURIComponent(`${title} ${author || ''}`.trim());
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://openlibrary.org/search.json?q=${query}&limit=3`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;

    const data = await res.json();
    const docs = data.docs || [];
    
    for (const doc of docs) {
      if (doc.cover_i && doc.cover_i > 0) {
        const coverUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
        try {
          localStorage.setItem(CACHE_PREFIX + normalizedKey, coverUrl);
        } catch (_) {}
        return coverUrl;
      } else if (doc.isbn && doc.isbn.length > 0) {
        const coverUrl = `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-L.jpg`;
        try {
          localStorage.setItem(CACHE_PREFIX + normalizedKey, coverUrl);
        } catch (_) {}
        return coverUrl;
      }
    }
  } catch (err) {
    // Network failure or timeout - fallback safely
    console.debug('[CoverService] Cover lookup fallback for', title, err);
  }

  return null;
}

export function getCuratedCover(id: string): string | undefined {
  return CURATED_COVERS[id];
}
