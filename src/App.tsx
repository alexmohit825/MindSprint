import React, { useState, useMemo } from 'react';
import { BookSummary } from './types';
import { CURATED_BOOKS } from './data/curatedBooks';
import { SynthesisService } from './services/synthesisService';
import { Navbar } from './components/Navbar';
import { BookCard } from './components/BookCard';
import { ReaderModal } from './components/ReaderModal';
import { AudioPlayer } from './components/AudioPlayer';
import { InfiniteSynthesizeModal } from './components/InfiniteSynthesizeModal';
import { Sparkles, Zap, ShieldCheck, Headphones, Layers, TrendingUp, BookOpen, Compass } from 'lucide-react';

export const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Syntheses');
  const [activeBook, setActiveBook] = useState<BookSummary | null>(null);
  const [audioState, setAudioState] = useState<{ book: BookSummary; text: string } | null>(null);
  const [isSynthesizerOpen, setIsSynthesizerOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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
        b.category.toLowerCase().includes(q)
      );
    }

    return books;
  }, [searchQuery, selectedCategory, refreshKey]);

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
    setActiveBook(book);
  };

  return (
    <div className="min-h-screen bg-[#08090E] text-[#F3F4F6] flex flex-col selection:bg-[#E5C17D]/30 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSynthesizer={() => setIsSynthesizerOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Hero Section */}
        <section className="relative mb-12 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#121522] via-[#0E1018] to-[#08090D] border border-white/10 shadow-2xl overflow-hidden">
          
          {/* Ambient Radial Lights */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E5C17D]/10 blur-3xl pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 blur-3xl pointer-events-none rounded-full" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5C17D]/10 border border-[#E5C17D]/30 text-[#E5C17D] text-xs font-bold tracking-wide uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Universal Ancient Canon, Academic & Multilingual Synthesis</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              Master Any Text in Minutes. <br />
              <span className="gold-text-gradient">From Ancient Greek to Modern Treatises.</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-gray-300 leading-relaxed font-light">
              Engineered to outclass standard 15-minute apps. Synthesize non-fiction, 
              <strong> ancient classical manuscripts</strong> (Greek, Latin, Classical Chinese, Arabic, Sanskrit), and 
              <strong> dense academic treatises</strong> with bilingual philology, mathematical frameworks, and the definitive 
              <strong> 40-Minute Shortform Masterclass</strong> in any language.
            </p>

            {/* Quick Metrics Bar */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium">
              <div className="flex items-center gap-2 text-gray-300">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Ancient Philology & Epigraphy</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Formal Academic Epistemology</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Headphones className="w-4 h-4 text-sky-400" />
                <span>Multilingual Studio Narration</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Compass className="w-4 h-4 text-purple-400" />
                <span>Bilingual Script Citations</span>
              </div>
            </div>

          </div>
        </section>

        {/* Catalog Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2">
              <span>{selectedCategory === 'All Syntheses' ? 'Curated Cornerstone Library' : selectedCategory}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400 font-sans font-normal">
                {filteredBooks.length} titles
              </span>
            </h2>
            <p className="text-xs text-gray-400 mt-1">High-impact literature distilled with zero cognitive dilution</p>
          </div>

          <button
            onClick={() => setIsSynthesizerOpen(true)}
            className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#E5C17D] hover:text-white transition cursor-pointer"
          >
            <span>Synthesize any new book</span>
            <span>→</span>
          </button>
        </div>

        {/* Book Grid */}
        {filteredBooks.length === 0 ? (
          <div className="py-20 text-center glass-panel rounded-3xl border border-white/10 p-8">
            <BookOpen className="w-12 h-12 text-[#E5C17D]/40 mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-white mb-2">No matching title in current library</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
              MindSprint has no limits. You can synthesize "{searchQuery}" on the fly with our cognitive synthesis engine.
            </p>
            <button
              onClick={() => setIsSynthesizerOpen(true)}
              className="px-6 py-3 rounded-xl bg-[#E5C17D] text-[#090A0F] font-bold text-sm tracking-wide shadow-lg hover:brightness-110 active:scale-95 transition cursor-pointer"
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
                onOpen={setActiveBook}
                onQuickPlay={handleQuickPlay}
              />
            ))}
          </div>
        )}

      </main>

      {/* Enterprise Footer */}
      <footer className="mt-20 border-t border-white/5 py-12 bg-[#06070B] text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#E5C17D]/10 border border-[#E5C17D]/30 p-1 flex items-center justify-center">
              <img src="/logo.svg" alt="MindSprint" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-brand font-bold text-gray-300 tracking-wider">MINDSPRINT</span>
              <p className="text-[10px] text-gray-500">Transformative Fair Use Study & Synthesis Companion</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <span>Privacy Standard</span>
            <span>App Store Guideline 5.2.2 Compliant</span>
            <span>Terms of Intelligence</span>
            <span>API Docs</span>
          </div>

          <div className="text-right text-[11px] text-gray-500">
            © 2026 A. Alex Mohit. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Reader Modal */}
      {activeBook && (
        <ReaderModal
          book={activeBook}
          onClose={() => setActiveBook(null)}
          onStartAudio={handleStartAudio}
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

      {/* Infinite Synthesize Modal */}
      {isSynthesizerOpen && (
        <InfiniteSynthesizeModal
          onClose={() => setIsSynthesizerOpen(false)}
          onSynthesized={handleSynthesized}
        />
      )}

    </div>
  );
};
