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
  const [useStandardFallback, setUseStandardFallback] = useState(false);
  const videoId = extractYouTubeId(youtubeLink);

  // Kein gültiges Video vorhanden
  if (!videoId) {
    return (
      <div
        className="flex items-center justify-center h-20 rounded-xl text-sm opacity-50 border"
        style={{ borderColor: 'var(--color-border)' }}
      >
        🎵 Kein Musik-Link verfügbar
      </div>
    );
  }

  // YouTube Music Embed URL vs Standard YouTube
  const domain = useStandardFallback ? 'www.youtube.com' : 'music.youtube.com';
  const embedUrl =
    `https://${domain}/embed/${videoId}` +
    `?autoplay=1&mute=${muted ? 1 : 0}&start=${startSeconds}&rel=0&modestbranding=1`;

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl transition-all" style={{ border: '1px solid var(--color-border)' }}>
      {/* Video-Frame */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 */ }}>
        <iframe
          key={`${videoId}-${muted}-${useStandardFallback}`}
          src={embedUrl}
          title="Phomu Music Player"
          allow="autoplay; encrypted-media"
          onError={() => setUseStandardFallback(true)}
          className="absolute inset-0 w-full h-full"
        />
        {/* Anti-Spoiler Overlay (Optional - usually handles in parent, but here we cover for safety) */}
        {!useStandardFallback && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-none flex items-center justify-center">
             <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-[var(--color-accent)] animate-spin" />
          </div>
        )}
      </div>

      {/* Ton-Steuerung */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: 'var(--color-bg-card)' }}
      >
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Source</span>
          <span className="text-xs font-bold">{useStandardFallback ? 'YouTube Video' : 'YouTube Music'}</span>
        </div>
        <div className="flex gap-2">
          {useStandardFallback && !domain.includes('music') && (
            <button 
              onClick={() => setUseStandardFallback(false)}
              className="text-[9px] font-black uppercase opacity-40 hover:opacity-100"
            >
              Retry Music Mode
            </button>
          )}
          <button
            onClick={() => setMuted((m) => !m)}
            className={`
              flex items-center gap-2 text-xs font-black px-5 py-2 rounded-xl
              transition-all shadow-lg active:scale-95
              ${muted ? 'bg-white/10 text-white opacity-60' : 'bg-green-500 text-white shadow-green-500/20'}
            `}
          >
            {muted ? '🔇 TON EIN' : '🔊 TON AUS'}
          </button>
        </div>
      </div>
    </div>
  );
}
