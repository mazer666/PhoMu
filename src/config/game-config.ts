/**
 * PHOMU - Central Game Configuration
 *
 * All game constants, defaults, and enums live here.
 * This is the single source of truth for game settings.
 * Import via: import { PHOMU_CONFIG } from '@/config/game-config';
 */

// ─── Enums & Types ───────────────────────────────────────────────

/** All available game modes */
export type GameMode =
  | 'timeline'       // Mode 1: Chronological Timeline (drag & drop)
  | 'hint-master'    // Mode 2: Hint-Master (5 levels, manual validation)
  | 'lyrics'         // Mode 3: Lyrics Labyrinth (fake lyric detection)
  | 'vibe-check'     // Mode 4: Vibe-Check (mood matching)
  | 'survivor';      // Mode 5: Survivor (one-hit-wonder detection)

/** Supported music providers */
export type MusicProvider =
  | 'youtube'         // Primary, free, everyone has access
  | 'spotify-free'    // 30-second preview via Web API
  | 'spotify-premium' // Full playback via Web Playback SDK
  | 'amazon-music'    // Falls back to YouTube
  | 'apple-music';    // Future: requires Apple Developer Account

/** Available UI themes */
export type ThemeName =
  | 'jackbox'     // Default: colorful, bold, party arcade
  | 'spotify'     // Dark, minimal, clean
  | 'youtube'     // Dark/red, modern
  | 'musicwall';  // White, tiles, album covers dominant

/** Team configuration options */
export type TeamMode =
  | 'individual'  // Every player for themselves
  | 'fixed'       // Fixed teams throughout the game
  | 'shifting';   // Teams randomized every round

/** Anti-cheat reveal method for the Pilot */
export type UnlockMethod = 'swipe' | 'blur' | 'none';

/** Supported UI languages */
export type Language = 'de' | 'en';

/** Song difficulty levels */
export type Difficulty = 'easy' | 'medium' | 'hard';

// ─── Configuration ───────────────────────────────────────────────

export const PHOMU_CONFIG = {
  // Game Defaults
  DEFAULT_WIN_SCORE: 10,
  MAX_PLAYERS: 24,
  MIN_PLAYERS: 1,
  DEFAULT_TEAM_MODE: 'individual' as TeamMode,

  // Language
  SUPPORTED_LANGUAGES: ['de', 'en'] as Language[],
  DEFAULT_LANGUAGE: 'de' as Language,

  // Music
  DEFAULT_MUSIC_PROVIDER: 'youtube' as MusicProvider,
  COUNTDOWN_SECONDS: 3,      // Countdown before music starts (autoplay workaround)
  SPOTIFY_PREVIEW_DURATION: 30, // Spotify Free preview length in seconds

  // Themes
  DEFAULT_THEME: 'jackbox' as ThemeName,
  AVAILABLE_THEMES: ['jackbox', 'spotify', 'youtube', 'musicwall'] as ThemeName[],

  // Content Packs
  SONG_PACKS: [
    'Global Hits 1950-2026',
    '80s Flashback',
    '90s Rave',
    'Guilty Pleasures',
    'Rock Anthems',
    'Summer Vibes',
    'Global Beats',
    'Movie Magic',
    'Legendary Voices',
    'Modern Charts',
    'Eurovision Icons',
    'TikTok Viral',
    'Classical Remix',
    'Boybands vs Girlgroups',
    'Indie Gems',
    'Disco Fever',
    'Power Ballads',
    'Festival Anthems',
    'Jazz & Soul',
    'Custom',
  ],

  // Game Modes
  ALL_GAME_MODES: [
    'timeline',
    'hint-master',
    'lyrics',
    'vibe-check',
    'survivor',
  ] as GameMode[],

  // Hint-Master Scoring (points per hint level)
  HINT_MASTER_POINTS: [5, 4, 3, 2, 1] as const,

  // Anti-Cheat Defaults
  DEFAULT_UNLOCK_METHOD: 'swipe' as UnlockMethod,

  // Timeline Mechanics
  FORCE_REMOVE_DUPLICATE_YEARS: true,

  // Future Features (not in MVP)
  ENABLE_CHIPS_BETTING: false,

  // Physical Cards
  CARD_WIDTH_MM: 59,
  CARD_HEIGHT_MM: 91,
  CARD_BLEED_MM: 3,
  MAX_CARDS_PER_SET: 110,
} as const;
