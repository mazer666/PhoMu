'use client';

import { useRouter } from 'next/navigation';
import { useGameStore } from '@/stores/game-store';
import type { AIQueueStrategy, HintReleasePolicy, OverrideGovernance } from '@/types/game-state';

export default function SettingsGovernancePage() {
  const router = useRouter();
  const { config, setConfig } = useGameStore();

  return (
    <main className="min-h-screen max-w-3xl mx-auto p-4 md:p-8 space-y-6">
      <Header title="🧠 Governance" onBack={() => router.push('/settings')} />

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5 space-y-4">
        <SelectRow
          label="Override Governance"
          value={config.overrideGovernance}
          onChange={(v) => setConfig({ overrideGovernance: v as OverrideGovernance })}
          options={[
            { value: 'host', label: 'Host' },
            { value: 'co-host', label: 'Co-Host' },
            { value: 'majority', label: 'Mehrheit' },
          ]}
        />

        <SelectRow
          label="Hint Release Policy"
          value={config.hintReleasePolicy}
          onChange={(v) => setConfig({ hintReleasePolicy: v as HintReleasePolicy })}
          options={[
            { value: 'auto-publish', label: 'Auto Publish nach Checks' },
            { value: 'manual-review', label: 'Manuelle Freigabe' },
          ]}
        />

        <SelectRow
          label="AI Blocking Verhalten"
          value={config.aiQueueStrategy}
          onChange={(v) => setConfig({ aiQueueStrategy: v as AIQueueStrategy })}
          options={[
            { value: 'queue-retry-pending', label: 'Queue + Retry + Pending' },
            { value: 'fail-fast', label: 'Fail Fast' },
          ]}
        />
      </section>
    </main>
  );
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="rounded-3xl border border-white/10 bg-white/5 p-5 flex items-center justify-between">
      <h1 className="text-2xl font-black">{title}</h1>
      <button onClick={onBack} className="px-4 py-2 rounded-xl bg-[var(--color-accent)] text-white text-sm font-black">
        Zur Übersicht
      </button>
    </header>
  );
}

function SelectRow({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest font-black opacity-60 mb-2">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
