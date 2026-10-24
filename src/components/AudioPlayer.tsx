import React, { useState, useEffect, useRef } from 'react';
import { BookSummary } from '../types';
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, X, FastForward } from 'lucide-react';

interface AudioPlayerProps {
  book: BookSummary;
  textToRead: string;
  onClose: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ book, textToRead, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = playbackRate;
      
      // Select best English natural voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Premium') || v.name.includes('Samantha') || v.name.includes('Daniel')));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onboundary = (e) => {
        if (textToRead.length > 0) {
          setProgress((e.charIndex / textToRead.length) * 100);
        }
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setProgress(100);
      };

      utteranceRef.current = utterance;
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [textToRead, playbackRate]);

  const togglePlay = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else if (utteranceRef.current) {
        window.speechSynthesis.speak(utteranceRef.current);
      }
      setIsPlaying(true);
    }
  };

  const handleSpeedCycle = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackRate(nextSpeed);
    if ('speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.cancel();
      if (utteranceRef.current) {
        utteranceRef.current.rate = nextSpeed;
        window.speechSynthesis.speak(utteranceRef.current);
      }
    }
  };

  const skipSeconds = (seconds: number) => {
    // Restart or advance progress estimation
    setProgress(prev => Math.min(100, Math.max(0, prev + (seconds > 0 ? 5 : -5))));
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <div className="glass-panel-elevated bg-[#0D0F17]/95 border border-[#E5C17D]/40 rounded-2xl p-4 shadow-2xl flex flex-col gap-2">
        
        {/* Progress Bar */}
        <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#E5C17D] to-[#FFDA85] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-4 mt-1">
          {/* Book Info */}
          <div className="flex items-center gap-3 overflow-hidden min-w-0">
            <div className="w-10 h-12 rounded bg-gradient-to-br from-[#1E202B] to-[#0A0B10] border border-white/10 flex-shrink-0 flex items-center justify-center">
              <span className="text-[10px] font-bold text-[#E5C17D] line-clamp-1 p-1">MS</span>
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-white truncate">{book.title}</h4>
              <p className="text-[11px] text-gray-400 truncate">{book.author} • Narration</p>
            </div>
          </div>

          {/* Core Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => skipSeconds(-15)}
              className="p-2 text-gray-400 hover:text-white transition cursor-pointer"
              title="Rewind 15 seconds"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-[#E5C17D] text-[#090A0F] flex items-center justify-center hover:scale-105 active:scale-95 shadow-lg shadow-[#E5C17D]/30 transition cursor-pointer"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={() => skipSeconds(15)}
              className="p-2 text-gray-400 hover:text-white transition cursor-pointer"
              title="Forward 15 seconds"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Speed Button */}
            <button
              onClick={handleSpeedCycle}
              className="px-2 py-1 text-xs font-mono font-bold rounded-lg bg-white/10 text-[#E5C17D] hover:bg-white/20 transition cursor-pointer"
            >
              {playbackRate}x
            </button>
          </div>

          {/* Close */}
          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
