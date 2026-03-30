/**
 * Song Pack Loader
 * 
 * Aggregates all JSON song packs into a single source of truth.
 * This makes it easy to expand to 1000+ songs across multiple files.
 */

import globalHits from './global-hits.json';
import eightyFlashback from './80s-flashback.json';
import movieHits from './movie-hits.json';

import type { PhomuSong } from '@/types/song';

/** All songs from all packs combined */
export const ALL_SONGS: PhomuSong[] = [
  ...(globalHits.songs as any),
  ...(eightyFlashback.songs as any),
  ...(movieHits.songs as any),
];

/** All available pack names extracted from data */
export const AVAILABLE_PACKS: string[] = Array.from(new Set(ALL_SONGS.map(s => s.pack)));

/** Helper to get songs for specific packs */
export function getSongsForPacks(packNames: string[]): PhomuSong[] {
  return ALL_SONGS.filter(s => packNames.includes(s.pack));
}
