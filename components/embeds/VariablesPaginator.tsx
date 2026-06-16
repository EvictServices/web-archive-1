'use client'

import { useState } from 'react'
import { VARIABLE_CATEGORIES } from '@/components/embeds/lib/constants'

export default function VariablesPaginator({ onInsert }: { onInsert?: (v: string) => void }) {
  const [tab, setTab] = useState(0)
  const visible = VARIABLE_CATEGORIES[tab]?.vars || []

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-1">
        {VARIABLE_CATEGORIES.map((cat, i) => (
          <button
            key={cat.category}
            onClick={() => setTab(i)}
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition-all ${
              i === tab
                ? 'border border-accent/20 bg-accent/10 text-accent/70'
                : 'border border-transparent text-white/25 hover:text-white/40'
            }`}
          >
            {cat.category}
          </button>
        ))}
      </div>

      <div className="flex min-h-[48px] flex-wrap gap-1.5">
        {visible.map((v) => (
          <button
            key={v.name}
            onClick={() => onInsert?.(v.name)}
            className="rounded-md bg-white/[0.03] px-2 py-1 text-[10px] font-mono text-white/40 transition-all hover:bg-accent/10 hover:text-accent/60"
            title={v.desc}
          >
            {v.name}
          </button>
        ))}
      </div>
    </div>
  )
}
