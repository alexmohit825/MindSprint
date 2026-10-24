import React, { useState } from 'react';
import { X, Sparkles, BookOpen, CheckCircle, ArrowRight, Loader2, Globe, Scroll, GraduationCap } from 'lucide-react';
import { BookSummary, TextType } from '../types';
import { SynthesisService } from '../services/synthesisService';

interface InfiniteSynthesizeModalProps {
  onClose: () => void;
  onSynthesized: (book: BookSummary) => void;
}

const SUGGESTIONS = [
  { title: "Tao Te Ching (道德經)", author: "Laozi (Classical Chinese)" },
  { title: "The Republic (Πολιτεία)", author: "Plato (Ancient Greek)" },
  { title: "Critique of Pure Reason", author: "Immanuel Kant (German)" },
  { title: "Nicomachean Ethics", author: "Aristotle (Ancient Greek)" },
  { title: "The Prince (Il Principe)", author: "Niccolò Machiavelli (Italian)" },
  { title: "Capital in the 21st Century", author: "Thomas Piketty (Econometrics)" },
  { title: "The Selfish Gene", author: "Richard Dawkins (Evolutionary Biology)" },
  { title: "Bhagavad Gita (भगवद्गीता)", author: "Vyasa (Sanskrit Classic)" }
];

const LANGUAGES = [
  { code: 'English', label: 'English (Default)' },
  { code: 'Spanish', label: 'Español (Spanish)' },
  { code: 'French', label: 'Français (French)' },
  { code: 'German', label: 'Deutsch (German)' },
  { code: 'Mandarin', label: '中文 (Mandarin)' },
  { code: 'Japanese', label: '日本語 (Japanese)' },
  { code: 'Arabic', label: 'العربية (Arabic)' },
  { code: 'Italian', label: 'Italiano (Italian)' },
  { code: 'Portuguese', label: 'Português (Portuguese)' },
  { code: 'Latin', label: 'Lingua Latina (Latin)' }
];

export const InfiniteSynthesizeModal: React.FC<InfiniteSynthesizeModalProps> = ({
  onClose,
  onSynthesized
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('English');
  const [genreHint, setGenreHint] = useState<TextType | 'auto'>('auto');
  const [isLoading, setIsLoading] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);

  const stages = [
    'Scanning global canon, historical epigraphy & academic repositories...',
    'Deconstructing the 1-Minute Executive Spark & civilizational thesis...',
    'Structuring chapter-by-chapter narratives, mental models & formal proofs...',
    'Synthesizing Shortform-tier dialectic critiques & philosophical counterpoints...',
    `Translating hermeneutic synthesis into ${targetLanguage} & rendering luxury cover...`
  ];

  const handleSynthesize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    setStageIndex(0);

    const interval = setInterval(() => {
      setStageIndex(prev => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 900);

    try {
      const book = await SynthesisService.synthesizeBook(
        title.trim(),
        author.trim(),
        targetLanguage,
        genreHint
      );
      clearInterval(interval);
      onSynthesized(book);
    } catch (err) {
      console.error(err);
      alert('Synthesis encounter: falling back to high-fidelity cognitive synthesis.');
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = (s: { title: string; author: string }) => {
    setTitle(s.title);
    setAuthor(s.author);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 bg-[#0D0F17] border border-[#E5C17D]/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#E5C17D]/15 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E5C17D]/10 text-[#E5C17D] flex items-center justify-center border border-[#E5C17D]/30 shadow-inner">
              <Sparkles className="w-5 h-5 text-[#E5C17D]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Universal Knowledge Synthesizer
              </h3>
              <p className="text-xs text-gray-400">Ancient Classics • Dense Academic Treatises • Multilingual Synthesis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading State or Input Form */}
        {isLoading ? (
          <div className="py-12 flex flex-col items-center text-center relative z-10 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-[#E5C17D]/10 border border-[#E5C17D]/40 flex items-center justify-center mb-6 relative">
              <Loader2 className="w-8 h-8 text-[#E5C17D] animate-spin" />
              <div className="absolute inset-0 rounded-2xl bg-[#E5C17D]/20 blur-md pointer-events-none" />
            </div>

            <h4 className="font-serif text-xl font-bold text-white mb-2">
              Synthesizing "{title}"
            </h4>
            <p className="text-xs font-mono text-[#E5C17D] tracking-wide mb-6">
              Stage {stageIndex + 1} of {stages.length} • Target: {targetLanguage}
            </p>

            <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-gray-300">
              <span className="animate-pulse">{stages[stageIndex]}</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSynthesize} className="mt-6 space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                Title or Ancient Manuscript <span className="text-[#E5C17D]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tao Te Ching, Critique of Pure Reason, The Republic..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#131622] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E5C17D]/70 focus:ring-1 focus:ring-[#E5C17D]/50 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Author / Philosopher
                </label>
                <input
                  type="text"
                  placeholder="e.g. Plato, Laozi, Immanuel Kant..."
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-[#131622] border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E5C17D]/70"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-[#E5C17D]" />
                  <span>Output Synthesis Language</span>
                </label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full bg-[#131622] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E5C17D]/70 cursor-pointer"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="bg-[#0D0F17] text-white">
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Genre / Mode Selector */}
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                Analytical Framework Mode:
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setGenreHint('auto')}
                  className={`py-2 px-2.5 rounded-lg border font-semibold transition cursor-pointer text-center ${
                    genreHint === 'auto'
                      ? 'bg-[#E5C17D]/20 text-[#E5C17D] border-[#E5C17D]/40'
                      : 'text-gray-400 border-white/5 hover:bg-white/5'
                  }`}
                >
                  ⚡ Auto Detect
                </button>
                <button
                  type="button"
                  onClick={() => setGenreHint('ancient')}
                  className={`py-2 px-2.5 rounded-lg border font-semibold transition cursor-pointer text-center flex items-center justify-center gap-1 ${
                    genreHint === 'ancient'
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                      : 'text-gray-400 border-white/5 hover:bg-white/5'
                  }`}
                >
                  <Scroll className="w-3 h-3" /> Ancient Classic
                </button>
                <button
                  type="button"
                  onClick={() => setGenreHint('academic')}
                  className={`py-2 px-2.5 rounded-lg border font-semibold transition cursor-pointer text-center flex items-center justify-center gap-1 ${
                    genreHint === 'academic'
                      ? 'bg-sky-400/20 text-sky-300 border-sky-400/40'
                      : 'text-gray-400 border-white/5 hover:bg-white/5'
                  }`}
                >
                  <GraduationCap className="w-3 h-3" /> Academic
                </button>
              </div>
            </div>

            {/* Quick Suggestions */}
            <div>
              <span className="text-[11px] font-semibold text-gray-400 block mb-1.5">Foundational Landmarks:</span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.title}
                    type="button"
                    onClick={() => handleSelectSuggestion(s)}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-white/5 border border-white/5 hover:border-[#E5C17D]/30 text-gray-300 hover:text-white transition cursor-pointer"
                  >
                    {s.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E5C17D] via-[#DFB265] to-[#B3873B] text-[#090A0F] font-bold text-sm tracking-wide shadow-xl shadow-[#E5C17D]/20 hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#090A0F]" />
                <span>Begin Critical Synthesis</span>
                <ArrowRight className="w-4 h-4 text-[#090A0F]" />
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
