import React, { useState, useEffect } from 'react';
import { BookSummary } from '../types';
import { Star, Clock, Headphones, ArrowRight, ShieldCheck, Zap, Scroll, GraduationCap } from 'lucide-react';
import { fetchBookCover } from '../services/coverService';

interface BookCardProps {
  book: BookSummary;
  onOpen: (book: BookSummary) => void;
  onQuickPlay: (book: BookSummary, e: React.MouseEvent) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onOpen, onQuickPlay }) => {
  const [coverUrl, setCoverUrl] = useState<string | null>(book.cover?.coverUrl || null);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (!coverUrl && !imgError) {
      fetchBookCover(book.title, book.author, book.id).then(url => {
        if (url) setCoverUrl(url);
      });
    }
  }, [book.id, book.title, book.author, coverUrl, imgError]);

  return (
    <div
      onClick={() => onOpen(book)}
      className="group relative flex flex-col bg-white dark:bg-[#11131C] rounded-2xl border border-black/[0.08] dark:border-white/5 hover:border-[#C59B37]/60 dark:hover:border-[#E5C17D]/40 transition-all duration-300 hover:shadow-xl hover:shadow-[#C59B37]/10 dark:hover:shadow-[#E5C17D]/10 cursor-pointer overflow-hidden"
    >
      {/* 3D Realistic Book Jacket Display */}
      <div className="relative w-full aspect-[4/3] p-6 bg-gradient-to-b from-[#F2F1EC] to-[#E5E3DB] dark:from-[#181B26] dark:to-[#0D0F17] flex items-center justify-center overflow-hidden border-b border-black/[0.06] dark:border-white/5 transition-colors">
        
        {/* Subtle Ambient Glow */}
        <div 
          className="absolute inset-0 opacity-20 dark:opacity-20 blur-2xl transition duration-500 group-hover:opacity-35"
          style={{ background: `radial-gradient(circle, ${book.cover.accentColor} 0%, transparent 70%)` }}
        />

        {/* The 3D Book Object */}
        <div 
          className="book-spine-3d relative w-36 h-50 rounded-r-md rounded-l-xs shadow-2xl flex flex-col justify-between overflow-hidden border border-black/20 dark:border-white/10 group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-300"
          style={{ background: `linear-gradient(145deg, #181922 0%, #0B0C12 100%)` }}
        >
          {/* Authentic Real Cover Image */}
          {coverUrl && !imgError ? (
            <div className="absolute inset-0 z-0 overflow-hidden bg-stone-900">
              <img
                src={coverUrl}
                alt={book.title}
                loading="lazy"
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
              {/* Spine Crease & Realistic Shading */}
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/70 via-black/30 to-transparent pointer-events-none z-10" />
              {/* Outer Page Edge / Hardcover Rim */}
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-l from-white/20 to-transparent pointer-events-none z-10" />
              {/* Soft Surface Sheen */}
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/15 to-transparent pointer-events-none z-10" />
              {/* Bottom Subtle Title Overlay for instant readability */}
              <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10">
                <p className="text-[9px] font-bold text-white line-clamp-1 drop-shadow-md">{book.title}</p>
                <p className="text-[8px] text-[#E5C17D] font-medium line-clamp-1">{book.author}</p>
              </div>
            </div>
          ) : (
            /* Luxury Gold-Foil Embossed Fallback Jacket */
            <div className="p-4 flex flex-col justify-between h-full w-full">
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
          )}

        </div>

        {/* Quick Play Audio Hover Overlay */}
        <button
          onClick={(e) => onQuickPlay(book, e)}
          className="absolute right-4 bottom-4 w-11 h-11 rounded-full bg-[#C59B37] text-white dark:text-[#090A0F] flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition duration-300 hover:scale-110 active:scale-95 cursor-pointer z-20"
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
            <div className="flex items-center gap-1 font-semibold text-gray-500 dark:text-gray-400">
              {book.textType === 'ancient' ? (
                <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-bold">
                  <Scroll className="w-3 h-3" /> Ancient Classic
                </span>
              ) : book.textType === 'academic' ? (
                <span className="flex items-center gap-1 text-sky-700 dark:text-sky-400 font-bold">
                  <GraduationCap className="w-3 h-3" /> Academic
                </span>
              ) : (
                <span>{book.category}</span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[#C59B37] dark:text-[#E5C17D] font-bold text-[11px]">
              <Star className="w-3.5 h-3.5 fill-[#C59B37] dark:fill-[#E5C17D]" />
              <span>{book.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Main Title & Subtitle */}
          <h2 className="font-serif text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#C59B37] dark:group-hover:text-[#E5C17D] transition-colors line-clamp-1">
            {book.title}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1 leading-relaxed">
            {book.subtitle}
          </p>
        </div>

        {/* Read Time & CTA */}
        <div className="pt-4 mt-4 border-t border-black/[0.06] dark:border-white/5 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{book.readTime.core}</span>
          </div>

          <div className="flex items-center gap-1 text-[#C59B37] dark:text-[#E5C17D] font-semibold group-hover:translate-x-1 transition-transform">
            <span>Synthesize</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

      </div>
    </div>
  );
};
