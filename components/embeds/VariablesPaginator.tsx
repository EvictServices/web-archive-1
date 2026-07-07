'use client'

import { useState } from 'react'
import { VARIABLE_CATEGORIES } from '@/components/embeds/lib/constants'

export default function VariablesPaginator({ onInsert }: { onInsert?: (v: string) => void }) {
  const [tab, setTab] = useState(0)
  const category = VARIABLE_CATEGORIES[tab]

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {VARIABLE_CATEGORIES.map((cat, i) => (
          <button
            key={cat.category}
            type="button"
            onClick={() => setTab(i)}
            className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${
              i === tab
                ? 'bg-accent/15 text-accent'
                : 'text-white/40 hover:text-white/65'
            }`}
          >
            {cat.category}
          </button>
        ))}
      </div>

      <div className="flex min-h-[40px] flex-wrap gap-1.5">
        {category?.vars.map((v) => (
          <button
            key={v.name}
            type="button"
            onClick={() => onInsert?.(v.name)}
            title={v.desc}
            className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-white/50 transition-colors hover:border-accent/30 hover:text-accent"
          >
            {v.name}
          </button>
        ))}
      </div>
    </div>
  )
}
