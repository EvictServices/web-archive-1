'use client'

import { memo } from 'react'
import { type Command } from '@/types/command'

interface CommandCardProps {
  cmd: Command
}

function CommandCard({ cmd }: CommandCardProps) {
  return (
    <article
      data-cmd={cmd.name}
      className="command-card group flex h-full w-full min-w-0 max-w-full cursor-pointer flex-col rounded-2xl border border-white/[0.07] bg-card p-5 text-left transition-colors duration-150 hover:border-white/[0.14]"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 truncate font-mono text-sm font-semibold tracking-tight text-white">
          <span className="text-accent">;</span>
          {cmd.name}
        </p>
        <button
          type="button"
          data-copy={cmd.name}
          title="Copy command"
          className="hidden shrink-0 rounded-lg border border-white/[0.08] bg-white/[0.03] p-1.5 text-white/35 opacity-0 transition-opacity group-hover:opacity-100 hover:text-white/70 sm:block"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>
      </div>

      <p className="command-card-desc mt-2 text-[13px] text-white/50">{cmd.description}</p>

      <div className="mt-auto flex min-h-[1.5rem] flex-wrap items-center gap-1.5 pt-3">
        {cmd.aliases.slice(0, 3).map((alias) => (
          <span
            key={alias}
            className="rounded-full border border-white/[0.07] bg-white/[0.02] px-2 py-0.5 font-mono text-[11px] text-white/40"
          >
            {alias}
          </span>
        ))}
        {cmd.aliases.length > 3 && (
          <span className="text-[11px] text-white/30">+{cmd.aliases.length - 3}</span>
        )}
      </div>
    </article>
  )
}

export default memo(CommandCard, (a, b) => a.cmd.name === b.cmd.name)
