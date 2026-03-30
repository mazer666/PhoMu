/**
 * PackSelector
 * 
 * Multi-Select-Komponente für Song-Packs.
 * Ermöglicht die Auswahl mehrerer Musik-Kategorien gleichzeitig.
 */
'use client';

import { motion } from 'framer-motion';
import { PHOMU_CONFIG } from '@/config/game-config';
import { useGameStore } from '@/stores/game-store';

interface PackSelectorProps {
  selectedPacks: string[];
  onChange: (packs: string[]) => void;
}

export function PackSelector({ selectedPacks, onChange }: PackSelectorProps) {
  const { unlockedPackIds, isLinearProgressionEnabled } = useGameStore();

  function togglePack(packId: string, isLocked: boolean) {
    if (isLocked) return;

    if (selectedPacks.includes(packId)) {
      // Mindestens ein Pack muss ausgewählt bleiben
      if (selectedPacks.length === 1) return;
      onChange(selectedPacks.filter((p) => p !== packId));
    } else {
      onChange([...selectedPacks, packId]);
    }
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {PHOMU_CONFIG.SONG_PACKS.map((pack) => {
        const isSelected = selectedPacks.includes(pack.id);
        const isUnlocked = !isLinearProgressionEnabled || unlockedPackIds.includes(pack.id);
        const isLocked = !isUnlocked;
        
        // Bonus: Eine kleine Map für Icons/Farben pro Pack könnte man später ergänzen
        const icon = isLocked ? "🔒" : "💿";

        return (
          <motion.button
            key={pack.id}
            onClick={() => togglePack(pack.id, isLocked)}
            whileTap={!isLocked ? { scale: 0.97 } : { scale: 1 }}
            disabled={isLocked}
            className={[
              'text-left p-3 rounded-xl border-2 transition-all flex flex-col gap-2 h-full relative cursor-pointer group',
              isSelected
                ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 shadow-md scale-[1.02]'
                : isLocked 
                  ? 'border-gray-800 bg-gray-900/40 opacity-60 cursor-not-allowed grayscale'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-card)]/40 hover:bg-white/5',
            ].join(' ')}
            aria-pressed={isSelected}
            aria-disabled={isLocked}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xl" aria-hidden>{icon}</span>
              {isSelected && !isLocked && (
                <span className="w-5 h-5 rounded-full bg-[var(--color-accent)] text-white text-[10px] flex items-center justify-center font-bold">
                  ✓
                </span>
              )}
            </div>
            <div>
              <p className="font-bold text-[10px] sm:text-xs leading-tight line-clamp-2 uppercase tracking-wider mb-1">
                {pack.name}
              </p>
              {isLocked && (
                <p className="text-[9px] text-[var(--color-accent)] font-mono animate-pulse">
                  LEVEL LOCKED
                </p>
              )}
            </div>

            {/* Hover Tooltip for Locked */}
            {isLocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl p-2 text-center pointer-events-none">
                <p className="text-[10px] text-white font-bold leading-tight">
                  Earn XP to unlock {pack.name}
                </p>
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
