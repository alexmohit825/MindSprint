import React from 'react';
import { Search, Sparkles, Compass, Bookmark, Volume2, Scroll, GraduationCap, Globe } from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenSynthesizer: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

const CATEGORIES = [
  'All Syntheses',
  'Ancient Texts & Classics',
  'Academic & Scientific Treatises',
  'Cognitive Psychology',
  'Productivity & Behavioral Design',
  'Strategy & Leadership',
  'Venture & Strategy',
  'Behavioral Economics',
  'Philosophy & Risk Engineering',
  'Leadership & Operations',
  'Anthropology & History'
];

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenSynthesizer,
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 bg-[#08090E]/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Identity */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => onSelectCategory('All Syntheses')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1F2230] to-[#0D0E15] p-2 border border-[#E5C17D]/30 shadow-lg flex items-center justify-center">
              <img src="/logo.svg" alt="MindSprint" className="w-full h-full object-contain drop-shadow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-brand text-xl font-bold tracking-widest text-white">MIND<span className="gold-text-gradient font-black">SPRINT</span></span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#E5C17D]/10 text-[#E5C17D] border border-[#E5C17D]/30">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-[11px] text-gray-400 tracking-wide hidden sm:block">Universal Non-Fiction, Ancient Canon & Academic Intelligence</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search any title, author, Greek/Latin classic, or treatise..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-[#121520] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#E5C17D]/60 focus:ring-1 focus:ring-[#E5C17D]/40 transition"
              />
            </div>
          </div>

          {/* Action Trigger: Infinite Synthesis */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSynthesizer}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#E5C17D] via-[#DFB265] to-[#B3873B] text-[#090A0F] font-semibold text-xs sm:text-sm tracking-wide shadow-lg shadow-[#E5C17D]/20 hover:brightness-110 active:scale-95 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#090A0F]" />
              <span className="font-bold">Synthesize Any Work</span>
            </button>
          </div>

        </div>

        {/* Mobile Search Input */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search library, Greek/Latin classics, or treatises..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#121520] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#E5C17D]/60"
            />
          </div>
        </div>

        {/* Horizontal Category Pill Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar text-xs border-t border-white/5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? 'bg-[#E5C17D]/20 text-[#E5C17D] border border-[#E5C17D]/40 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              {cat === 'Ancient Texts & Classics' && <Scroll className="w-3.5 h-3.5 text-amber-400" />}
              {cat === 'Academic & Scientific Treatises' && <GraduationCap className="w-3.5 h-3.5 text-sky-400" />}
              <span>{cat}</span>
            </button>
          ))}
        </div>

      </div>
    </header>
  );
};
