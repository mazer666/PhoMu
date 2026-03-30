/**
 * Timeline-Modus — Progressive Difficulty
 *
 * Startet mit 2 Ankern (3 Slots). Für jede richtig platzierte Karte
 * wächst die Timeline um einen Anker (= einen Slot schwieriger).
 * Max: 8 Anker / 9 Slots.
 */
'use client';

import { useMemo, useState, useEffect } from 'react';
import type { PhomuSong } from '@/types/song';
import { getAllSongs } from '@/utils/song-picker';
import { useGameStore } from '@/stores/game-store';
import { MusicPlayer } from '../MusicPlayer';

const MIN_ANCHORS = 2;
const MAX_ANCHORS = 8;

function pickAnchors(currentSongId: string, count: number): PhomuSong[] {
  const pool = getAllSongs().filter((s) => s.id !== currentSongId);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).sort((a, b) => a.year - b.year);
}

function correctSlot(song: PhomuSong, anchors: PhomuSong[]): number {
  for (let i = 0; i < anchors.length; i++) {
    if (song.year <= (anchors[i]?.year ?? Infinity)) return i;
  }
  return anchors.length; // after last anchor
}

interface TimelineModeProps {
  song: PhomuSong;
  onAnswer: (isCorrect: boolean, pointsAwarded: number) => void;
  onReveal?: () => void;
}

