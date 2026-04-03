'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen max-w-3xl mx-auto p-6 sm:p-10 space-y-6">
      <h1 className="text-3xl font-black">Privacy Notice</h1>
      <p className="text-sm opacity-80">
        Diese Datenschutzhinweise beschreiben, welche Daten in Phomu verarbeitet werden (Stand: April 3, 2026).
      </p>

      <section className="space-y-2 text-sm">
        <h2 className="text-lg font-black">1. Verarbeitete Daten</h2>
        <ul className="list-disc pl-5 space-y-1 opacity-85">
          <li>Spielstände und Einstellungen (lokal im Browser via localStorage).</li>
          <li>Technische Metadaten für Fehlermeldungen (z. B. Provider, Region/Locale, Zeitzone, Song-ID).</li>
          <li>Keine Freitextfelder im „Report Missing“-Flow, um unnötige personenbezogene Daten zu vermeiden.</li>
        </ul>
      </section>

      <section className="space-y-2 text-sm">
        <h2 className="text-lg font-black">2. Zweck</h2>
        <p className="opacity-85">
          Sicherstellung der Musikwiedergabe, Qualitätsverbesserung der Links sowie Vorbereitung für künftige OAuth2-Integrationen.
        </p>
      </section>

      <section className="space-y-2 text-sm">
        <h2 className="text-lg font-black">3. Speicherfristen</h2>
        <p className="opacity-85">
          Report-Limits und Device-ID werden lokal gespeichert; Reports selbst werden nur beim aktiven Auslösen durch den Nutzer erstellt.
        </p>
      </section>

      <section className="space-y-2 text-sm">
        <h2 className="text-lg font-black">4. Rechte</h2>
        <p className="opacity-85">
          Du kannst lokale Daten jederzeit durch Löschen der Browserdaten entfernen.
        </p>
      </section>

      <div className="pt-6 text-sm">
        <Link href="/" className="underline opacity-80 hover:opacity-100">Zurück zur Startseite</Link>
      </div>
    </main>
  );
}
