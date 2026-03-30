/**
 * Timeline-Modus (Redesigned Phase 5)
 *
 * Drei Anker-Songs mit sichtbaren Jahren werden angezeigt.
 * Die neue Karte ist "blank" — man hört nur die Musik.
 * Der Spieler zieht die Karte in den passenden Slot (Drag & Drop).
 * Erst bei "Reveal" werden Cover/Name/Jahr sichtbar.
 */
'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PhomuSong } from '@/types/song';
import { getAllSongs } from '@/utils/song-picker';

const TIMELINE_POINTS = 5;

function pickAnchors(currentSongId: string): PhomuSong[] {
  const pool = getAllSongs().filter((s) => s.id !== currentSongId);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).sort((a, b) => a.year - b.year);
}

function correctSlot(song: PhomuSong, anchors: PhomuSong[]): number {
  if (song.year < (anchors[0]?.year ?? Infinity)) return 0;
  if (song.year <= (anchors[1]?.year ?? Infinity)) return 1;
  if (song.year <= (anchors[2]?.year ?? Infinity)) return 2;
  return 3;
}

interface TimelineModeProps {
  song: PhomuSong;
  onAnswer: (isCorrect: boolean, pointsAwarded: number) => void;
  roundNumber?: number; 
}

export function TimelineMode({ song, onAnswer, roundNumber = 1 }: TimelineModeProps) {
  const anchors = useMemo(() => pickAnchors(song.id), [song.id]);
  const correct = useMemo(() => correctSlot(song, anchors), [song, anchors]);

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [canDiscard, setCanDiscard] = useState(roundNumber % 10 === 0);

  function handleDrop(slotIndex: number) {
    if (isRevealed) return;
    setSelectedSlot(slotIndex);
  }

  function handleReveal() {
    if (selectedSlot === null || isRevealed) return;
    const isCorrect = selectedSlot === correct;
    setIsRevealed(true);
    onAnswer(isCorrect, isCorrect ? TIMELINE_POINTS : 0);
  }

  // Keyboard Navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isRevealed) return;
      
      // Numbers 1-4 for slots
      if (['1', '2', '3', '4'].includes(e.key)) {
        handleDrop(parseInt(e.key) - 1);
      }
      
      // Arrows for slots
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        setSelectedSlot(prev => (prev === null || prev === 0) ? 3 : prev - 1);
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        setSelectedSlot(prev => (prev === null || prev === 3) ? 0 : prev + 1);
      }

      // Enter/Space to reveal
      if ((e.key === 'Enter' || e.key === ' ') && selectedSlot !== null) {
        handleReveal();
      }
    }

    window.addEventListener('keydown', handleKeyDown as any);
    return () => window.removeEventListener('keydown', handleKeyDown as any);
  }, [selectedSlot, isRevealed]);

  return (
    <div className="flex flex-col items-center px-4 py-8 gap-8 max-w-xl mx-auto min-h-[60vh]">
      
      {/* Dynamic Instruction */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black uppercase tracking-tight">
          {!isRevealed ? "Hör genau hin!" : selectedSlot === correct ? "Goldrichtig! ✨" : "Leider daneben... 🌧️"}
        </h2>
        <p className="opacity-50 text-xs font-bold uppercase tracking-widest">
          {!isRevealed ? "Wähle den Slot (Tasten 1-4 oder Klicken)" : "Das war die Lösung"}
        </p>
      </div>

      {/* Timeline Layout */}
      <div className="w-full relative flex flex-col gap-12 mt-4">
        {/* Connection Line */}
        <div className="absolute left-1/2 top-4 bottom-4 w-1 bg-white/5 -translate-x-1/2 rounded-full" />

        <div className="space-y-6">
          {[0, 1, 2, 3].map((slotIdx) => {
            const isTarget = selectedSlot === slotIdx;
            
            return (
              <div key={slotIdx} className="relative">
                {/* Slot Area as Button for Accessibility */}
                <button 
                  onClick={() => handleDrop(slotIdx)}
                  className={`
                    w-full h-24 rounded-2xl border-2 border-dashed flex items-center justify-center transition-all focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)]/50
                    ${isTarget ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 scale-105' : 'border-white/10 hover:border-white/20'}
                    ${isRevealed && slotIdx === correct ? 'border-green-500 bg-green-500/20' : ''}
                    ${isRevealed && isTarget && slotIdx !== correct ? 'border-red-500 bg-red-500/20' : ''}
                  `}
                >
                  {isTarget && (
                    <div className="text-center">
                      {!isRevealed ? (
                        <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Eingesetzt</p>
                      ) : (
                        <div className="flex items-center gap-2">
                           <img src={song.coverUrl || '/placeholder-cd.png'} className="w-16 h-16 rounded-lg object-cover shadow-2xl" alt="Cover" />
                           <div className="text-left">
                             <p className="text-xs font-black uppercase">{song.artist}</p>
                             <p className="text-[10px] font-bold opacity-60 text-white/40">{song.title}</p>
                             <p className="text-lg font-black text-green-400">{song.year}</p>
                           </div>
                        </div>
                      )}
                    </div>
                  )}
                  {!isTarget && !isRevealed && (
                    <p className="text-[10px] font-black opacity-20 uppercase tracking-widest">Slot {slotIdx + 1}</p>
                  )}
                  {isRevealed && !isTarget && slotIdx === correct && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 font-black flex items-center gap-2">
                       <span className="text-xs">RICHTIG</span>
                       <span className="text-2xl">←</span>
                    </div>
                  )}
                </button>

                {/* Anchor Card */}
                {slotIdx < 3 && anchors[slotIdx] && (
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-10">
                    <div className="px-4 py-2 bg-[var(--color-bg-card)] border border-white/10 rounded-xl shadow-2xl">
                      <p className="text-xl font-black text-center leading-none">{anchors[slotIdx].year}</p>
                      <p className="text-[8px] font-bold opacity-40 uppercase text-center truncate max-w-[80px]">
                        {anchors[slotIdx].artist}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <footer className="fixed bottom-10 left-0 right-0 px-6 z-[60]">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-4">
          {canDiscard && !isRevealed && (
            <button 
              onClick={() => onAnswer(false, 0)}
              className="py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all"
            >
              Abgeben (10/10)
            </button>
          )}
          
          <button 
            disabled={selectedSlot === null || isRevealed}
            onClick={handleReveal}
            className={`
              col-span-full py-5 rounded-3xl font-black text-lg transition-all shadow-2xl
              ${selectedSlot !== null && !isRevealed ? 'bg-[var(--color-accent)] animate-bounce text-white' : 'bg-white/10 opacity-40 text-white/40'}
            `}
          >
            {isRevealed ? "GEWERTET" : "JETZT AUFLÖSEN"}
          </button>
        </div>
      </footer>

      {/* Initial Blank Card Placeholder */}
      <AnimatePresence>
        {!selectedSlot && (
          <motion.div 
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 w-48 h-64 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border-2 border-white/20 backdrop-blur-2xl flex flex-col items-center justify-center gap-4 z-50 pointer-events-none shadow-[0_0_50px_rgba(255,255,255,0.1)]"
          >
            <div className="w-12 h-12 rounded-full border-4 border-[var(--color-accent)] animate-ping" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Suchen...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
