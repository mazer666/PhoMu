'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen max-w-3xl mx-auto p-6 sm:p-10 space-y-6">
      <h1 className="text-3xl font-black">Terms of Service</h1>
      <p className="text-sm opacity-80">
        Nutzungsbedingungen für Phomu (Stand: April 3, 2026).
      </p>

      <section className="space-y-2 text-sm">
        <h2 className="text-lg font-black">1. Nutzung</h2>
        <p className="opacity-85">
          Phomu ist ein Musik-Quiz. Nutzer verpflichten sich zu rechtmäßiger Nutzung und zur Einhaltung der Plattform-Richtlinien von Drittanbietern.
        </p>
      </section>

      <section className="space-y-2 text-sm">
        <h2 className="text-lg font-black">2. Drittanbieter</h2>
        <p className="opacity-85">
          Wiedergabe kann über YouTube, Spotify oder Amazon Music erfolgen. Verfügbarkeit und Rechte hängen von den jeweiligen Diensten ab.
        </p>
      </section>

      <section className="space-y-2 text-sm">
        <h2 className="text-lg font-black">3. Kein Umgehen von Werbung/Schutzmaßnahmen</h2>
        <p className="opacity-85">
          Phomu implementiert keine Werbe- oder Schutzmaßnahmen-Umgehung. Fallbacks dienen ausschließlich der legalen Verfügbarkeit.
        </p>
      </section>

      <section className="space-y-2 text-sm">
        <h2 className="text-lg font-black">4. Haftung</h2>
        <p className="opacity-85">
          Es besteht kein Anspruch auf ununterbrochene Verfügbarkeit einzelner Songs/Provider.
        </p>
      </section>

      <div className="pt-6 text-sm">
        <Link href="/" className="underline opacity-80 hover:opacity-100">Zurück zur Startseite</Link>
      </div>
    </main>
  );
}
