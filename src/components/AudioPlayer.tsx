import React, { useState, useEffect, useRef } from 'react';
import { BookSummary } from '../types';
import { Play, Pause, Square, RotateCcw, RotateCw, Volume2, VolumeX, X, FastForward } from 'lucide-react';

interface AudioPlayerProps {
  book: BookSummary;
  textToRead: string;
  onClose: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ book, textToRead, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [progress, setProgress] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Stop everything immediately on mount & when text changes
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);

    const initUtterance = () => {
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = playbackRate;

      // Select highest quality available voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        (v.lang.startsWith('en')) && 
        (v.name.includes('Premium') || v.name.includes('Enhanced') || v.name.includes('Siri') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Google US English'))
      ) || voices.find(v => v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onboundary = (e) => {
        if (textToRead.length > 0) {
          setProgress(Math.min(100, Math.round((e.charIndex / textToRead.length) * 100)));
        }
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setProgress(100);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      utteranceRef.current = utterance;
    };

    if ('speechSynthesis' in window) {
      initUtterance();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = initUtterance;
      }
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [textToRead]);

  const handlePlayPause = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this device/browser.');
      return;
    }

    if (isPlaying && !isPaused) {
      // Pause
      window.speechSynthesis.pause();
      setIsPaused(true);
    } else if (isPaused) {
      // Resume
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      // Start fresh
      window.speechSynthesis.cancel();
      if (utteranceRef.current) {
        utteranceRef.current.rate = playbackRate;
        window.speechSynthesis.speak(utteranceRef.current);
        setIsPlaying(true);
        setIsPaused(false);
      }
    }
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
  };

  const handleSpeedCycle = () => {
    const speeds = [0.8, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackRate(nextSpeed);

    if ('speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.cancel();
      if (utteranceRef.current) {
        utteranceRef.current.rate = nextSpeed;
        window.speechSynthesis.speak(utteranceRef.current);
        setIsPlaying(true);
        setIsPaused(false);
      }
    }
  };

  const handleClose = () => {
    handleStop();
    onClose();
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <div className="glass-panel-elevated bg-[#0D0F17]/95 border border-[#E5C17D]/40 rounded-2xl p-4 shadow-2xl flex flex-col gap-2">
        
        {/* Progress Bar */}
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#E5C17D] to-[#FFDA85] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* Metadata */}
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-[#E5C17D]/15 border border-[#E5C17D]/30 flex items-center justify-center shrink-0">
              <Volume2 className="w-5 h-5 text-[#E5C17D]" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-[#E5C17D] uppercase tracking-wider">Audio Narration</p>
              <h4 className="text-sm font-bold text-white truncate">{book.title}</h4>
              <p className="text-xs text-gray-400 truncate">{book.author}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Speed */}
            <button
              onClick={handleSpeedCycle}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#E5C17D] transition-colors border border-white/10"
              title="Change Speed"
            >
              {playbackRate}x
            </button>

            {/* Play/Pause */}
            <button
              onClick={handlePlayPause}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-[#E5C17D] to-[#C99C4B] hover:brightness-110 flex items-center justify-center text-black shadow-lg transition-transform active:scale-95"
              title={isPlaying && !isPaused ? "Pause" : "Play"}
            >
              {isPlaying && !isPaused ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Stop */}
            <button
              onClick={handleStop}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 transition-colors"
              title="Stop Narration"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>

            {/* Close */}
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Close Player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
