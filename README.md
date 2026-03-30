# Phomu - The Ultimate Hybrid Music Party Platform

Phomu (Physical-Mobile-Music) is a community-driven, open-source party game. It combines the tactile feel of physical cards with a powerful, customizable web application.

## 🎯 Game Concept
Phomu is designed for 1 to 20+ players. It can be played using physical cards (with QR/NFC codes) or purely digitally. The game is hosted on GitHub, uses Supabase for data, and is designed to be fully customizable by the user.

## 🛠 Detailed Game Rules

### General Setup
- **Players:** Individual, Fixed Teams, or Shifting Teams (randomized every round).
- **Controller:** One "Pilot" (can be a fixed player or the person to the left of the current turn-taker).
- **Anti-Cheat:** The UI includes a "Privacy Toggle" to hide solutions from the controller.
- **Winning:** Standard goal is 10 points (adjustable in settings).

### The 5 Game Modes
1. **Chronological Timeline (The Organizer):**
   - Goal: Place songs correctly on a timeline.
   - Mechanic: If a song is placed correctly, the player *can* choose to remove one existing card from the timeline.
   - **Double-Year Rule:** If a year appears twice, the player *must* remove one of those duplicates.
   - Optional: Chips-betting system (players bet on others' correctness).

2. **Hint-Master (The Detective):**
   - 5 levels of clues: History -> Trivia -> Album -> Audio Snippet (30s) -> Full Song.
   - Points: 5 (Level 1) down to 1 (Level 5).

3. **Lyrics Labyrinth (The Fake):**
   - 4 lines of lyrics appear. 3 are real, 1 is AI-generated fake.
   - **Critical:** The player must lock in their choice **before** the music starts. The music serves as the resolution/reveal.

4. **Vibe-Check (The Mood Match):**
   - The app gives a mood (e.g., "Midnight Drive"). Player scans/picks a matching song.
   - Community Factor: Compares your choice with anonymous global stats (requires Supabase sync).

5. **Survivor (The Career Check):**
   - Is the artist a "One-Hit Wonder" or a "Survivor" (2+ Top 40 hits)?
   - Modes: "Survival" (don't get it wrong) or "Point Hunting".

## 💻 Technical Standards for Vibe/Developers
- **Language:** TypeScript (Strict Mode).
- **File Limits:** Max 400 lines (target), absolute maximum 600 lines per file.
- **Comments:** "Noob-friendly" - every logic block must be explained for non-developers.
- **Configuration:** All settings are stored in `src/config/game-config.ts`.
- **Localization:** Prepared for DE/EN (i18next).

## 📂 Project Structure
Refer to the `/specifications` folder for detailed logic flows, database schemas, and the roadmap.