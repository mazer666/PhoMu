/**
 * Cover-Confusion-Modus (New Mode Phase 5)
 * 
 * Es spielt eine Cover-Version eines Welthits.
 * Ziel: Den originalen Interpreten identifizieren.
 * Punkte: 5 Punkte für richtige Antwort.
 */
'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { PhomuSong } from '@/types/song';
import { getAllSongs } from '@/utils/song-picker';
import { MusicPlayer } from '../MusicPlayer';

const COVER_POINTS = 5;

interface CoverConfusionModeProps {
  song: PhomuSong;
  onAnswer: (isCorrect: boolean, pointsAwarded: number) => void;
}

export function CoverConfusionMode({ song, onAnswer }: CoverConfusionModeProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  // Auswahl-Optionen generieren (1 richtiger Original-Interpret + 3 falsche)
  const options = useMemo(() => {
    const allSongs = getAllSongs();
    const otherArtists = Array.from(new Set(allSongs
      .map(s => s.artist)
      .filter(a => a !== song.artist)
    ));
    
    // Zufällig 3 falsche Interpreten wählen
    const shuffledWrong = [...otherArtists].sort(() => Math.random() - 0.5).slice(0, 3);
    
    // Mischen mit dem richtigen
    return [...shuffledWrong, song.artist].sort(() => Math.random() - 0.5);
  }, [song.artist]);

  function handleSelect(artist: string) {
    if (answered) return;
    const isCorrect = artist === song.artist;
    setSelected(artist);
    setAnswered(true);
    onAnswer(isCorrect, isCorrect ? COVER_POINTS : 0);
  }

  // Cover-Link priorisieren, sonst Standard-YouTube (als Fallback)
  const playLink = song.links.coverLink || song.links.youtube;

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-6 gap-8">
      
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-black uppercase tracking-tight">Cover Confusion 🎭</h3>
        <p className="opacity-50 text-xs font-bold uppercase tracking-widest">Wer ist der ORIGINAL Interpret?</p>
      </div>

      {/* Music Player */}
      <div className="w-full max-w-sm">
        <MusicPlayer 
          youtubeLink={playLink} 
          startSeconds={song.previewTimestamp?.start ?? 0} 
        />
        {song.links.coverLink && (
          <p className="text-[10px] text-center mt-2 font-black uppercase text-[var(--color-accent)] animate-pulse">
            COVER-VERSION AKTIV
          </p>
        )}
      </div>

      {/* Answer Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
        {options.map((artist) => {
          const isSelected = selected === artist;
          const isCorrect = answered && artist === song.artist;
          const isWrong = answered && isSelected && !isCorrect;

          return (
            <button
              key={artist}
              onClick={() => handleSelect(artist)}
              disabled={answered}
              className={`
                py-4 px-6 rounded-2xl border-2 font-black transition-all text-center
                ${isSelected && !answered ? 'border-[var(--color-accent)] bg-white/5' : 'border-white/5 bg-white/5'}
                ${isCorrect ? 'border-green-500 bg-green-500/20 text-green-500' : ''}
                ${isWrong ? 'border-red-500 bg-red-500/20 text-red-500' : ''}
                ${answered && !isSelected && !isCorrect ? 'opacity-30' : ''}
              `}
            >
              {artist}
            </button>
          )
        })}
      </div>

      {answered && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm opacity-50"
        >
          {selected === song.artist ? '✅ Richtig erkannt!' : '❌ Falsch getippt!'} Wartet auf das Reveal …
        </motion.p>
      )}
    </div>
  );
}
