/**
 * PackSelector
 * 
 * Multi-Select-Komponente für Song-Packs.
 * Ermöglicht die Auswahl mehrerer Musik-Kategorien gleichzeitig.
 */
'use client';

import { motion } from 'framer-motion';
import { PHOMU_CONFIG } from '@/config/game-config';

interface PackSelectorProps {
  selectedPacks: string[];
  onChange: (packs: string[]) => void;
}

export function PackSelector({ selectedPacks, onChange }: PackSelectorProps) {
  function togglePack(packName: string) {
    if (selectedPacks.includes(packName)) {
      // Mindestens ein Pack muss ausgewählt bleiben
      if (selectedPacks.length === 1) return;
      onChange(selectedPacks.filter((p) => p !== packName));
    } else {
      onChange([...selectedPacks, packName]);
    }
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {PHOMU_CONFIG.SONG_PACKS.map((pack) => {
        const isSelected = selectedPacks.includes(pack);
        
        // Bonus: Eine kleine Map für Icons/Farben pro Pack könnte man später ergänzen
        // Für jetzt nutzen wir ein generisches Musik-Icon oder das erste Zeichen
        const icon = "💿";

        return (
          <motion.button
            key={pack}
            onClick={() => togglePack(pack)}
            whileTap={{ scale: 0.97 }}
            className={[
              'text-left p-3 rounded-xl border-2 transition-all flex flex-col gap-2 h-full',
              isSelected
                ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 shadow-md scale-[1.02]'
                : 'border-[var(--color-border)] bg-[var(--color-bg-card)]/40 hover:bg-white/5',
            ].join(' ')}
            aria-pressed={isSelected}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-xl" aria-hidden>{icon}</span>
              {isSelected && (
                <span className="w-5 h-5 rounded-full bg-[var(--color-accent)] text-white text-[10px] flex items-center justify-center font-bold">
                  ✓
                </span>
              )}
            </div>
            <p className="font-bold text-xs leading-tight line-clamp-2">{pack}</p>
          </motion.button>
        );
      })}
    </div>
  );
}
