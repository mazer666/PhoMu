/**
 * fix-links.js
 *
 * Sucht für alle Songs aus broken-links-report.json automatisch
 * offizielle YouTube-Videos und aktualisiert die Pack-JSON-Dateien.
 *
 * Verwendung:
 *   node scripts/fix-links.js --api-key=DEIN_YOUTUBE_API_KEY
 *
 * YouTube Data API Key erstellen:
 *   https://console.cloud.google.com/ → APIs & Services → YouTube Data API v3
 *   (kostenlos, 10.000 Requests/Tag)
 */

const fs   = require('fs');
const path = require('path');
const https = require('https');

// ─── Config ──────────────────────────────────────────────────────────

const API_KEY     = process.argv.find(a => a.startsWith('--api-key='))?.split('=')[1]
                 || process.env.YOUTUBE_API_KEY;
const PACKS_DIR   = path.join(__dirname, '../src/data/packs');
const REPORT_FILE = path.join(__dirname, '../broken-links-report.json');
const DRY_RUN     = process.argv.includes('--dry-run');
const DELAY_MS    = 200; // Rate-limit: ~5 req/s (well under 10k/day)

if (!API_KEY) {
  console.error('Kein API Key angegeben!');
  console.error('Verwendung: node scripts/fix-links.js --api-key=AIza...');
  console.error('Oder: YOUTUBE_API_KEY=AIza... node scripts/fix-links.js');
  process.exit(1);
}

// ─── YouTube Search ───────────────────────────────────────────────────

/** Sucht auf YouTube nach einem offiziellen Music Video und gibt die Video-ID zurück. */
async function findOfficialVideo(artist, title) {
  // Prefer VEVO/official uploads; try two queries
  const queries = [
    `${artist} ${title} official music video`,
    `${artist} ${title} official video`,
  ];

  for (const q of queries) {
    const encoded = encodeURIComponent(q);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encoded}&type=video&videoCategoryId=10&maxResults=5&key=${API_KEY}`;

    const items = await httpsGet(url);
    if (!items) continue;

    const data = JSON.parse(items);
    if (!data.items || data.items.length === 0) continue;

    // Prefer VEVO, then official artist channel, then first result
    const vevo     = data.items.find(i => i.snippet.channelTitle.toLowerCase().includes('vevo'));
    const official = data.items.find(i =>
      i.snippet.channelTitle.toLowerCase().includes('official') ||
      i.snippet.title.toLowerCase().includes('official')
    );
    const best = vevo || official || data.items[0];

    if (best?.id?.videoId) {
      return { videoId: best.id.videoId, channelTitle: best.snippet.channelTitle, videoTitle: best.snippet.title };
    }
  }

  return null;
}

function httpsGet(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          console.error(`  HTTP ${res.statusCode}: ${data.slice(0, 200)}`);
          resolve(null);
        } else {
          resolve(data);
        }
      });
    }).on('error', (e) => {
      console.error(`  Request error: ${e.message}`);
      resolve(null);
    });
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ─── Main ─────────────────────────────────────────────────────────────

async function main() {
  const report = JSON.parse(fs.readFileSync(REPORT_FILE, 'utf-8'));
  console.log(`🔍 ${report.length} broken links gefunden. Suche offizielle Videos...`);
  if (DRY_RUN) console.log('   (--dry-run: Keine Änderungen werden gespeichert)\n');

  // Lade alle Packs in den Speicher
  const packs = {};
  for (const file of fs.readdirSync(PACKS_DIR).filter(f => f.endsWith('.json'))) {
    packs[file] = JSON.parse(fs.readFileSync(path.join(PACKS_DIR, file), 'utf-8'));
  }

  let fixed = 0;
  let failed = 0;

  for (let i = 0; i < report.length; i++) {
    const entry = report[i];
    const { file, id, title, artist } = entry;

    process.stdout.write(`[${i + 1}/${report.length}] ${artist} – ${title} ... `);

    const result = await findOfficialVideo(artist, title);

    if (!result) {
      console.log('❌ nicht gefunden');
      failed++;
    } else {
      console.log(`✅ ${result.videoId} (${result.channelTitle})`);

      // Update in pack data
      if (!DRY_RUN && packs[file]) {
        const song = packs[file].songs?.find(s => s.id === id);
        if (song) {
          if (!song.links) song.links = {};
          song.links.youtube = result.videoId;
          fixed++;
        }
      } else {
        fixed++;
      }
    }

    await sleep(DELAY_MS);
  }

  // Speichere geänderte Packs
  if (!DRY_RUN) {
    for (const [file, data] of Object.entries(packs)) {
      fs.writeFileSync(path.join(PACKS_DIR, file), JSON.stringify(data, null, 2) + '\n');
    }
    console.log(`\n✅ ${fixed} Songs aktualisiert, ${failed} nicht gefunden.`);
    console.log('   Dateien gespeichert.');
  } else {
    console.log(`\nDry-run: ${fixed} würden aktualisiert, ${failed} nicht gefunden.`);
  }
}

main().catch(console.error);
