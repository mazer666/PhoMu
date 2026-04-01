/**
 * Spoiler-Konfiguration (Katalog für Zensur-Ausnahmen)
 * 
 * Enthält Künstlernamen, die kürzer als 4 Zeichen sind, aber 
 * dennoch zensiert werden sollen, falls sie in einem Hint auftauchen.
 */

export const SPOILER_CONFIG = {
  /** 
   * Mindestlänge für automatische Zensur (Standard: 4).
   * Alles was kürzer ist, wird ignoriert, außer es steht in der EXCEPTIONS-Liste.
   */
  MIN_LENGTH: 4,

  /**
   * Katalog bekannter Artists mit kurzen Namen (< 4 Buchstaben).
   * Diese werden IMMER zensiert, wenn sie der gesuchte Artist sind.
   */
  EXCEPTIONS: [
    'BTS',
    'TLC',
    'U2',
    'REM',
    'R.E.M.',
    'SIA',
    'DMX',
    'HIM',
    'JLS',
    'ELO',
    'YES',
    'AIR',
    'ABC',
    '112',
    'JAY', // Für Jay-Z
    'ZAY', // Für ZAYN
    'A$AP', // 4, aber Sonderzeichen-Check
    'P!nk', // 4, aber Sonderzeichen-Check
    'LFO',
    'NWA',
    'N.W.A.',
    'NAS',
    'NEO', // Falls Neo (Matrix-Soundtrack etc.)
    '10cc',
    'B.O.B',
    'E17',
    '50',  // Für 50 Cent (Häufiger Token)
  ],

  /** Wörter, die NICHT zensiert werden sollen (White-List) selbst wenn sie Teil des Titels sind */
  IGNORE_WORDS: [
    'THE',
    'AND',
    'WITH',
    'FROM',
    'FEAT',
    'THAT',
    'THIS',
    'YOUR',
  ]
};
