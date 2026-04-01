/**
 * ModeSelector
 *
 * Multi-Select-Komponente für die 5 Phomu-Spielmodi.
 * Jeder Modus wird mit Icon, Titel und Kurzbeschreibung angezeigt.
 * Mindestens ein Modus muss immer aktiv bleiben.
 */
'use client';

import { motion } from 'framer-motion';
import type { GameMode } from '@/config/game-config';

// ─── Modus-Metadaten ──────────────────────────────────────────────

interface ModeInfo {
  id: GameMode;
  icon: string;
  title: string;
  description: string;
}

/** Beschreibungen für alle 5 Spielmodi auf Deutsch */
const MODES: ModeInfo[] = [
  {
    id: 'timeline',
    icon: '📅',
    title: 'Chronologische Timeline',
    description:
      'Sortiere Songs nach ihrem Erscheinungsjahr. Wer die perfekteste Zeitlinie baut, gewinnt!',
  },
  {
    id: 'hint-master',
    icon: '🕵️',
    title: 'Hint-Master',
    description:
      'Erkenne den Song anhand von bis zu 5 Hinweisen. Je früher du rätst, desto mehr Punkte!',
  },
  {
    id: 'lyrics',
    icon: '📝',
    title: 'Lyrics Labyrinth',
    description:
      'Welcher Liedtext ist echt, welcher ist frei erfunden? Entlarve die falschen Lyrics!',
  },
  {
    id: 'vibe-check',
    icon: '😎',
    title: 'Vibe-Check',
    description:
      'Ordne jeden Song einer Stimmung zu — Punkte gibt es, wenn ihr alle gleich fühlt.',
  },
  {
    id: 'survivor',
    icon: '🏆',
    title: 'Survivor',
    description:
      'One-Hit-Wonder oder Dauerstar? Erkenne, ob ein Artist nur diesen einen Hit hatte.',
  },
  {
    id: 'cover-confusion',
    icon: '🎭',
    title: 'Cover Confusion',
    description:
      'Hör einen Cover-Song und errate den Original-Interpreten — mit oder ohne Hinweise.',
  },
];

// ─── Props ────────────────────────────────────────────────────────

interface ModeSelectorProps {
  /** Aktuell ausgewählte Modi */
  selectedModes: GameMode[];
  /** Wird aufgerufen, wenn sich die Auswahl ändert */
  onChange: (modes: GameMode[]) => void;
}

// ─── Komponente ───────────────────────────────────────────────────

export function ModeSelector({ selectedModes, onChange }: ModeSelectorProps) {
  function toggleMode(modeId: GameMode) {
    if (selectedModes.includes(modeId)) {
      // Letzten aktiven Modus nicht abwählen
      if (selectedModes.length === 1) return;
      onChange(selectedModes.filter((m) => m !== modeId));
    } else {
      onChange([...selectedModes, modeId]);
    }
  }

  function handleSelectAll() {
    onChange(MODES.map(m => m.id));
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end px-1">
        <div>
          <p className="text-[10px] font-black uppercase opacity-40 tracking-widest leading-none">Rotation</p>
          <p className="text-[10px] font-bold text-[var(--color-accent)] uppercase">
            {selectedModes.length} von {MODES.length} ausgewählt
          </p>
        </div>
        <button
          onClick={handleSelectAll}
          className="text-[10px] font-black uppercase underline decoration-[var(--color-accent)] opacity-60 hover:opacity-100"
        >
          Alle wählen
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
        {MODES.map((mode, index) => {
          const isSelected = selectedModes.includes(mode.id);

          return (
            <motion.button
              key={mode.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleMode(mode.id)}
              whileTap={{ scale: 0.97 }}
              className={[
                'text-left p-4 rounded-2xl border-2 transition-all',
                isSelected
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 shadow-lg shadow-[var(--color-accent)]/5'
                  : 'border-white/5 bg-white/5 hover:border-white/20',
              ].join(' ')}
              aria-pressed={isSelected}
            >
              {/* Icon + Titel */}
              <div className="flex items-start gap-3">
                <span className="text-2xl leading-none mt-0.5" aria-hidden>
                  {mode.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm leading-tight uppercase tracking-tight">{mode.title}</p>
                  <p className="text-[10px] opacity-50 mt-1 leading-snug">{mode.description}</p>
                </div>
              </div>

              {/* Status Row */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex-1">
                   {isSelected && (
                     <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                        <span className="text-[10px] font-black text-[var(--color-accent)] uppercase tracking-widest">Aktiv</span>
                     </div>
                   )}
                </div>
                
                {/* Hinweis: letzter Modus kann nicht deaktiviert werden */}
                {isSelected && selectedModes.length === 1 && (
                  <p className="text-[9px] opacity-30 uppercase font-black">Erforderlich</p>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
