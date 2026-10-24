import React, { useState, useRef } from 'react';
import { X, Download, Check, Sparkles, Share2 } from 'lucide-react';

interface QuoteCardModalProps {
  quote: string;
  author: string;
  bookTitle: string;
  onClose: () => void;
}

type CardStyle = 'obsidian' | 'swiss' | 'editorial';

export const QuoteCardModal: React.FC<QuoteCardModalProps> = ({
  quote,
  author,
  bookTitle,
  onClose
}) => {
  const [style, setStyle] = useState<CardStyle>('obsidian');
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCopyText = () => {
    navigator.clipboard.writeText(`"${quote}" — ${author}, ${bookTitle} (via MindSprint)`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#11131C] border border-[#E5C17D]/30 rounded-3xl p-6 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E5C17D]" />
            <h3 className="text-sm font-bold tracking-wide uppercase text-white">Executive Quote Card Studio</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Style Selector Tabs */}
        <div className="flex gap-2 my-4">
          <button
            onClick={() => setStyle('obsidian')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition cursor-pointer ${
              style === 'obsidian'
                ? 'bg-[#E5C17D]/20 text-[#E5C17D] border-[#E5C17D]/40'
                : 'text-gray-400 border-white/5 hover:bg-white/5'
            }`}
          >
            Obsidian Gold
          </button>
          <button
            onClick={() => setStyle('swiss')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition cursor-pointer ${
              style === 'swiss'
                ? 'bg-white/20 text-white border-white/40'
                : 'text-gray-400 border-white/5 hover:bg-white/5'
            }`}
          >
            Swiss Minimal
          </button>
          <button
            onClick={() => setStyle('editorial')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition cursor-pointer ${
              style === 'editorial'
                ? 'bg-[#E5C17D]/20 text-[#E5C17D] border-[#E5C17D]/40'
                : 'text-gray-400 border-white/5 hover:bg-white/5'
            }`}
          >
            Editorial Serif
          </button>
        </div>

        {/* The Live Rendered Card Preview */}
        <div
          ref={cardRef}
          className={`relative aspect-[4/5] rounded-2xl p-8 flex flex-col justify-between shadow-2xl transition duration-300 border ${
            style === 'obsidian'
              ? 'bg-[#090A0F] border-[#E5C17D]/30 text-white'
              : style === 'swiss'
              ? 'bg-[#FAFAFA] border-gray-300 text-gray-900'
              : 'bg-[#181920] border-white/15 text-[#F3F4F6]'
          }`}
        >
          {/* Top Brand Watermark */}
          <div className="flex items-center justify-between">
            <span className={`text-[10px] tracking-widest font-mono uppercase ${style === 'swiss' ? 'text-gray-500' : 'text-[#E5C17D]'}`}>
              MINDSPRINT INTELLIGENCE
            </span>
            <div className={`w-2.5 h-2.5 rounded-full ${style === 'swiss' ? 'bg-gray-900' : 'bg-[#E5C17D]'}`} />
          </div>

          {/* Core Quote */}
          <div className="my-auto">
            <span className={`text-4xl font-serif font-black leading-none block mb-2 ${style === 'swiss' ? 'text-gray-400' : 'text-[#E5C17D]/40'}`}>“</span>
            <p className={`font-serif text-lg sm:text-xl font-bold leading-relaxed ${style === 'swiss' ? 'text-gray-900' : 'text-gray-100'}`}>
              {quote}
            </p>
          </div>

          {/* Bottom Attribution */}
          <div className={`pt-4 border-t ${style === 'swiss' ? 'border-gray-200' : 'border-white/10'}`}>
            <p className={`font-semibold text-sm ${style === 'swiss' ? 'text-gray-900' : 'text-[#E5C17D]'}`}>
              {author}
            </p>
            <p className={`text-xs ${style === 'swiss' ? 'text-gray-500' : 'text-gray-400'}`}>
              {bookTitle}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={handleCopyText}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-xs tracking-wide transition cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Quote Text'}</span>
          </button>
          <button
            onClick={() => {
              alert('Quote card ready for export! Press Cmd+Shift+4 or screenshot preview for pristine high-res visual.');
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#E5C17D] to-[#C99C4B] text-[#090A0F] font-bold text-xs tracking-wide shadow-lg hover:brightness-110 active:scale-95 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Save Card</span>
          </button>
        </div>

      </div>
    </div>
  );
};
