import React, { useState } from 'react';
import { BookSummary, SynthesisDepth } from '../types';
import { X, Zap, Clock, ShieldCheck, Headphones, Share2, CheckCircle2, Circle, AlertCircle, Quote, Scroll, GraduationCap, Globe, BookOpen } from 'lucide-react';
import { MentalModelViewer } from './MentalModelViewer';
import { QuoteCardModal } from './QuoteCardModal';

interface ReaderModalProps {
  book: BookSummary;
  onClose: () => void;
  onStartAudio: (book: BookSummary, text: string) => void;
}

export const ReaderModal: React.FC<ReaderModalProps> = ({ book, onClose, onStartAudio }) => {
  const [depth, setDepth] = useState<SynthesisDepth>('spark');
  const [selectedQuote, setSelectedQuote] = useState<{ quote: string; author: string } | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-4xl min-h-screen sm:min-h-0 sm:my-8 bg-[#090A0F] border-0 sm:border border-white/10 sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-gray-200">
        
        {/* Sticky Header with 3-Tier Segmented Control */}
        <div className="sticky top-0 z-30 w-full glass-panel-elevated bg-[#0C0E16]/95 border-b border-white/10 px-6 py-4 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2.5 min-w-0">
            {book.textType === 'ancient' ? (
              <span className="flex items-center gap-1 text-[11px] uppercase font-bold tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                <Scroll className="w-3.5 h-3.5" /> Ancient Classic
              </span>
            ) : book.textType === 'academic' ? (
              <span className="flex items-center gap-1 text-[11px] uppercase font-bold tracking-widest text-sky-400 bg-sky-400/10 px-2.5 py-0.5 rounded-full border border-sky-400/20">
                <GraduationCap className="w-3.5 h-3.5" /> Academic Treatise
              </span>
            ) : (
              <span className="text-xs uppercase font-bold tracking-widest text-[#E5C17D] truncate">
                {book.category}
              </span>
            )}

            {book.originalLanguage && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/5 font-mono">
                <Globe className="w-3 h-3 text-gray-400" />
                {book.originalLanguage}
              </span>
            )}
          </div>

          {/* The 3-Tier Depth Switcher */}
          <div className="flex items-center p-1 bg-[#141724] rounded-xl border border-white/10">
            <button
              onClick={() => setDepth('spark')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                depth === 'spark'
                  ? 'bg-[#E5C17D] text-[#090A0F] shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Spark (1m)</span>
            </button>

            <button
              onClick={() => setDepth('core')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                depth === 'core'
                  ? 'bg-[#E5C17D] text-[#090A0F] shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Core (15m)</span>
            </button>

            <button
              onClick={() => setDepth('masterclass')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                depth === 'masterclass'
                  ? 'bg-[#E5C17D] text-[#090A0F] shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Masterclass (40m)</span>
            </button>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onStartAudio(book, getFullTextForAudio())}
              className="p-2 rounded-xl bg-white/5 hover:bg-[#E5C17D]/20 text-[#E5C17D] border border-white/10 hover:border-[#E5C17D]/30 transition cursor-pointer"
              title="Listen to Narration"
            >
              <Headphones className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Scrollable Reader Body */}
        <div className="p-6 sm:p-12 overflow-y-auto max-h-[85vh]">
          
          {/* Book Header Banner */}
          <div className="mb-8 pb-8 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-mono text-[#E5C17D] font-bold">
              <span>UNOFFICIAL CRITICAL SYNTHESIS</span>
              <span>•</span>
              <span>{book.year}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-black text-white mt-2 leading-tight">
              {book.title}
            </h1>
            <p className="font-serif text-lg sm:text-xl text-gray-300 italic mt-2">
              {book.subtitle}
            </p>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-400 font-medium">
              <span className="text-white font-semibold">By {book.author}</span>
              <span>•</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-gray-300 text-xs">
                {depth === 'spark' ? book.readTime.spark : depth === 'core' ? book.readTime.core : book.readTime.masterclass} read
              </span>
            </div>
          </div>

          {/* ANCIENT TEXT PHILOLOGICAL CARD (IF ANCIENT) */}
          {book.philologicalApparatus && (
            <div className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-[#1C1710] to-[#0E0C08] border border-amber-500/30 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">
                <Scroll className="w-4 h-4 text-amber-400" />
                <span>Philological Apparatus & Civilizational Context</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-300 mb-4">
                <div>
                  <span className="font-bold text-gray-400 block mb-1">HISTORICAL ERA:</span>
                  <p>{book.philologicalApparatus.historicalEra}</p>
                </div>
                <div>
                  <span className="font-bold text-gray-400 block mb-1">CIVILIZATIONAL CONTEXT:</span>
                  <p>{book.philologicalApparatus.civilizationalContext}</p>
                </div>
              </div>

              <div className="text-xs text-gray-300 mb-4">
                <span className="font-bold text-gray-400 block mb-1">2,000-YEAR LINEAGE IMPACT:</span>
                <p>{book.philologicalApparatus.lineageImpact}</p>
              </div>

              {book.philologicalApparatus.originalScriptExcerpt && (
                <div className="p-4 rounded-xl bg-black/50 border border-amber-500/20">
                  <span className="text-[10px] font-bold font-mono uppercase text-amber-400 tracking-wider">
                    Original Source Inscription ({book.philologicalApparatus.originalScriptExcerpt.language})
                  </span>
                  <p className="font-serif text-lg sm:text-xl text-amber-100 my-2 leading-relaxed">
                    "{book.philologicalApparatus.originalScriptExcerpt.originalText}"
                  </p>
                  {book.philologicalApparatus.originalScriptExcerpt.transliteration && (
                    <p className="text-xs text-gray-400 italic font-mono mb-1">
                      Transliteration: {book.philologicalApparatus.originalScriptExcerpt.transliteration}
                    </p>
                  )}
                  <p className="text-xs text-gray-300">
                    <strong>Literal Translation:</strong> {book.philologicalApparatus.originalScriptExcerpt.literalMeaning}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ACADEMIC METHODOLOGY CARD (IF ACADEMIC) */}
          {book.academicMethodology && (
            <div className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-[#101724] to-[#080C14] border border-sky-500/30 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sky-400 mb-3">
                <GraduationCap className="w-4 h-4 text-sky-400" />
                <span>Formal Academic Epistemology & Methodology</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-300 mb-4">
                <div>
                  <span className="font-bold text-gray-400 block mb-1">THEORETICAL FRAMEWORK:</span>
                  <p>{book.academicMethodology.formalFramework}</p>
                </div>
                <div>
                  <span className="font-bold text-gray-400 block mb-1">EMPIRICAL REPLICATION STATUS:</span>
                  <p>{book.academicMethodology.empiricalValidity}</p>
                </div>
              </div>

              {book.academicMethodology.mathematicalFoundations && book.academicMethodology.mathematicalFoundations.length > 0 && (
                <div className="p-3.5 rounded-xl bg-black/40 border border-sky-500/20 mb-3 text-xs font-mono text-sky-200">
                  <span className="font-bold text-gray-400 block mb-1 font-sans">MATHEMATICAL / FORMAL CORE:</span>
                  {book.academicMethodology.mathematicalFoundations.map((f, i) => (
                    <div key={i} className="py-0.5">• {f}</div>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-400 italic">
                <strong>Methodological Boundary:</strong> {book.academicMethodology.limitations}
              </p>
            </div>
          )}

          {/* TIER 1: THE SPARK (1-Min Flash) */}
          {depth === 'spark' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Executive Thesis Box */}
              <div className="p-6 rounded-2xl bg-[#141724] border-l-4 border-[#E5C17D] shadow-lg">
                <span className="text-xs uppercase tracking-widest font-bold text-[#E5C17D]">The Central Thesis</span>
                <p className="text-base sm:text-lg text-white font-serif leading-relaxed mt-2">
                  {book.spark.executiveThesis}
                </p>
              </div>

              {/* Bottom Line */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/30">
                <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400">The 30-Second Bottom Line</span>
                <p className="text-base font-semibold text-gray-200 mt-1">
                  {book.spark.bottomLine}
                </p>
              </div>

              {/* Three Golden Rules */}
              <div>
                <h3 className="font-serif text-xl font-bold text-white mb-4">Three Non-Negotiable Rules</h3>
                <div className="space-y-3">
                  {book.spark.threeGoldenRules.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="w-7 h-7 rounded-full bg-[#E5C17D]/20 text-[#E5C17D] flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
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
              
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
                💡 <strong>Core Structural Chapters:</strong> Deep dive into the primary narrative progression and conceptual frameworks.
              </div>

              {book.core.chapters.map((ch) => (
                <article key={ch.number} className="pb-8 border-b border-white/10 last:border-b-0">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-[#E5C17D]">
                      Chapter {ch.number}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-white">
                      {ch.title}
                    </h3>
                    {ch.originalCitation && (
                      <span className="text-xs text-gray-400 font-mono ml-auto">
                        [{ch.originalCitation}]
                      </span>
                    )}
                  </div>

                  <p className="font-serif text-base sm:text-lg text-gray-300 leading-relaxed mb-4">
                    {ch.breakdown}
                  </p>

                  {/* Key Insight Pill */}
                  <div className="p-4 rounded-xl bg-[#131622] border border-[#E5C17D]/20 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5C17D]">Key Operational Insight</span>
                    <p className="text-sm text-gray-200 font-medium mt-1">
                      {ch.keyInsight}
                    </p>
                  </div>

                  {/* Real Anecdote */}
                  {ch.anecdote && (
                    <div className="p-3.5 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-400 italic">
                      <span className="font-semibold text-gray-300 not-italic">Case Note: </span>
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
              <section className="p-6 rounded-2xl bg-gradient-to-br from-[#1E1215] to-[#120B0D] border border-rose-500/30">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                  <h3 className="text-lg font-bold text-white">The Crucible: Author Blind Spots & Counter-Arguments</h3>
                </div>
                
                <p className="text-sm text-gray-300 leading-relaxed mb-5">
                  <strong>Critical Critique:</strong> {book.masterclass.dialecticCritique.authorBlindspots}
                </p>

                <div className="space-y-3">
                  {book.masterclass.dialecticCritique.counterArguments.map((ca, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#0D0708] border border-rose-500/20">
                      <span className="text-xs font-bold text-rose-400 uppercase tracking-wide">
                        Opposing Thinker: {ca.opposingThinker}
                      </span>
                      <p className="text-xs sm:text-sm text-gray-300 mt-1 leading-relaxed">
                        {ca.counterpoint}
                      </p>
                    </div>
                  ))}
                </div>

                {book.masterclass.dialecticCritique.validityNotes && (
                  <p className="text-xs text-gray-400 mt-4 italic">
                    * {book.masterclass.dialecticCritique.validityNotes}
                  </p>
                )}
              </section>

              {/* Author Biases */}
              <section>
                <h3 className="font-serif text-xl font-bold text-white mb-3">Cognitive Biases & Worldview Constraints</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {book.masterclass.authorBiases.map((bias, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs sm:text-sm text-gray-300">
                      • {bias}
                    </div>
                  ))}
                </div>
              </section>

              {/* Real World Case Studies */}
              <section>
                <h3 className="font-serif text-xl font-bold text-white mb-4">Empirical & Historical Case Studies</h3>
                <div className="space-y-4">
                  {book.masterclass.caseStudies.map((cs, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-[#121522] border border-white/10">
                      <h4 className="font-bold text-sm text-[#E5C17D]">{cs.entity}</h4>
                      <p className="text-xs text-gray-300 mt-1 leading-relaxed"><strong>Scenario:</strong> {cs.scenario}</p>
                      <p className="text-xs text-emerald-400 mt-1 font-semibold"><strong>Outcome:</strong> {cs.outcome}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* The Tactical Action Playbook */}
              <section className="p-6 rounded-2xl bg-gradient-to-br from-[#121824] to-[#0A0D15] border border-emerald-500/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>The Action Playbook (Execute Today)</span>
                  </h3>
                  <span className="text-xs text-emerald-400 font-mono">
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
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-gray-300'
                            : 'bg-white/5 border-white/5 hover:border-white/20 text-white'
                        }`}
                      >
                        <button className="mt-0.5 text-emerald-400">
                          {isDone ? <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" /> : <Circle className="w-5 h-5 text-gray-500" />}
                        </button>
                        <div className="flex-1">
                          <h4 className={`text-sm font-bold ${isDone ? 'line-through text-gray-400' : 'text-white'}`}>
                            {step.step}. {step.action}
                          </h4>
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                            {step.executionDetail}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Socratic Self-Reflection */}
              <section className="p-6 rounded-2xl bg-[#141724] border border-white/10">
                <h3 className="font-serif text-xl font-bold text-white mb-3">Socratic Reflection Prompts</h3>
                <div className="space-y-2.5">
                  {book.masterclass.socraticReflection.map((q, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg bg-black/40 text-sm text-gray-300 italic border-l-2 border-[#E5C17D]">
                      “{q}”
                    </div>
                  ))}
                </div>
              </section>

            </div>
          )}

          {/* Key Quotes Bar with Dual-Language Source Presentation */}
          <div className="mt-14 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                <Quote className="w-5 h-5 text-[#E5C17D]" />
                <span>Golden Quotations & Classical Excerpts</span>
              </h3>
              <span className="text-xs text-gray-400">Tap quote to export luxury card</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {book.keyQuotes.map((kq, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedQuote({ quote: kq.quote, author: book.author })}
                  className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#E5C17D]/40 transition cursor-pointer flex flex-col justify-between"
                >
                  {kq.originalQuote && (
                    <p className="font-serif text-sm text-amber-200/90 mb-2 leading-relaxed">
                      "{kq.originalQuote}"
                      <span className="block text-[10px] text-gray-400 font-mono mt-0.5">
                        [{kq.originalLanguage || 'Original Script'}]
                      </span>
                    </p>
                  )}
                  <p className="font-serif text-sm sm:text-base text-gray-200 italic leading-relaxed">
                    “{kq.quote}”
                  </p>
                  <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                    <span className="text-[11px] truncate">{kq.context}</span>
                    <span className="text-[#E5C17D] opacity-0 group-hover:opacity-100 transition flex items-center gap-1 font-semibold">
                      Export <Share2 className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
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
