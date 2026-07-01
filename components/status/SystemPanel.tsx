'use client'

import { TbCpu, TbDatabase, TbServer } from 'react-icons/tb'
import { systemPercent } from '@/lib/status'
import type { HealthData } from '@/lib/status'

interface SystemPanelProps {
  system: HealthData['system']
}

function Meter({ label, value, icon: Icon }: { label: string; value: number; icon: typeof TbCpu }) {
  const tone = value < 60 ? 'bg-emerald-400/70' : value < 85 ? 'bg-amber-400/70' : 'bg-red-400/70'

  return (
    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-white/35">
          <Icon className="h-3.5 w-3.5" />
          <p className="text-[9px] font-medium tracking-[0.12em] uppercase">{label}</p>
        </div>
        <p className="text-sm font-bold tabular-nums text-white/70">{value.toFixed(1)}%</p>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
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
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03]">
          <TbServer className="h-4 w-4 text-white/35" />
        </div>
        <h2 className="text-sm font-semibold text-white">Host</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {cpu != null && <Meter label="CPU" value={cpu} icon={TbCpu} />}
        {memory != null && <Meter label="Memory" value={memory} icon={TbDatabase} />}
      </div>
    </section>
  )
}
