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
      className="command-card group flex h-[7.25rem] w-full min-w-0 max-w-full cursor-pointer rounded-2xl border border-white/[0.04] bg-white/[0.02] p-4 text-left transition-colors duration-150 hover:border-accent/15 hover:bg-white/[0.03]"
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <p className="truncate text-[13px] font-semibold leading-5 tracking-tight text-white">
            {cmd.name}
          </p>
          <p className="command-card-desc mt-1.5 text-[11px] text-white/60">{cmd.description}</p>
          <p className="mt-auto truncate pt-1.5 text-[9px] leading-[13px] text-white/20">
            {cmd.aliases.length > 0 ? (
              <>
                <span className="text-white/30">{cmd.aliases[0]}</span>
                {' '}+{cmd.aliases.length}
              </>
            ) : (
              <span aria-hidden>&nbsp;</span>
            )}
          </p>
        </div>

        <button
          type="button"
          data-copy={cmd.name}
          title="Copy command"
          className="hidden shrink-0 rounded-lg border border-white/[0.06] bg-white/[0.02] p-1.5 text-white/25 opacity-0 transition-opacity group-hover:opacity-100 hover:text-white/50 sm:block"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </button>
      </div>
    </article>
  )
}

export default memo(CommandCard, (a, b) => a.cmd.name === b.cmd.name)
