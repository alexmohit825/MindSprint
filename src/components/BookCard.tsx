import React from 'react';
import { BookSummary } from '../types';
import { Star, Clock, Headphones, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface BookCardProps {
  book: BookSummary;
  onOpen: (book: BookSummary) => void;
  onQuickPlay: (book: BookSummary, e: React.MouseEvent) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onOpen, onQuickPlay }) => {
  return (
    <div
      onClick={() => onOpen(book)}
      className="group relative flex flex-col bg-[#11131C] rounded-2xl border border-white/5 hover:border-[#E5C17D]/40 transition-all duration-300 hover:shadow-2xl hover:shadow-[#E5C17D]/10 cursor-pointer overflow-hidden"
    >
      {/* 3D Realistic Book Jacket Display */}
      <div className="relative w-full aspect-[4/3] p-6 bg-gradient-to-b from-[#181B26] to-[#0D0F17] flex items-center justify-center overflow-hidden border-b border-white/5">
        
        {/* Subtle Ambient Glow */}
        <div 
          className="absolute inset-0 opacity-20 blur-2xl transition duration-500 group-hover:opacity-35"
          style={{ background: `radial-gradient(circle, ${book.cover.accentColor} 0%, transparent 70%)` }}
        />

        {/* The 3D Book Object */}
        <div className="book-spine-3d relative w-36 h-48 rounded-r-md rounded-l-xs shadow-2xl p-4 flex flex-col justify-between overflow-hidden border border-white/10"
             style={{ background: `linear-gradient(145deg, #181922 0%, #0B0C12 100%)` }}>
          
          {/* Embossed Corner Accent Line */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/10 to-transparent pointer-events-none" />
          
          {/* Top Foil Tag */}
          <div className="flex items-center justify-between z-10">
            <span className="text-[8px] uppercase tracking-widest font-mono text-gray-400">MindSprint</span>
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-gray-300">
              {book.year}
            </span>
          </div>

          {/* Book Title & Author in Center */}
          <div className="my-auto z-10">
            <h3 className="font-serif text-sm font-bold text-white line-clamp-2 leading-tight drop-shadow-sm">
              {book.title}
            </h3>
            <p className="text-[10px] text-[#E5C17D] mt-1 font-medium tracking-wide">
              {book.author}
            </p>
          </div>

          {/* Bottom Motif Badge */}
          <div className="z-10 pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-[8px] text-gray-400 italic line-clamp-1">
              {book.cover.motif}
            </span>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: book.cover.accentColor }} />
          </div>

        </div>

        {/* Quick Play Audio Hover Overlay */}
        <button
          onClick={(e) => onQuickPlay(book, e)}
          className="absolute right-4 bottom-4 w-11 h-11 rounded-full bg-[#E5C17D] text-[#090A0F] flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition duration-300 hover:scale-110 active:scale-95 cursor-pointer z-20"
          title="Play Audio Narration"
        >
          <Headphones className="w-5 h-5 fill-current" />
        </button>

      </div>

      {/* Book Metadata & Synthesis Specs */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Category & Badge */}
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-gray-400 font-medium tracking-wide">
              {book.category}
            </span>
            <div className="flex items-center gap-1 text-[#E5C17D] font-bold text-[11px]">
              <Star className="w-3.5 h-3.5 fill-[#E5C17D]" />
              <span>{book.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Main Title & Subtitle */}
          <h2 className="font-serif text-lg font-bold text-white group-hover:text-[#E5C17D] transition-colors line-clamp-1">
            {book.title}
          </h2>
          <p className="text-xs text-gray-400 line-clamp-2 mt-1.5 leading-relaxed">
            {book.spark.executiveThesis}
          </p>
        </div>

        {/* 3-Tier Depth Indicator Bar */}
        <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-3 text-gray-400">
            <span className="flex items-center gap-1" title="1-Minute Flash Read">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{book.readTime.spark}</span>
            </span>
            <span className="text-gray-600">•</span>
            <span className="flex items-center gap-1" title="15-Minute Core Blink">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>{book.readTime.core}</span>
            </span>
            <span className="text-gray-600">•</span>
            <span className="flex items-center gap-1" title="Masterclass Deep Dive">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Masterclass</span>
            </span>
          </div>

          <div className="text-gray-400 group-hover:text-[#E5C17D] transition flex items-center gap-1 font-semibold">
            <span>Read</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
          </div>
        </div>

      </div>
    </div>
  );
};
