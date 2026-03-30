'use client';

/**
 * Einstellungen / Settings
 * 
 * Hier können Spieler:
 * - Ihren Namen, Avatar und Farbe ändern
 * - Das App-Theme wechseln
 * - Die Sprache anpassen (zukünftig)
 */

import { useRouter } from 'next/navigation';
import { useGameStore } from '@/stores/game-store';
import { PHOMU_CONFIG } from '@/config/game-config';
import type { ThemeName } from '@/config/game-config';
import { useEffect, useState } from 'react';

const EMOJI_AVATARS = ['🎵', '🎸', '🥁', '🎹', '🎺', '🎻', '🎤', '🎧', '🦁', '🐯', '🦊', '🦄', '👾', '🚀'];
const PLAYER_COLORS = ['#FF6B35', '#FFD166', '#06D6A0', '#118AB2', '#EF476F', '#9B5DE5', '#00BBF9'];

export default function SettingsPage() {
  const router = useRouter();
  const { players, setConfig } = useGameStore();
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('jackbox');

  // Theme aus HTML-Tag lesen
  useEffect(() => {
    const theme = document.documentElement.getAttribute('data-theme') as ThemeName;
    if (theme) setCurrentTheme(theme);
  }, []);

  const handleThemeChange = (theme: ThemeName) => {
    document.documentElement.setAttribute('data-theme', theme);
    setCurrentTheme(theme);
    localStorage.setItem('phomu-theme', theme);
  };

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-3xl mx-auto space-y-12 pb-24">
      <header className="flex items-center justify-between">
        <h1 className="text-4xl font-black">⚙️ Einstellungen</h1>
        <button 
          onClick={() => router.back()}
          className="px-6 py-2 bg-gray-100 dark:bg-white/10 rounded-xl font-bold hover:scale-105 transition-all"
        >
          Fertig
        </button>
      </header>

      {/* Spieler-Individualisierung */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold border-b border-gray-100 dark:border-white/5 pb-2">👥 Spieler Profile</h2>
        {players.length === 0 ? (
          <p className="text-sm opacity-40 italic">Keine Spieler in der Lobby vorhanden.</p>
        ) : (
          <div className="grid gap-4">
            {players.map((player) => (
              <div key={player.id} className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/10 flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner"
                  style={{ backgroundColor: player.color }}
                >
                  {player.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-bold">{player.name}</p>
                  <p className="text-xs opacity-40 uppercase font-black">Spieler ID: {player.id.slice(0, 8)}</p>
                </div>
                <div className="text-xs font-bold opacity-30 italic">(Bearbeiten bald verfügbar)</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* App-Einstellungen */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold border-b border-gray-100 dark:border-white/5 pb-2">🎨 Erscheinungsbild</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PHOMU_CONFIG.AVAILABLE_THEMES.map((theme) => (
            <button
              key={theme}
              onClick={() => handleThemeChange(theme)}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${currentTheme === theme ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 scale-105 shadow-lg' : 'border-black/5 dark:border-white/5 opacity-60'}`}
            >
              <div className={`w-8 h-8 rounded-full mb-1 ${theme === 'jackbox' ? 'bg-orange-500' : theme === 'spotify' ? 'bg-green-500' : theme === 'youtube' ? 'bg-red-600' : 'bg-gray-200'}`} />
              <span className="text-xs font-black uppercase">{theme}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Info */}
      <section className="pt-12 opacity-20 text-center">
        <p className="text-xs font-bold">PHOMU PLATFORM v1.2.0</p>
        <p className="text-[10px] uppercase tracking-tighter mt-1">Made with ❤️ for Music Fans</p>
      </section>
    </main>
  );
}
