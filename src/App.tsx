import React, { useState, useMemo, useEffect } from 'react';
import { BookSummary } from './types';
import { CURATED_BOOKS } from './data/curatedBooks';
import { SynthesisService } from './services/synthesisService';
import { Navbar } from './components/Navbar';
import { BookCard } from './components/BookCard';
import { ReaderModal } from './components/ReaderModal';
import { AudioPlayer } from './components/AudioPlayer';
import { InfiniteSynthesizeModal } from './components/InfiniteSynthesizeModal';
import { Sparkles, Zap, ShieldCheck, Headphones, Compass, BookOpen, Scroll, GraduationCap } from 'lucide-react';

export const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Syntheses');
  const [activeBook, setActiveBook] = useState<BookSummary | null>(null);
  const [audioState, setAudioState] = useState<{ book: BookSummary; text: string } | null>(null);
  const [isSynthesizerOpen, setIsSynthesizerOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Apple Design Award Brighter Theme by default (Alabaster Silk) with toggle
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('mindsprint_theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mindsprint_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mindsprint_theme', 'light');
    }
  }, [isDarkMode]);

  // Navigation History Stack (Back / Forward history)
  const [history, setHistory] = useState<string[]>(['category:All Syntheses']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const pushHistory = (stateId: string) => {
    const updated = history.slice(0, historyIndex + 1);
    updated.push(stateId);
    setHistory(updated);
    setHistoryIndex(updated.length - 1);
  };

  const handleNavigateBack = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      applyHistoryState(history[prevIndex]);
    }
  };

  const handleNavigateForward = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      applyHistoryState(history[nextIndex]);
    }
  };

  const applyHistoryState = (stateId: string) => {
    if (stateId.startsWith('book:')) {
      const bookId = stateId.replace('book:', '');
      const b = SynthesisService.getBookById(bookId);
      if (b) setActiveBook(b);
    } else if (stateId.startsWith('category:')) {
      const cat = stateId.replace('category:', '');
      setSelectedCategory(cat);
      setActiveBook(null);
    }
  };

  // Filter books based on search & category
  const filteredBooks = useMemo(() => {
    let books = SynthesisService.getAllBooks();

    if (selectedCategory !== 'All Syntheses') {
      books = books.filter(b => b.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      books = books.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.spark.executiveThesis.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        (b.originalLanguage && b.originalLanguage.toLowerCase().includes(q))
      );
    }

    return books;
  }, [searchQuery, selectedCategory, refreshKey]);

  // Active book navigation (Next / Previous within filtered catalog)
  const activeBookIndex = useMemo(() => {
    if (!activeBook) return -1;
    return filteredBooks.findIndex(b => b.id === activeBook.id);
  }, [activeBook, filteredBooks]);

  const handleSelectBook = (book: BookSummary) => {
    setActiveBook(book);
    pushHistory(`book:${book.id}`);
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setActiveBook(null);
    pushHistory(`category:${cat}`);
  };

  const handleNavigatePreviousBook = () => {
    if (activeBookIndex > 0) {
      const prevBook = filteredBooks[activeBookIndex - 1];
      setActiveBook(prevBook);
      pushHistory(`book:${prevBook.id}`);
    }
  };

  const handleNavigateNextBook = () => {
    if (activeBookIndex >= 0 && activeBookIndex < filteredBooks.length - 1) {
      const nextBook = filteredBooks[activeBookIndex + 1];
      setActiveBook(nextBook);
      pushHistory(`book:${nextBook.id}`);
    }
  };

  const handleStartAudio = (book: BookSummary, text: string) => {
    setAudioState({ book, text });
  };

  const handleQuickPlay = (book: BookSummary, e: React.MouseEvent) => {
    e.stopPropagation();
    const quickText = `${book.title} by ${book.author}. Executive thesis: ${book.spark.executiveThesis}. The bottom line: ${book.spark.bottomLine}.`;
    setAudioState({ book, text: quickText });
  };

  const handleSynthesized = (book: BookSummary) => {
    setIsSynthesizerOpen(false);
    setRefreshKey(prev => prev + 1);
    handleSelectBook(book);
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] dark:bg-[#08090E] text-gray-900 dark:text-[#F3F4F6] flex flex-col selection:bg-[#C59B37]/30 selection:text-black dark:selection:text-white transition-colors duration-300">
      
      {/* Top Navigation Bar with Back/Forward & Theme Switcher */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSynthesizer={() => setIsSynthesizerOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        canGoBack={historyIndex > 0}
        canGoForward={historyIndex < history.length - 1}
        onNavigateBack={handleNavigateBack}
        onNavigateForward={handleNavigateForward}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(prev => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Apple Design Award Hero Section */}
        <section className="relative mb-12 p-8 sm:p-12 rounded-3xl bg-white dark:bg-gradient-to-br dark:from-[#121522] dark:via-[#0E1018] dark:to-[#08090D] border border-black/[0.08] dark:border-white/10 shadow-lg dark:shadow-2xl overflow-hidden transition-colors">
          
          {/* Subtle Ambient Radial Accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C59B37]/10 dark:bg-[#E5C17D]/10 blur-3xl pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 blur-3xl pointer-events-none rounded-full" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C59B37]/10 border border-[#C59B37]/30 text-[#8C6A1E] dark:text-[#E5C17D] text-xs font-bold tracking-wide uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Universal Ancient Canon, Academic & Multilingual Synthesis</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
              Master Any Text in Minutes. <br />
              <span className="gold-text-gradient">From Ancient Greek to Modern Treatises.</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-light">
              Engineered to outclass standard 15-minute apps. Synthesize non-fiction, 
              <strong> ancient classical manuscripts</strong> (Greek, Latin, Classical Chinese, Arabic, Sanskrit), and 
              <strong> dense academic treatises</strong> with bilingual philology, mathematical frameworks, and the definitive 
              <strong> 40-Minute Shortform Masterclass</strong> in any language.
            </p>

            {/* Quick Metrics Bar */}
            <div className="mt-8 pt-6 border-t border-black/[0.06] dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Scroll className="w-4 h-4 text-amber-500" />
                <span>Ancient Philology & Epigraphy</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <GraduationCap className="w-4 h-4 text-sky-500" />
                <span>Formal Academic Epistemology</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Headphones className="w-4 h-4 text-emerald-500" />
                <span>Multilingual Studio Narration</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Compass className="w-4 h-4 text-purple-500" />
                <span>Bilingual Script Citations</span>
              </div>
            </div>

          </div>
        </section>

        {/* Catalog Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold font-serif text-gray-900 dark:text-white flex items-center gap-2">
              <span>{selectedCategory === 'All Syntheses' ? 'Curated Cornerstone Canon' : selectedCategory}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-black/[0.05] dark:bg-white/10 text-gray-600 dark:text-gray-400 font-sans font-semibold">
                {filteredBooks.length} works
              </span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">High-impact literature distilled with zero cognitive dilution</p>
          </div>

          <button
            onClick={() => setIsSynthesizerOpen(true)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#8C6A1E] dark:text-[#E5C17D] hover:underline transition cursor-pointer"
          >
            <span>Synthesize any new manuscript</span>
            <span>→</span>
          </button>
        </div>

        {/* Book Grid */}
        {filteredBooks.length === 0 ? (
          <div className="py-20 text-center glass-panel rounded-3xl border border-black/[0.08] dark:border-white/10 p-8 shadow-xs">
            <BookOpen className="w-12 h-12 text-[#C59B37]/50 mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-2">No matching work in current view</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              MindSprint has zero limits. You can synthesize "{searchQuery}" on the fly with our universal cognitive engine.
            </p>
            <button
              onClick={() => setIsSynthesizerOpen(true)}
              className="px-6 py-3 rounded-xl bg-[#C59B37] text-white font-bold text-sm tracking-wide shadow-md hover:brightness-105 active:scale-95 transition cursor-pointer"
            >
              Synthesize "{searchQuery}" Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onOpen={handleSelectBook}
                onQuickPlay={handleQuickPlay}
              />
            ))}
          </div>
        )}

      </main>

      {/* Enterprise Footer */}
      <footer className="mt-20 border-t border-black/[0.06] dark:border-white/5 py-12 bg-[#EFECE6] dark:bg-[#06070B] text-xs text-gray-500 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#151824] border border-[#C59B37]/30 p-1 flex items-center justify-center overflow-hidden shadow-xs">
              <img src="/AppIcon.png" alt="MindSprint" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div>
              <span className="font-brand font-bold text-gray-800 dark:text-gray-300 tracking-wider">MINDSPRINT</span>
              <p className="text-[10px] text-gray-500">Universal Fair Use Study, Philology & Epistemic Synthesis</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-gray-600 dark:text-gray-500">
            <span>Apple Design Award Architecture</span>
            <span>App Store Guideline 5.2.2 Compliant</span>
            <span>Ancient Epigraphy Canon</span>
            <span>API Docs</span>
          </div>

          <div className="text-right text-[11px] text-gray-500">
            © 2026 A. Alex Mohit. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Reader Modal with Next / Previous Arrows & Keyboard Controls */}
      {activeBook && (
        <ReaderModal
          book={activeBook}
          onClose={() => setActiveBook(null)}
          onStartAudio={handleStartAudio}
          onNavigatePrevious={handleNavigatePreviousBook}
          onNavigateNext={handleNavigateNextBook}
          hasPrevious={activeBookIndex > 0}
          hasNext={activeBookIndex >= 0 && activeBookIndex < filteredBooks.length - 1}
        />
      )}

      {/* Floating Audio Player */}
      {audioState && (
        <AudioPlayer
          book={audioState.book}
          textToRead={audioState.text}
          onClose={() => setAudioState(null)}
        />
      )}

      {/* Universal Synthesize Modal */}
      {isSynthesizerOpen && (
        <InfiniteSynthesizeModal
          onClose={() => setIsSynthesizerOpen(false)}
          onSynthesized={handleSynthesized}
        />
      )}

    </div>
  );
};
