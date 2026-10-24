import React from 'react';
import { MentalModel } from '../types';
import { Compass, RefreshCw, TrendingUp, Grid, Target } from 'lucide-react';

interface MentalModelViewerProps {
  model: MentalModel;
}

export const MentalModelViewer: React.FC<MentalModelViewerProps> = ({ model }) => {
  return (
    <div className="my-8 p-6 rounded-2xl bg-gradient-to-br from-[#151824] to-[#0D0F17] border border-[#E5C17D]/30 shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#E5C17D]/10 text-[#E5C17D] flex items-center justify-center border border-[#E5C17D]/20">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#E5C17D] font-bold">Interactive Mental Model</span>
            <h4 className="text-base font-bold text-white">{model.name}</h4>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-300 font-mono capitalize">
          {model.diagramType} diagram
        </span>
      </div>

      <p className="text-sm text-gray-300 leading-relaxed mb-6">
        {model.description}
      </p>

      {/* Visual Representation based on diagram type */}
      {model.diagramType === 'matrix' && (
        <div className="grid grid-cols-2 gap-3 p-4 bg-[#0B0D14] rounded-xl border border-white/5">
          <div className="p-4 rounded-lg bg-[#141724] border border-blue-500/20">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-400">High Leverage / High Urgency</div>
            <p className="text-xs text-gray-300 mt-1">Execute Immediately. Strategic focus with direct executive sponsorship.</p>
          </div>
          <div className="p-4 rounded-lg bg-[#141724] border border-emerald-500/20">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">High Leverage / Low Urgency</div>
            <p className="text-xs text-gray-300 mt-1">The Moat Builder. Deep work, capability development, and system architecture.</p>
          </div>
          <div className="p-4 rounded-lg bg-[#141724] border border-amber-500/20">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Low Leverage / High Urgency</div>
            <p className="text-xs text-gray-300 mt-1">Delegate or Automate. Immediate friction that drains cognitive bandwidth.</p>
          </div>
          <div className="p-4 rounded-lg bg-[#141724] border border-rose-500/20">
            <div className="text-[11px] font-bold uppercase tracking-wider text-rose-400">Low Leverage / Low Urgency</div>
            <p className="text-xs text-gray-300 mt-1">Ruthlessly Eliminate. Busywork, trivial status meetings, and digital distraction.</p>
          </div>
        </div>
      )}

      {model.diagramType === 'loop' && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-[#0B0D14] rounded-xl border border-white/5">
          <div className="flex-1 text-center p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <div className="text-xs font-bold text-amber-400">1. CUE</div>
            <div className="text-[11px] text-gray-300 mt-1">Make it Obvious</div>
          </div>
          <div className="text-gray-500 text-xs font-bold">→</div>
          <div className="flex-1 text-center p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
            <div className="text-xs font-bold text-indigo-400">2. CRAVING</div>
            <div className="text-[11px] text-gray-300 mt-1">Make it Attractive</div>
          </div>
          <div className="text-gray-500 text-xs font-bold">→</div>
          <div className="flex-1 text-center p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <div className="text-xs font-bold text-emerald-400">3. RESPONSE</div>
            <div className="text-[11px] text-gray-300 mt-1">Make it Easy</div>
          </div>
          <div className="text-gray-500 text-xs font-bold">→</div>
          <div className="flex-1 text-center p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <div className="text-xs font-bold text-cyan-400">4. REWARD</div>
            <div className="text-[11px] text-gray-300 mt-1">Make it Satisfying</div>
          </div>
        </div>
      )}

      {model.diagramType === 'compounding' && (
        <div className="p-4 bg-[#0B0D14] rounded-xl border border-white/5 flex flex-col items-center">
          <div className="w-full flex justify-between text-xs text-gray-400 mb-2">
            <span>Linear Effort (1% Daily)</span>
            <span className="text-[#E5C17D] font-bold">37.78x Exponential Multiplier</span>
          </div>
          <div className="relative w-full h-24 bg-[#141724] rounded-lg overflow-hidden flex items-end px-4 pb-2">
            <div className="absolute inset-0 bg-gradient-to-t from-[#E5C17D]/10 to-transparent pointer-events-none" />
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 80" preserveAspectRatio="none">
              <path
                d="M 0 78 Q 200 75 320 40 T 400 5"
                fill="none"
                stroke="#E5C17D"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <line x1="0" y1="78" x2="400" y2="78" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
          </div>
          <div className="text-[11px] text-gray-400 mt-3 text-center">
            The power of compounding is invisible early on; value explodes past the inflection point.
          </div>
        </div>
      )}

      {model.diagramType === 'flywheel' && (
        <div className="p-4 bg-[#0B0D14] rounded-xl border border-white/5 flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
          <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/30">
            <div className="text-xs font-bold text-sky-400">Clear Goals</div>
            <span className="text-[10px] text-gray-400">Priority Alignment</span>
          </div>
          <div className="text-gray-500 font-bold">↻</div>
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <div className="text-xs font-bold text-amber-400">Diagnose Root Problems</div>
            <span className="text-[10px] text-gray-400">Zero Tolerance for Flaws</span>
          </div>
          <div className="text-gray-500 font-bold">↻</div>
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <div className="text-xs font-bold text-emerald-400">Push to Results</div>
            <span className="text-[10px] text-gray-400">Discipline & Momentum</span>
          </div>
        </div>
      )}
    </div>
  );
};
