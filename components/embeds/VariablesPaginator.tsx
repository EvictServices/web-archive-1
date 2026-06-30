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
            className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors sm:px-3 ${
              i === tab
                ? 'bg-white/[0.06] text-white/65'
                : 'text-white/30 hover:text-white/50'
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
            className="rounded-full bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/60"
          >
            {v.name}
          </button>
        ))}
      </div>
    </div>
  )
}
