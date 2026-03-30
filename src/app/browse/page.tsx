'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { PhomuSong } from '@/types/song';
import { SongCard } from '@/components/browse/SongCard';
import { SongEditor } from '@/components/admin/SongEditor';
import { useGameStore } from '@/stores/game-store';
import { ALL_SONGS as DATA_SONGS } from '@/data/packs';

// ─── Daten laden & Storage ──────────────────────────────────────────────────

const STORAGE_KEY = 'phomu-admin-songs';

/** Lädt Songs aus localStorage oder Fallback auf JSON */
function loadSongs(): PhomuSong[] {
  if (typeof window === 'undefined') return DATA_SONGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DATA_SONGS;
}

/** Speichert Songs in localStorage */
function saveSongsToStorage(songs: PhomuSong[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
}

// ─── Hilfsfunktionen ─────────────────────────────────────────────────────────

function getDecadeLabel(year: number): string {
  const decade = Math.floor(year / 10) * 10;
  return `${decade}er`;
}

function getDecades(songs: PhomuSong[]): string[] {
  const decades = new Set(songs.map((s) => getDecadeLabel(s.year)));
  return Array.from(decades).sort();
}

function getGenres(songs: PhomuSong[]): string[] {
  const genres = new Set(songs.map((s) => s.genre));
  return Array.from(genres).sort();
}

// ─── Hauptkomponente ──────────────────────────────────────────────────────────

export default function BrowsePage() {
  const router = useRouter();
  const startQuickGame = useGameStore((state) => state.startQuickGame);

  const [allSongs, setAllSongs] = useState<PhomuSong[]>([]);
  const [adminMode, setAdminMode] = useState(false);
  const [editingSong, setEditingSong] = useState<PhomuSong | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [sortBy, setSortBy] = useState<'year' | 'title' | 'artist'>('year');
  
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    decade: '',
    difficulty: '',
    onlyOneHitWonders: false,
    onlyWithLyrics: false,
  });

  // Initiales Laden
  useEffect(() => {
    setAllSongs(loadSongs());
  }, []);

  const genres = useMemo(() => getGenres(allSongs), [allSongs]);
  const decades = useMemo(() => getDecades(allSongs), [allSongs]);

  const filteredSongs = useMemo(() => {
    let result = allSongs;
    const q = filters.search.toLowerCase().trim();
    
    if (q) {
      result = result.filter(s => 
        s.title.toLowerCase().includes(q) || 
        s.artist.toLowerCase().includes(q) || 
        s.genre.toLowerCase().includes(q)
      );
    }
    if (filters.genre) result = result.filter(s => s.genre === filters.genre);
    if (filters.decade) result = result.filter(s => getDecadeLabel(s.year) === filters.decade);
    if (filters.difficulty) result = result.filter(s => s.difficulty === filters.difficulty);
    if (filters.onlyOneHitWonders) result = result.filter(s => s.isOneHitWonder);
    if (filters.onlyWithLyrics) result = result.filter(s => s.lyrics !== null);

    return [...result].sort((a, b) => {
      if (sortBy === 'year') return a.year - b.year;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'artist') return a.artist.localeCompare(b.artist);
      return 0;
    });
  }, [allSongs, filters, sortBy]);

  const handleSaveSong = useCallback((updated: PhomuSong) => {
    const next = allSongs.map(s => s.id === updated.id ? updated : s);
    if (!allSongs.find(s => s.id === updated.id)) next.push(updated);
    
    setAllSongs(next);
    saveSongsToStorage(next);
    setEditingSong(null);
  }, [allSongs]);

  const handlePlaySong = useCallback((song: PhomuSong) => {
    startQuickGame(song);
    router.push('/game');
  }, [startQuickGame, router]);

  const stats = useMemo(() => ({
    total: allSongs.length,
    withLyrics: allSongs.filter(s => s.lyrics !== null).length,
  }), [allSongs]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              🎵 Phomu-Browser
              {adminMode && <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded uppercase tracking-widest">Admin Mode</span>}
            </h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">
              {stats.total} Songs · {stats.withLyrics} mit Lyrics
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setAdminMode(!adminMode)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${adminMode ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
            >
              {adminMode ? '🔒 ADMIN AN' : '🔓 ADMIN AUS'}
            </button>
            <button 
              onClick={() => router.push('/lobby')}
              className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-black hover:bg-black transition-all"
            >
              ZURÜCK ZUR LOBBY
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 mt-6">
        {/* Filter Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap gap-3">
            <input
              type="search"
              placeholder="Suche nach Titel, Artist..."
              value={filters.search}
              onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
              className="flex-1 min-w-[200px] bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
            <select 
              value={filters.genre} 
              onChange={e => setFilters(p => ({ ...p, genre: e.target.value }))}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none"
            >
              <option value="">Alle Genres</option>
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <select 
              value={filters.decade} 
              onChange={e => setFilters(p => ({ ...p, decade: e.target.value }))}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none"
            >
              <option value="">Alle Jahrzehnte</option>
              {decades.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-50">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase cursor-pointer">
              <input type="checkbox" checked={filters.onlyOneHitWonders} onChange={e => setFilters(p => ({ ...p, onlyOneHitWonders: e.target.checked }))} className="rounded-md w-4 h-4 accent-blue-600" />
              One-Hit-Wonders
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase cursor-pointer">
              <input type="checkbox" checked={filters.onlyWithLyrics} onChange={e => setFilters(p => ({ ...p, onlyWithLyrics: e.target.checked }))} className="rounded-md w-4 h-4 accent-blue-600" />
              Mit Lyrics
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase cursor-pointer">
              <input type="checkbox" checked={showHints} onChange={e => setShowHints(e.target.checked)} className="rounded-md w-4 h-4 accent-blue-600" />
              Hints anzeigen
            </label>
            <div className="ml-auto text-xs font-bold text-gray-400">
              {filteredSongs.length} Treffer
            </div>
          </div>
        </div>

        {/* Song Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
          {filteredSongs.map((song) => (
            <SongCard 
              key={song.id} 
              song={song} 
              showHints={showHints}
              isAdmin={adminMode}
              onEdit={setEditingSong}
              onPlay={handlePlaySong}
            />
          ))}
          {adminMode && (
            <button 
              onClick={() => setEditingSong({ 
                id: `new-${Date.now()}`, title: '', artist: '', year: 2024, country: 'DE', genre: 'Pop', 
                difficulty: 'medium', mood: [], pack: 'Custom', hints: ['', '', '', '', ''], lyrics: null, 
                isOneHitWonder: false, links: { youtube: '' } 
              })}
              className="border-2 border-dashed border-gray-300 rounded-xl h-full min-h-[200px] flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <span className="text-4xl mb-2">+</span>
              <span className="text-xs font-black uppercase">Song hinzufügen</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor Modal */}
      {editingSong && (
        <SongEditor 
          song={editingSong} 
          onSave={handleSaveSong} 
          onCancel={() => setEditingSong(null)} 
        />
      )}
    </div>
  );
}
