/**
 * MusicPlayer
 *
 * YouTube-Embed für die RevealPhase.
 * Extrahiert die Video-ID aus dem links.youtube-Feld (ID, Voll-URL oder youtu.be).
 * Startet stumm geschaltet (Autoplay-Policy), Ton-Button zum Einschalten.
 */
'use client';

import { useState } from 'react';

// ─── YouTube-ID-Extraktion ────────────────────────────────────────

/**
 * Gibt eine bereinigte YouTube-Video-ID zurück oder null.
 * Unterstützt: rohe ID (11 Zeichen), youtube.com/watch?v=…, youtu.be/…
 */
function extractYouTubeId(raw: string): string | null {
  if (!raw || raw === 'TODO:verify' || raw.startsWith('TODO')) return null;

  // Bereits eine reine Video-ID (11 Zeichen, keine Sonderzeichen)
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

  try {
    const url = new URL(raw.startsWith('http') ? raw : `https://${raw}`);

    // youtube.com/watch?v=ID
    if (url.hostname.includes('youtube.com')) {
      return url.searchParams.get('v');
    }
    // youtu.be/ID
    if (url.hostname === 'youtu.be') {
      return url.pathname.slice(1).split('/')[0] ?? null;
    }
  } catch {
    // keine gültige URL
  }

  return null;
}

// ─── Props ────────────────────────────────────────────────────────

interface MusicPlayerProps {
  /** Wert aus song.links.youtube */
  youtubeLink: string;
  /** Startzeitpunkt in Sekunden (optional, aus song.previewTimestamp) */
  startSeconds?: number;
}

// ─── Komponente ───────────────────────────────────────────────────

export function MusicPlayer({ youtubeLink, startSeconds = 0 }: MusicPlayerProps) {
  const [muted, setMuted] = useState(true);
  const videoId = extractYouTubeId(youtubeLink);

  // Kein gültiges Video vorhanden
  if (!videoId) {
    return (
      <div
        className="flex items-center justify-center h-20 rounded-xl text-sm opacity-50 border"
        style={{ borderColor: 'var(--color-border)' }}
      >
        🎵 Kein YouTube-Link verfügbar
      </div>
    );
  }

  const embedUrl =
    `https://www.youtube.com/embed/${videoId}` +
    `?autoplay=1&mute=${muted ? 1 : 0}&start=${startSeconds}&rel=0&modestbranding=1`;

  return (
    <div className="w-full rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
      {/* Video-Frame */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 */ }}>
        <iframe
          key={`${videoId}-${muted}`} /* Key-Wechsel erzwingt Neu-Laden beim Mute-Toggle */
          src={embedUrl}
          title="YouTube-Player"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Ton-Steuerung */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ backgroundColor: 'var(--color-bg-card)' }}
      >
        <span className="text-xs opacity-50">YouTube</span>
        <button
          onClick={() => setMuted((m) => !m)}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg
                     transition-colors hover:opacity-80"
          style={{
            backgroundColor: muted ? 'var(--color-border)' : 'var(--color-success)',
          }}
        >
          {muted ? '🔇 Ton ein' : '🔊 Ton aus'}
        </button>
      </div>
    </div>
  );
}
