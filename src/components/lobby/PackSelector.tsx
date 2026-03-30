'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PHOMU_CONFIG } from '@/config/game-config';
import { useGameStore } from '@/stores/game-store';

interface PackSelectorProps {
  selectedPacks: string[];
  onChange: (packs: string[]) => void;
}

export function PackSelector({ selectedPacks, onChange }: PackSelectorProps) {
  const { unlockedPackIds, isLinearProgressionEnabled } = useGameStore();

  const allPacks = PHOMU_CONFIG.SONG_PACKS;

  const togglePack = (packId: string, isLocked: boolean) => {
    if (isLocked) return; // Can't select locked packs
    
    if (selectedPacks.includes(packId)) {
      if (selectedPacks.length === 1) return; // Keep at least one
      onChange(selectedPacks.filter((id) => id !== packId));
    } else {
      onChange([...selectedPacks, packId]);
    }
  };

  const selectAll = () => {
    const availableIds = allPacks
      .filter(p => !isLinearProgressionEnabled || unlockedPackIds.includes(p.id))
      .map(p => p.id);
    onChange(availableIds);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <div className="flex flex-col">
          <p className="text-[10px] font-black uppercase opacity-40 tracking-widest leading-none">Packs</p>
          <p className="text-[10px] font-bold text-[var(--color-accent)] uppercase">
            {isLinearProgressionEnabled ? 'Progression Aktiv' : 'Free Play Mode'}
          </p>
        </div>
        <button
          onClick={selectAll}
          className="text-[10px] font-black uppercase underline decoration-[var(--color-accent)] opacity-60 hover:opacity-100"
        >
          Alle wählbaren Packs
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[40vh] overflow-y-auto px-1 pb-4 custom-scrollbar">
        {allPacks.map((pack, index) => {
          const isUnlocked = !isLinearProgressionEnabled || unlockedPackIds.includes(pack.id);
          const isSelected = selectedPacks.includes(pack.id);
          const isLocked = !isUnlocked;
          
          return (
            <motion.button
              key={pack.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => togglePack(pack.id, isLocked)}
              className={`
                relative p-4 rounded-2xl border-2 text-left transition-all h-24 flex flex-col justify-between overflow-hidden
                ${isUnlocked 
                  ? isSelected 
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10' 
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                  : 'border-white/5 bg-black/20 opacity-40 cursor-not-allowed scale-95'
                }
              `}
            >
              <div className="z-10">
                <p className="text-[11px] font-black uppercase leading-tight line-clamp-2">
                  {pack.name}
                </p>
              </div>

              {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-20">
                   <div className="flex flex-col items-center gap-1">
                      <span className="text-xl">🔒</span>
                      <p className="text-[8px] font-black uppercase bg-black/60 px-2 py-0.5 rounded text-white">Level Locked</p>
                   </div>
                </div>
              )}

              {isUnlocked && isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-[var(--color-accent)] rounded-full flex items-center justify-center text-white text-[10px] font-black shadow-lg">
                  ✓
                </div>
              )}
              
              <div className="absolute -bottom-4 -right-4 text-4xl opacity-5 pointer-events-none italic font-black">
                {index + 1}
              </div>
            </motion.button>
          );
        })}
      </div>

      {isLinearProgressionEnabled && unlockedPackIds.length < allPacks.length && (
        <div className="flex items-center gap-2 justify-center bg-white/5 py-2 rounded-xl border border-white/5">
           <span className="animate-pulse">✨</span>
           <p className="text-[9px] opacity-50 font-black uppercase tracking-wider">
             Spiele weiter um neue Welten freizuschalten
           </p>
        </div>
      )}
    </div>
  );
}
