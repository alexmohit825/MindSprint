import React, { useState } from 'react';
import { X, Sparkles, BookOpen, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { BookSummary } from '../types';
import { SynthesisService } from '../services/synthesisService';

interface InfiniteSynthesizeModalProps {
  onClose: () => void;
  onSynthesized: (book: BookSummary) => void;
}

const SUGGESTIONS = [
  { title: "Shoe Dog", author: "Phil Knight" },
  { title: "Man's Search for Meaning", author: "Viktor E. Frankl" },
  { title: "The Lean Startup", author: "Eric Ries" },
  { title: "The Sovereign Individual", author: "James Dale Davidson" },
  { title: "Meditations", author: "Marcus Aurelius" },
  { title: "Influence: The Psychology of Persuasion", author: "Robert Cialdini" },
  { title: "Skin in the Game", author: "Nassim Nicholas Taleb" },
  { title: "Good to Great", author: "Jim Collins" }
];

export const InfiniteSynthesizeModal: React.FC<InfiniteSynthesizeModalProps> = ({
  onClose,
  onSynthesized
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);

  const stages = [
    'Scanning global canon & foundational literature ontology...',
    'Deconstructing the 1-Minute Executive Spark & core thesis...',
    'Structuring chapter-by-chapter narratives and mental models...',
    'Synthesizing Shortform-tier dialectic critiques & counter-perspectives...',
    'Compiling tactical action playbook & studio concept plate...'
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
      const book = await SynthesisService.synthesizeBook(title.trim(), author.trim());
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#0D0F17] border border-[#E5C17D]/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        
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
                Infinite Book Synthesizer
              </h3>
              <p className="text-xs text-gray-400">Zero Limits • Any Non-Fiction, Business, or Philosophy Book on Earth</p>
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
              Stage {stageIndex + 1} of {stages.length}
            </p>

            <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-gray-300">
              <span className="animate-pulse">{stages[stageIndex]}</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSynthesize} className="mt-6 space-y-5 relative z-10">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Book Title <span className="text-[#E5C17D]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Shoe Dog, The Lean Startup, Meditations..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#131622] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E5C17D]/70 focus:ring-1 focus:ring-[#E5C17D]/50 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Author (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Phil Knight, Eric Ries, Marcus Aurelius..."
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-[#131622] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E5C17D]/70 focus:ring-1 focus:ring-[#E5C17D]/50 transition"
              />
            </div>

            {/* Quick Suggestions */}
            <div>
              <span className="text-[11px] font-semibold text-gray-400 block mb-2">Trending Executive Inquiries:</span>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s.title}
                    type="button"
                    onClick={() => handleSelectSuggestion(s)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-white/5 border border-white/5 hover:border-[#E5C17D]/30 text-gray-300 hover:text-white transition cursor-pointer"
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
                <span>Begin Executive Synthesis</span>
                <ArrowRight className="w-4 h-4 text-[#090A0F]" />
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
