const fs = require('fs');
const path = require('path');

// Wir nutzen eine vereinfachte Version der Censor-Logik für das Script (da wir CommonJS brauchen)
const SPOILER_MIN_LENGTH = 4;
const EXCEPTIONS = [
  'BTS', 'TLC', 'U2', 'REM', 'SIA', 'DMX', 'HIM', 'JLS', 'ELO', 'YES', 'AIR', 'ABC', '112', 'JAY', 'NWA', 'NAS'
];
const IGNORE_WORDS = ['THE', 'AND', 'WITH', 'FROM', 'FEAT', 'THAT', 'THIS', 'YOUR'];

function checkSpoiler(hint, artist, title) {
  if (!hint) return null;
  const tokens = new Set();
  
  [artist, title].forEach(text => {
    const words = text.split(/[\s\-&,/]+/);
    words.forEach(word => {
      const clean = word.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      if (IGNORE_WORDS.includes(clean)) return;
      if (clean.length >= SPOILER_MIN_LENGTH || EXCEPTIONS.includes(clean)) {
        tokens.add(clean);
      }
    });
  });

  const found = [];
  const upperHint = hint.toUpperCase();
  for (const token of tokens) {
    if (upperHint.includes(token)) {
      found.push(token);
    }
  }
  return found.length > 0 ? found : null;
}

const packsDir = path.join(__dirname, '../src/data/packs');
const files = fs.readdirSync(packsDir).filter(f => f.endsWith('.json'));

console.log(`🔍 Phomu Spoiler-Audit gestartet...\n`);
let totalSpoilers = 0;
const report = {};

for (const file of files) {
  const packData = JSON.parse(fs.readFileSync(path.join(packsDir, file), 'utf-8'));
  const packSpoilers = [];

  for (const song of packData.songs) {
    song.hints.forEach((hint, i) => {
      const spoilers = checkSpoiler(hint, song.artist, song.title);
      if (spoilers) {
        packSpoilers.push({
          id: song.id,
          artist: song.artist,
          title: song.title,
          hintIndex: i + 1,
          hint: hint,
          spoilers: spoilers
        });
        totalSpoilers++;
      }
    });
  }

  if (packSpoilers.length > 0) {
    report[file] = packSpoilers;
    console.log(`📦 ${file}: ${packSpoilers.length} Spoiler gefunden!`);
  }
}

fs.writeFileSync('spoiler-report.json', JSON.stringify(report, null, 2));

console.log(`\n✅ Audit abgeschlossen.`);
console.log(`Gesamtanzahl Spoiler: ${totalSpoilers}`);
console.log(`Detaillierter Report in spoiler-report.json gespeichert.`);
