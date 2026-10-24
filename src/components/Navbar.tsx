import React from 'react';
import { Search, Sparkles, Scroll, GraduationCap, ArrowLeft, ArrowRight, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenSynthesizer: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onNavigateBack: () => void;
  onNavigateForward: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
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
  onSelectCategory,
  canGoBack,
  canGoForward,
  onNavigateBack,
  onNavigateForward,
  isDarkMode,
  onToggleTheme
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-black/[0.06] dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 sm:gap-4">
          
          {/* Left Group: Back / Forward Navigation Controls & Brand */}
          <div className="flex items-center gap-3">
            
            {/* Apple Navigation History Arrows */}
            <div className="flex items-center gap-1 p-1 bg-black/[0.04] dark:bg-white/5 rounded-xl border border-black/[0.05] dark:border-white/10">
              <button
                onClick={onNavigateBack}
                disabled={!canGoBack}
                className={`p-1.5 rounded-lg transition ${
                  canGoBack
                    ? 'text-gray-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer'
                    : 'text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-50'
                }`}
                title="Go Back (History)"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={onNavigateForward}
                disabled={!canGoForward}
                className={`p-1.5 rounded-lg transition ${
                  canGoForward
                    ? 'text-gray-900 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer'
                    : 'text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-50'
                }`}
                title="Go Forward (History)"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Brand Logo & Title */}
            <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => onSelectCategory('All Syntheses')}>
              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-[#151824] p-1 border border-black/[0.08] dark:border-white/10 shadow-xs flex items-center justify-center overflow-hidden">
                <img src="/AppIcon.png" alt="MindSprint" className="w-full h-full object-contain rounded-xl drop-shadow-xs" />
              </div>
              <div>
                <span className="font-brand text-xl font-bold tracking-widest text-gray-900 dark:text-white">
                  MIND<span className="gold-text-gradient font-black">SPRINT</span>
                </span>
              </div>
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
                className="w-full bg-white dark:bg-[#121520] border border-black/10 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-[#C59B37] focus:ring-1 focus:ring-[#C59B37] transition shadow-xs"
              />
            </div>
          </div>

          {/* Action Trigger & Theme Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Theme Toggle (Alabaster Day vs Obsidian Night) */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition cursor-pointer shadow-xs"
              title={isDarkMode ? 'Switch to Apple Alabaster (Brighter)' : 'Switch to Obsidian Night'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-600" />}
            </button>

            {/* Synthesize Button */}
            <button
              onClick={onOpenSynthesizer}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C59B37] via-[#DFC074] to-[#B88B35] text-[#090A0F] font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-[#C59B37]/20 hover:brightness-105 active:scale-95 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#090A0F]" />
              <span className="font-bold">Synthesize</span>
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
              className="w-full bg-white dark:bg-[#121520] border border-black/10 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:border-[#C59B37]"
            />
          </div>
        </div>

        {/* Horizontal Category Pill Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar text-xs border-t border-black/[0.05] dark:border-white/5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? 'bg-[#C59B37]/15 text-[#8C6A1E] dark:text-[#E5C17D] border border-[#C59B37]/40 shadow-xs font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
              }`}
            >
              {cat === 'Ancient Texts & Classics' && <Scroll className="w-3.5 h-3.5 text-amber-500" />}
              {cat === 'Academic & Scientific Treatises' && <GraduationCap className="w-3.5 h-3.5 text-sky-500" />}
              <span>{cat}</span>
            </button>
          ))}
        </div>

      </div>
    </header>
  );
};
