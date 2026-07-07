'use client'

import { TbCpu, TbDatabase, TbServer } from 'react-icons/tb'
import { systemPercent } from '@/lib/status'
import type { HealthData } from '@/lib/status'

interface SystemPanelProps {
  system: HealthData['system']
}

function Meter({ label, value, icon: Icon }: { label: string; value: number; icon: typeof TbCpu }) {
  const tone =
    value < 60
      ? 'bg-gradient-to-r from-accent/50 to-accent'
      : value < 85
        ? 'bg-gradient-to-r from-amber-400/50 to-amber-400'
        : 'bg-gradient-to-r from-red-400/50 to-red-400'

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-5 transition-colors hover:border-white/[0.15] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/12">
            <Icon className="h-4.5 w-4.5 text-accent" />
          </span>
          <p className="text-sm font-medium text-white/60">{label}</p>
        </div>
        <p className="font-display text-lg font-semibold tabular-nums text-white">{value.toFixed(1)}%</p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.05]">
        <div className={`h-full rounded-full transition-all ${tone}`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  )
}

export default function SystemPanel({ system }: SystemPanelProps) {
  const cpu = systemPercent(system.cpu)
  const memory = systemPercent(system.memory)

  if (cpu == null && memory == null) return null

  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10">
          <TbServer className="h-4.5 w-4.5 text-accent" />
        </span>
        <h2 className="font-display text-lg font-semibold tracking-tight text-white">Host</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {cpu != null && <Meter label="CPU" value={cpu} icon={TbCpu} />}
        {memory != null && <Meter label="Memory" value={memory} icon={TbDatabase} />}
      </div>
    </section>
  )
}