export function TimelineMode({ song, onAnswer, onReveal }: TimelineModeProps) {
  const { roundHistory } = useGameStore();

  // Difficulty: count past correctly answered timeline rounds
  const correctCount = useMemo(() =>
    roundHistory.filter(r => r.mode === 'timeline' && r.answers.some(a => a.isCorrect)).length,
    [roundHistory]
  );
  const numAnchors = Math.min(MIN_ANCHORS + correctCount, MAX_ANCHORS);
  const numSlots = numAnchors + 1;
  const points = numAnchors + 1; // more anchors = more points

  const anchors = useMemo(() => pickAnchors(song.id, numAnchors), [song.id, numAnchors]);
  const correct = useMemo(() => correctSlot(song, anchors), [song, anchors]);

  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  function handleDrop(slotIndex: number) {
    if (isRevealed) return;
    setSelectedSlot(slotIndex);
  }

  function handleReveal() {
    if (selectedSlot === null || isRevealed) return;
    const isCorrect = selectedSlot === correct;
    setIsRevealed(true);
    onAnswer(isCorrect, isCorrect ? points : 0);
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (isRevealed) return;
      const num = parseInt(e.key);
      if (!isNaN(num) && num >= 1 && num <= numSlots) {
        handleDrop(num - 1);
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        setSelectedSlot(prev => (prev === null || prev === 0) ? numSlots - 1 : prev - 1);
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        setSelectedSlot(prev => (prev === null || prev === numSlots - 1) ? 0 : prev + 1);
      }
      if ((e.key === 'Enter' || e.key === ' ') && selectedSlot !== null) {
        handleReveal();
      }
    }
    window.addEventListener('keydown', handleKeyDown as any);
    return () => window.removeEventListener('keydown', handleKeyDown as any);
  }, [selectedSlot, isRevealed, numSlots]);

  return (
    <div className="flex flex-col px-4 py-6 gap-5 max-w-xl mx-auto pb-40">

      {/* Musik Player */}
      {song.links?.youtube && (
        <MusicPlayer youtubeLink={song.links.youtube} blurred={!isRevealed} />
      )}

      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black uppercase tracking-tight">
          {!isRevealed
            ? 'Wann war dieser Song?'
            : selectedSlot === correct ? 'Goldrichtig! ✨' : 'Leider daneben... 🌧️'}
        </h2>
        <div className="flex items-center justify-center gap-3">
          <p className="opacity-40 text-[9px] font-black uppercase tracking-[0.2em]">
            {!isRevealed ? `${numSlots} Positionen · ${points} Punkte` : 'Das war die Lösung'}
          </p>
          {correctCount > 0 && !isRevealed && (
            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[var(--color-accent)]/20 text-[var(--color-accent)] uppercase tracking-wider">
              Lvl {correctCount + 1}
            </span>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="w-full flex flex-col">
        {Array.from({ length: numSlots }, (_, slotIdx) => {
          const isTarget = selectedSlot === slotIdx;
          const anchor = anchors[slotIdx]; // undefined for last slot

          return (
            <div key={slotIdx} className="flex flex-col">
              {/* Slot row */}
              <div className="flex items-center gap-3">
                {/* Timeline line column */}
                <div className="w-12 shrink-0 flex flex-col items-center">
                  <div className="w-0.5 flex-1 bg-white/10 min-h-[10px]" />
                  <div className="w-2 h-2 rounded-full bg-white/20 my-0.5 shrink-0" />
                  <div className="w-0.5 flex-1 bg-white/10 min-h-[10px]" />
                </div>

                {/* Slot button */}
                <button
                  onClick={() => handleDrop(slotIdx)}
                  className={[
                    'flex-1 rounded-xl border-2 border-dashed flex items-center justify-center transition-all focus:outline-none',
                    numSlots <= 5 ? 'h-20' : numSlots <= 7 ? 'h-16' : 'h-12',
                    isTarget && !isRevealed ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10' : '',
                    !isTarget && !isRevealed ? 'border-white/10 bg-white/[0.02] hover:border-white/20' : '',
                    isRevealed && slotIdx === correct ? 'border-green-500 bg-green-500/10' : '',
                    isRevealed && isTarget && slotIdx !== correct ? 'border-red-500 bg-red-500/10' : '',
                    isRevealed && !isTarget && slotIdx !== correct ? 'border-white/5 bg-transparent' : '',
                  ].join(' ')}
                >
                  {isTarget && !isRevealed && (
                    <div className="flex items-center gap-2 px-3">
                      <span className="text-sm">🎵</span>
                      <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Eingesetzt</p>
                    </div>
                  )}
                  {isTarget && isRevealed && (
                    <div className="flex items-center gap-3 px-3">
                      <div className="text-left">
                        <p className="text-xs font-black uppercase truncate max-w-[160px]">{song.artist}</p>
                        <p className="text-[9px] opacity-40 uppercase truncate max-w-[160px] leading-none mb-0.5">{song.title}</p>
                        <p className="text-lg font-black">{song.year}</p>
                      </div>
                    </div>
                  )}
                  {!isTarget && !isRevealed && (
                    <span className="text-[9px] font-black opacity-10 uppercase tracking-widest">
                      {numSlots <= 9 ? String(slotIdx + 1) : ''}
                    </span>
                  )}
                  {isRevealed && !isTarget && slotIdx === correct && (
                    <div className="flex items-center gap-2 text-green-400 font-black px-3">
                      <span>←</span>
                      <span className="text-[10px] uppercase tracking-widest">Hier</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Year label between slots */}
              {anchor && (
                <div className="flex items-center gap-3">
                  <div className="w-12 shrink-0 flex justify-center py-0.5">
                    <div className="px-2.5 py-0.5 bg-[var(--color-bg-card)] border border-white/15 rounded-full shadow-md">
                      <p className="text-[11px] font-black text-white leading-none">{anchor.year}</p>
                    </div>
                  </div>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-8 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/90 to-transparent z-[60]">
        <div className="max-w-md mx-auto">
          <button
            disabled={selectedSlot === null}
            onClick={isRevealed ? onReveal : handleReveal}
            className={[
              'w-full py-5 rounded-3xl font-black text-lg transition-all shadow-2xl',
              selectedSlot !== null
                ? 'bg-[var(--color-accent)] text-white scale-[1.02] shadow-[0_10px_40px_-10px_rgba(var(--color-accent-rgb),0.5)]'
                : 'bg-white/5 opacity-20 text-white/40 cursor-not-allowed',
            ].join(' ')}
          >
            {isRevealed ? 'WEITER →' : 'AUFLÖSEN'}
          </button>
        </div>
      </footer>
    </div>
  );
}
