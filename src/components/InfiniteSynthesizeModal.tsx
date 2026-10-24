import React, { useState } from 'react';
import { X, Sparkles, BookOpen, AlertCircle, Loader2, Globe } from 'lucide-react';
import { BookSummary } from '../types';
import { SynthesisService } from '../services/synthesisService';

interface InfiniteSynthesizeModalProps {
  onClose: () => void;
  onSynthesized: (book: BookSummary) => void;
}

const CATEGORIES = [
  'Leadership & Strategy',
  'Psychology & Mind',
  'Productivity & Focus',
  'Wealth & Economics',
  'Ancient Classics',
  'Systems & Science',
  'Biographies & History',
  'Philosophy & Ethics',
  'Science & Technology',
  'Other'
];

const SUGGESTIONS = [
  { title: "You Learn by Living", author: "Eleanor Roosevelt", category: "Biographies & History" },
  { title: "Meditations", author: "Marcus Aurelius", category: "Ancient Classics" },
  { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", category: "Psychology & Mind" },
  { title: "The Selfish Gene", author: "Richard Dawkins", category: "Science & Technology" },
  { title: "Man's Search for Meaning", author: "Viktor Frankl", category: "Philosophy & Ethics" },
  { title: "Good to Great", author: "Jim Collins", category: "Leadership & Strategy" }
];

const LANGUAGES = [
  { code: 'English', label: 'English' },
  { code: 'Spanish', label: 'Español (Spanish)' },
  { code: 'French', label: 'Français (French)' },
  { code: 'German', label: 'Deutsch (German)' },
  { code: 'Mandarin', label: '中文 (Mandarin)' },
  { code: 'Japanese', label: '日本語 (Japanese)' },
  { code: 'Arabic', label: 'العربية (Arabic)' },
  { code: 'Italian', label: 'Italiano (Italian)' }
];

export const InfiniteSynthesizeModal: React.FC<InfiniteSynthesizeModalProps> = ({
  onClose,
  onSynthesized
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Biographies & History');
  const [customCategory, setCustomCategory] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const effectiveCategory = selectedCategory === 'Other' && customCategory.trim() 
    ? customCategory.trim() 
    : selectedCategory;

  const handleSynthesize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const book = await SynthesisService.synthesizeBook(
        title.trim(),
        author.trim(),
        effectiveCategory,
        targetLanguage
      );
      onSynthesized(book);
    } catch (err: any) {
      console.error('Synthesis error:', err);
      setErrorMessage(err.message || 'Failed to synthesize. Please check connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = (s: { title: string; author: string; category: string }) => {
    setTitle(s.title);
    setAuthor(s.author);
    if (CATEGORIES.includes(s.category)) {
      setSelectedCategory(s.category);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 bg-[#0D0F17] border border-[#E5C17D]/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#E5C17D]/15 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E5C17D]/10 text-[#E5C17D] flex items-center justify-center border border-[#E5C17D]/30 shadow-inner">
              <Sparkles className="w-5 h-5 text-[#E5C17D]" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-white tracking-wide">
                Synthesize Any Book
              </h2>
              <p className="text-xs text-gray-400">
                Live Google Gemini 3.8 Flash • Real Grounded Analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSynthesize} className="mt-6 space-y-4 relative z-10">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Synthesis Error</p>
                <p className="opacity-90">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Book Title <span className="text-[#E5C17D]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. You Learn by Living, Thinking in Systems..."
              required
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#E5C17D]/60 focus:bg-white/10 transition-colors"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Author (Recommended for precision)
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Eleanor Roosevelt, Daniel Kahneman..."
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#E5C17D]/60 focus:bg-white/10 transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                disabled={isLoading}
                className="w-full px-3.5 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#E5C17D]/60 focus:bg-[#12141F] transition-colors"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c} className="bg-[#12141F] text-white">{c}</option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#E5C17D]" />
                Language
              </label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                disabled={isLoading}
                className="w-full px-3.5 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#E5C17D]/60 focus:bg-[#12141F] transition-colors"
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code} className="bg-[#12141F] text-white">{l.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Category Input if "Other" is chosen */}
          {selectedCategory === 'Other' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#E5C17D] mb-1.5">
                Custom Category Name
              </label>
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="e.g. Memoir, Neuroscience, Aviation History..."
                disabled={isLoading}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-[#E5C17D]/50 text-white placeholder-gray-500 text-sm focus:outline-none focus:bg-white/10"
              />
            </div>
          )}

          {/* Quick Suggestions */}
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Verified Suggestions
            </span>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSuggestion(s)}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 hover:text-[#E5C17D] transition-colors border border-white/5 text-left"
                >
                  <span className="font-semibold">{s.title}</span> <span className="opacity-60 text-[11px]">— {s.author}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !title.trim()}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#E5C17D] to-[#C99C4B] hover:brightness-110 text-black font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Synthesizing with Gemini 3.8 Flash (3–6s)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Generate Grounded Executive Synthesis</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
