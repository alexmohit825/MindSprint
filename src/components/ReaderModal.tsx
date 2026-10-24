import React, { useState, useEffect } from 'react';
import { BookSummary, SynthesisDepth } from '../types';
import { X, Zap, Clock, ShieldCheck, Headphones, Share2, CheckCircle2, Circle, AlertCircle, Quote, Scroll, GraduationCap, Globe, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { MentalModelViewer } from './MentalModelViewer';
import { QuoteCardModal } from './QuoteCardModal';
import { fetchBookCover } from '../services/coverService';

interface ReaderModalProps {
  book: BookSummary;
  onClose: () => void;
  onStartAudio: (book: BookSummary, text: string) => void;
  onNavigatePrevious?: () => void;
  onNavigateNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export const ReaderModal: React.FC<ReaderModalProps> = ({
  book,
  onClose,
  onStartAudio,
  onNavigatePrevious,
  onNavigateNext,
  hasPrevious = true,
  hasNext = true
}) => {
  const [depth, setDepth] = useState<SynthesisDepth>('spark');
  const [selectedQuote, setSelectedQuote] = useState<{ quote: string; author: string } | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [coverUrl, setCoverUrl] = useState<string | null>(book.cover?.coverUrl || null);

  useEffect(() => {
    setCoverUrl(book.cover?.coverUrl || null);
    if (!book.cover?.coverUrl) {
      fetchBookCover(book.title, book.author, book.id).then(url => {
        if (url) setCoverUrl(url);
      });
    }
  }, [book]);

  // Keyboard Navigation: ArrowLeft for previous, ArrowRight for next, Escape for close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && hasPrevious && onNavigatePrevious) {
        onNavigatePrevious();
      } else if (e.key === 'ArrowRight' && hasNext && onNavigateNext) {
        onNavigateNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPrevious, hasNext, onNavigatePrevious, onNavigateNext, onClose]);

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepNumber) ? prev.filter(s => s !== stepNumber) : [...prev, stepNumber]
    );
  };

  const getFullTextForAudio = (): string => {
    if (depth === 'spark') {
      return `${book.title} by ${book.author}. Executive thesis: ${book.spark.executiveThesis}. Bottom line: ${book.spark.bottomLine}. The three golden rules: ${book.spark.threeGoldenRules.join('. ')}`;
    }
    if (depth === 'core') {
      return `${book.title} by ${book.author}. Chapter breakdown: ` + book.core.chapters.map(c => `Chapter ${c.number}: ${c.title}. ${c.breakdown} Key insight: ${c.keyInsight}`).join(' ');
    }
    return `${book.title} Masterclass Analysis. Dialectic critique: ${book.masterclass.dialecticCritique.authorBlindspots}. Counter perspectives: ${book.masterclass.dialecticCritique.counterArguments.map(ca => `${ca.opposingThinker} argues that ${ca.counterpoint}`).join(' ')}. Action playbook: ${book.masterclass.actionPlaybook.map(a => `${a.action}: ${a.executionDetail}`).join(' ')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 dark:bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-4xl min-h-screen sm:min-h-0 sm:my-8 bg-[#FAF9F6] dark:bg-[#090A0F] border-0 sm:border border-black/[0.08] dark:border-white/10 sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-gray-800 dark:text-gray-200 transition-colors">
        
        {/* Sticky Header with Navigation Arrows & 3-Tier Segmented Control */}
        <div className="sticky top-0 z-30 w-full glass-panel-elevated bg-[#FAF9F6]/95 dark:bg-[#0C0E16]/95 border-b border-black/[0.06] dark:border-white/10 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          
          {/* Back to Library & Book Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-black/[0.05] dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-bold text-xs transition cursor-pointer"
              title="Return to Library (Esc)"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Library</span>
            </button>

            {/* Previous Book Arrow */}
            {onNavigatePrevious && (
              <button
                onClick={onNavigatePrevious}
                disabled={!hasPrevious}
                className={`p-1.5 rounded-lg border border-black/[0.05] dark:border-white/10 transition ${
                  hasPrevious
                    ? 'text-gray-800 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer'
                    : 'text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-40'
                }`}
                title="Previous Book (← Left Arrow)"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            {/* Next Book Arrow */}
            {onNavigateNext && (
              <button
                onClick={onNavigateNext}
                disabled={!hasNext}
                className={`p-1.5 rounded-lg border border-black/[0.05] dark:border-white/10 transition ${
                  hasNext
                    ? 'text-gray-800 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer'
                    : 'text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-40'
                }`}
                title="Next Book (→ Right Arrow)"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* The 3-Tier Depth Switcher */}
          <div className="flex items-center p-1 bg-black/[0.05] dark:bg-[#141724] rounded-xl border border-black/[0.05] dark:border-white/10">
            <button
              onClick={() => setDepth('spark')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                depth === 'spark'
                  ? 'bg-[#C59B37] text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Spark (1m)</span>
            </button>

            <button
              onClick={() => setDepth('core')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                depth === 'core'
                  ? 'bg-[#C59B37] text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-blue-300" />
              <span>Core (15m)</span>
            </button>

            <button
              onClick={() => setDepth('masterclass')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                depth === 'masterclass'
                  ? 'bg-[#C59B37] text-white shadow-xs'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Masterclass</span>
            </button>
          </div>

          {/* Audio & Close Action Icons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onStartAudio(book, getFullTextForAudio())}
              className="p-2 rounded-xl bg-black/[0.04] dark:bg-white/5 hover:bg-[#C59B37]/15 text-[#C59B37] border border-black/[0.06] dark:border-white/10 transition cursor-pointer"
              title="Listen to Narration"
            >
              <Headphones className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-black/[0.04] dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition cursor-pointer"
              title="Close Reader"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Scrollable Reader Body */}
        <div className="p-6 sm:p-12 overflow-y-auto max-h-[85vh]">
          
          {/* Book Header Banner with 3D Cover */}
          <div className="mb-8 pb-8 border-b border-black/[0.08] dark:border-white/10 flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
            
            {/* 3D Realistic Hardcover Presentation */}
            {coverUrl && (
              <div className="shrink-0 relative w-32 sm:w-40 aspect-[2/3] rounded-r-md rounded-l-xs shadow-2xl overflow-hidden border border-black/20 dark:border-white/10 bg-stone-950">
                <img
                  src={coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                {/* 3D Spine Crease */}
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/70 via-black/25 to-transparent pointer-events-none" />
                {/* Hardcover Gloss Reflection */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
              </div>
            )}

            {/* Title & Metadata */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-mono text-[#C59B37] font-bold">
                <span>UNOFFICIAL CRITICAL SYNTHESIS</span>
                <span>•</span>
                <span>{book.year}</span>
                {book.textType === 'ancient' && (
                  <span className="ml-2 text-amber-700 dark:text-amber-400 flex items-center gap-1 font-sans font-bold">
                    <Scroll className="w-3.5 h-3.5" /> Ancient Classic
                  </span>
                )}
                {book.textType === 'academic' && (
                  <span className="ml-2 text-sky-700 dark:text-sky-400 flex items-center gap-1 font-sans font-bold">
                    <GraduationCap className="w-3.5 h-3.5" /> Academic Treatise
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-black text-gray-900 dark:text-white mt-2 leading-tight">
                {book.title}
              </h1>
              <p className="font-serif text-lg sm:text-xl text-gray-600 dark:text-gray-300 italic mt-2">
                {book.subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                <span className="text-gray-900 dark:text-white font-semibold">By {book.author}</span>
                <span>•</span>
                <span className="px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-xs">
                  {depth === 'spark' ? book.readTime.spark : depth === 'core' ? book.readTime.core : book.readTime.masterclass} read
                </span>
                {book.originalLanguage && (
                  <>
                    <span>•</span>
                    <span className="font-mono text-xs text-[#C59B37]">
                      Original: {book.originalLanguage}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ANCIENT TEXT PHILOLOGICAL CARD (IF ANCIENT) */}
          {book.philologicalApparatus && (
            <div className="mb-10 p-6 rounded-2xl bg-amber-500/[0.08] dark:bg-[#1C1710] border border-amber-500/30 shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-800 dark:text-amber-400 mb-3">
                <Scroll className="w-4 h-4" />
                <span>Philological Apparatus & Civilizational Context</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700 dark:text-gray-300 mb-4">
                <div>
                  <span className="font-bold text-gray-500 dark:text-gray-400 block mb-1">HISTORICAL ERA:</span>
                  <p>{book.philologicalApparatus.historicalEra}</p>
                </div>
                <div>
                  <span className="font-bold text-gray-500 dark:text-gray-400 block mb-1">CIVILIZATIONAL CONTEXT:</span>
                  <p>{book.philologicalApparatus.civilizationalContext}</p>
                </div>
              </div>

              <div className="text-xs text-gray-700 dark:text-gray-300 mb-4">
                <span className="font-bold text-gray-500 dark:text-gray-400 block mb-1">2,000-YEAR LINEAGE IMPACT:</span>
                <p>{book.philologicalApparatus.lineageImpact}</p>
              </div>

              {book.philologicalApparatus.originalScriptExcerpt && (
                <div className="p-4 rounded-xl bg-white/80 dark:bg-black/50 border border-amber-500/20 shadow-xs">
                  <span className="text-[10px] font-bold font-mono uppercase text-amber-800 dark:text-amber-400 tracking-wider">
                    Original Source Inscription ({book.philologicalApparatus.originalScriptExcerpt.language})
                  </span>
                  <p className="font-serif text-lg sm:text-xl text-gray-900 dark:text-amber-100 my-2 leading-relaxed">
                    "{book.philologicalApparatus.originalScriptExcerpt.originalText}"
                  </p>
                  {book.philologicalApparatus.originalScriptExcerpt.transliteration && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic font-mono mb-1">
                      Transliteration: {book.philologicalApparatus.originalScriptExcerpt.transliteration}
                    </p>
                  )}
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    <strong>Literal Translation:</strong> {book.philologicalApparatus.originalScriptExcerpt.literalMeaning}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ACADEMIC METHODOLOGY CARD (IF ACADEMIC) */}
          {book.academicMethodology && (
            <div className="mb-10 p-6 rounded-2xl bg-sky-500/[0.08] dark:bg-[#101724] border border-sky-500/30 shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sky-800 dark:text-sky-400 mb-3">
                <GraduationCap className="w-4 h-4" />
                <span>Formal Academic Epistemology & Methodology</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700 dark:text-gray-300 mb-4">
                <div>
                  <span className="font-bold text-gray-500 dark:text-gray-400 block mb-1">THEORETICAL FRAMEWORK:</span>
                  <p>{book.academicMethodology.formalFramework}</p>
                </div>
                <div>
                  <span className="font-bold text-gray-500 dark:text-gray-400 block mb-1">EMPIRICAL REPLICATION STATUS:</span>
                  <p>{book.academicMethodology.empiricalValidity}</p>
                </div>
              </div>

              {book.academicMethodology.mathematicalFoundations && book.academicMethodology.mathematicalFoundations.length > 0 && (
                <div className="p-3.5 rounded-xl bg-white/80 dark:bg-black/40 border border-sky-500/20 mb-3 text-xs font-mono text-sky-900 dark:text-sky-200">
                  <span className="font-bold text-gray-500 dark:text-gray-400 block mb-1 font-sans">MATHEMATICAL / FORMAL CORE:</span>
                  {book.academicMethodology.mathematicalFoundations.map((f, i) => (
                    <div key={i} className="py-0.5">• {f}</div>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                <strong>Methodological Boundary:</strong> {book.academicMethodology.limitations}
              </p>
            </div>
          )}

          {/* TIER 1: THE SPARK (1-Min Flash) */}
          {depth === 'spark' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Executive Thesis Box */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#141724] border-l-4 border-[#C59B37] shadow-sm border border-black/[0.05] dark:border-transparent">
                <span className="text-xs uppercase tracking-widest font-bold text-[#C59B37]">The Central Thesis</span>
                <p className="text-base sm:text-lg text-gray-900 dark:text-white font-serif leading-relaxed mt-2">
                  {book.spark.executiveThesis}
                </p>
              </div>

              {/* Bottom Line */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/30">
                <span className="text-[11px] uppercase tracking-wider font-bold text-amber-700 dark:text-amber-400">The 30-Second Bottom Line</span>
                <p className="text-base font-semibold text-gray-900 dark:text-gray-200 mt-1">
                  {book.spark.bottomLine}
                </p>
              </div>

              {/* Three Golden Rules */}
              <div>
                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-4">Three Non-Negotiable Rules</h3>
                <div className="space-y-3">
                  {book.spark.threeGoldenRules.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-white/5 border border-black/[0.06] dark:border-white/5 shadow-xs">
                      <div className="w-7 h-7 rounded-full bg-[#C59B37]/20 text-[#8C6A1E] dark:text-[#E5C17D] flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                        {rule}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mental Model Preview */}
              <MentalModelViewer model={book.spark.coreMentalModel} />

            </div>
          )}

          {/* TIER 2: THE CORE (15-Min Blink) */}
          {depth === 'core' && (
            <div className="space-y-10 animate-fadeIn">
              
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-800 dark:text-blue-300">
                💡 <strong>Core Structural Chapters:</strong> Deep dive into the primary narrative progression and conceptual frameworks.
              </div>

              {book.core.chapters.map((ch) => (
                <article key={ch.number} className="pb-8 border-b border-black/[0.08] dark:border-white/10 last:border-b-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-black/[0.06] dark:bg-white/10 text-[#C59B37]">
                      Chapter {ch.number}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
                      {ch.title}
                    </h3>
                    {ch.originalCitation && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-mono ml-auto">
                        [{ch.originalCitation}]
                      </span>
                    )}
                  </div>

                  <p className="font-serif text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {ch.breakdown}
                  </p>

                  {/* Key Insight Pill */}
                  <div className="p-4 rounded-xl bg-white dark:bg-[#131622] border border-[#C59B37]/30 mb-3 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C59B37]">Key Operational Insight</span>
                    <p className="text-sm text-gray-900 dark:text-gray-200 font-medium mt-1">
                      {ch.keyInsight}
                    </p>
                  </div>

                  {/* Real Anecdote */}
                  {ch.anecdote && (
                    <div className="p-3.5 rounded-lg bg-black/[0.03] dark:bg-white/5 border border-black/[0.05] dark:border-white/5 text-xs text-gray-600 dark:text-gray-400 italic">
                      <span className="font-semibold text-gray-800 dark:text-gray-300 not-italic">Case Note: </span>
                      {ch.anecdote}
                    </div>
                  )}
                </article>
              ))}

              <MentalModelViewer model={book.spark.coreMentalModel} />

            </div>
          )}

          {/* TIER 3: THE MASTERCLASS (40-Min Shortform Killer) */}
          {depth === 'masterclass' && (
            <div className="space-y-12 animate-fadeIn">
              
              {/* Dialectic Section */}
              <section className="p-6 rounded-2xl bg-rose-500/[0.07] dark:bg-[#1E1215] border border-rose-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">The Crucible: Author Blind Spots & Counter-Arguments</h3>
                </div>
                
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
                  <strong>Critical Critique:</strong> {book.masterclass.dialecticCritique.authorBlindspots}
                </p>

                <div className="space-y-3">
                  {book.masterclass.dialecticCritique.counterArguments.map((ca, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white dark:bg-[#0D0708] border border-rose-500/20 shadow-xs">
                      <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wide">
                        Opposing Thinker: {ca.opposingThinker}
                      </span>
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">
                        {ca.counterpoint}
                      </p>
                    </div>
                  ))}
                </div>

                {book.masterclass.dialecticCritique.validityNotes && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 italic">
                    * {book.masterclass.dialecticCritique.validityNotes}
                  </p>
                )}
              </section>

              {/* Author Biases */}
              <section>
                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-3">Cognitive Biases & Worldview Constraints</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {book.masterclass.authorBiases.map((bias, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white dark:bg-white/5 border border-black/[0.06] dark:border-white/5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 shadow-xs">
                      • {bias}
                    </div>
                  ))}
                </div>
              </section>

              {/* Real World Case Studies */}
              <section>
                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-4">Empirical & Historical Case Studies</h3>
                <div className="space-y-4">
                  {book.masterclass.caseStudies.map((cs, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-[#121522] border border-black/[0.08] dark:border-white/10 shadow-xs">
                      <h4 className="font-bold text-sm text-[#8C6A1E] dark:text-[#E5C17D]">{cs.entity}</h4>
                      <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 leading-relaxed"><strong>Scenario:</strong> {cs.scenario}</p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 font-semibold"><strong>Outcome:</strong> {cs.outcome}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* The Tactical Action Playbook */}
              <section className="p-6 rounded-2xl bg-emerald-500/[0.07] dark:bg-[#121824] border border-emerald-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span>The Action Playbook (Execute Today)</span>
                  </h3>
                  <span className="text-xs text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                    {completedSteps.length} of {book.masterclass.actionPlaybook.length} completed
                  </span>
                </div>

                <div className="space-y-3">
                  {book.masterclass.actionPlaybook.map((step) => {
                    const isDone = completedSteps.includes(step.step);
                    return (
                      <div
                        key={step.step}
                        onClick={() => toggleStep(step.step)}
                        className={`p-4 rounded-xl border transition cursor-pointer flex items-start gap-3.5 ${
                          isDone
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-gray-600 dark:text-gray-400'
                            : 'bg-white dark:bg-white/5 border-black/[0.06] dark:border-white/5 hover:border-black/20 dark:hover:border-white/20 text-gray-900 dark:text-white shadow-xs'
                        }`}
                      >
                        <button className="mt-0.5 text-emerald-600 dark:text-emerald-400">
                          {isDone ? <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" /> : <Circle className="w-5 h-5 text-gray-400" />}
                        </button>
                        <div className="flex-1">
                          <h4 className={`text-sm font-bold ${isDone ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                            {step.step}. {step.action}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                            {step.executionDetail}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Socratic Self-Reflection */}
              <section className="p-6 rounded-2xl bg-white dark:bg-[#141724] border border-black/[0.08] dark:border-white/10 shadow-xs">
                <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mb-3">Socratic Reflection Prompts</h3>
                <div className="space-y-2.5">
                  {book.masterclass.socraticReflection.map((q, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg bg-black/[0.03] dark:bg-black/40 text-sm text-gray-700 dark:text-gray-300 italic border-l-2 border-[#C59B37]">
                      “{q}”
                    </div>
                  ))}
                </div>
              </section>

            </div>
          )}

          {/* Key Quotes Bar with Dual-Language Source Presentation */}
          <div className="mt-14 pt-8 border-t border-black/[0.08] dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Quote className="w-5 h-5 text-[#C59B37]" />
                <span>Golden Quotations & Classical Excerpts</span>
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">Tap quote to export luxury card</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {book.keyQuotes.map((kq, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedQuote({ quote: kq.quote, author: book.author })}
                  className="group p-5 rounded-2xl bg-white dark:bg-white/5 border border-black/[0.08] dark:border-white/10 hover:border-[#C59B37]/60 dark:hover:border-[#E5C17D]/40 transition cursor-pointer flex flex-col justify-between shadow-xs"
                >
                  {kq.originalQuote && (
                    <p className="font-serif text-sm text-amber-800 dark:text-amber-200/90 mb-2 leading-relaxed">
                      "{kq.originalQuote}"
                      <span className="block text-[10px] text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                        [{kq.originalLanguage || 'Original Script'}]
                      </span>
                    </p>
                  )}
                  <p className="font-serif text-sm sm:text-base text-gray-800 dark:text-gray-200 italic leading-relaxed">
                    “{kq.quote}”
                  </p>
                  <div className="mt-4 pt-2 border-t border-black/[0.05] dark:border-white/5 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-[11px] truncate">{kq.context}</span>
                    <span className="text-[#C59B37] opacity-0 group-hover:opacity-100 transition flex items-center gap-1 font-semibold">
                      Export <Share2 className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Reader Navigation Bar */}
          <div className="mt-12 pt-6 border-t border-black/[0.08] dark:border-white/10 flex items-center justify-between">
            {onNavigatePrevious && hasPrevious ? (
              <button
                onClick={onNavigatePrevious}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/[0.04] dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-800 dark:text-white font-semibold text-xs transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Work</span>
              </button>
            ) : <div />}

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition cursor-pointer"
            >
              Back to Catalog (Esc)
            </button>

            {onNavigateNext && hasNext ? (
              <button
                onClick={onNavigateNext}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C59B37] text-white font-bold text-xs shadow-md hover:brightness-105 transition cursor-pointer"
              >
                <span>Next Work</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : <div />}
          </div>

        </div>

      </div>

      {/* Quote Card Modal Trigger */}
      {selectedQuote && (
        <QuoteCardModal
          quote={selectedQuote.quote}
          author={selectedQuote.author}
          bookTitle={book.title}
          onClose={() => setSelectedQuote(null)}
        />
      )}
    </div>
  );
};
