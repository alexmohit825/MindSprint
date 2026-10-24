import { BookSummary, TextType } from '../types';
import { CURATED_BOOKS } from '../data/curatedBooks';
import { fetchBookCover } from './coverService';

const LOCAL_STORAGE_KEY = 'mindsprint_custom_synthesized_books';

export class SynthesisService {
  private static customBooks: BookSummary[] = [];

  static {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        this.customBooks = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage unavailable for custom books');
    }
  }

  static getAllBooks(): BookSummary[] {
    return [...this.customBooks, ...CURATED_BOOKS];
  }

  static getBookById(id: string): BookSummary | undefined {
    return this.getAllBooks().find(b => b.id.toLowerCase() === id.toLowerCase());
  }

  static searchBooks(query: string): BookSummary[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.getAllBooks();

    return this.getAllBooks().filter(book => 
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      book.category.toLowerCase().includes(q) ||
      book.subtitle.toLowerCase().includes(q) ||
      (book.originalLanguage && book.originalLanguage.toLowerCase().includes(q))
    );
  }

  /**
   * Real Edge AI Synthesis via Cloudflare Worker (/api/synthesize).
   * ZERO mad-lib fallbacks: If the real API fails, it throws an honest error.
   */
  static async synthesizeBook(
    title: string,
    author?: string,
    category: string = 'General',
    targetLanguage: string = 'English'
  ): Promise<BookSummary> {
    const cleanTitle = title.trim();
    const cleanAuthor = author?.trim() || '';

    // Check existing library first
    const existing = this.getAllBooks().find(
      b => b.title.toLowerCase() === cleanTitle.toLowerCase() &&
           (!cleanAuthor || b.author.toLowerCase().includes(cleanAuthor.toLowerCase()))
    );
    if (existing) return existing;

    // Call Cloudflare Worker endpoint
    const response = await fetch('/api/synthesize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: cleanTitle,
        author: cleanAuthor,
        category,
        targetLanguage
      })
    });

    if (!response.ok) {
      let errorMsg = `Synthesis failed with status ${response.status}`;
      try {
        const errJson = await response.json();
        if (errJson.error) errorMsg = errJson.error;
      } catch (_) {}
      throw new Error(errorMsg);
    }

    const book: BookSummary = await response.json();
    if (!book.cover || !book.cover.coverUrl) {
      const coverUrl = await fetchBookCover(cleanTitle, cleanAuthor);
      if (coverUrl) {
        book.cover = book.cover || {
          bgGradient: 'from-slate-900 to-black',
          accentColor: '#E5C17D',
          motif: 'Hardcover',
          tagline: ''
        };
        book.cover.coverUrl = coverUrl;
      }
    }

    this.saveCustomBook(book);
    return book;
  }

  static async searchOnline(query: string, author?: string): Promise<Array<{ title: string; author: string; year: string; coverUrl: string }>> {
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (author) params.append('author', author);
      const res = await fetch(`/api/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        return data.results || [];
      }
    } catch (e) {
      console.warn('Online search failed', e);
    }
    return [];
  }

  private static saveCustomBook(book: BookSummary) {
    this.customBooks = [book, ...this.customBooks.filter(b => b.id !== book.id)];
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.customBooks));
    } catch (e) {
      console.warn('Failed to persist custom book to localStorage');
    }
  }
}
