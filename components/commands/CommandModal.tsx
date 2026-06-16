'use client'

import { useMemo, useState } from 'react'
import { type Command } from '@/types/command'
import { fmtPermissions, formatUsage } from '@/lib/commands'

interface CommandModalProps {
  cmd: Command
  onClose: () => void
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-white/[0.04] py-3.5 last:border-0">
      <p className="text-[9px] font-medium tracking-wider text-white/25 uppercase">{label}</p>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

export default function CommandModal({ cmd, onClose }: CommandModalProps) {
  const [copied, setCopied] = useState(false)
  const perms = useMemo(() => fmtPermissions(cmd.permissions), [cmd.permissions])
  const usage = useMemo(() => formatUsage(cmd), [cmd])
  const usageCopy = useMemo(() => formatUsage(cmd, true), [cmd])

  async function copyUsage() {
    try {
      await navigator.clipboard.writeText(usageCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <div
      className="commands-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal
        aria-labelledby="command-modal-title"
        className="commands-modal-panel relative max-h-[min(90dvh,calc(100vh-2rem))] w-full max-w-md overflow-y-auto rounded-2xl border border-white/[0.07] bg-[#0a0a0a] shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
      >
        <div className="relative border-b border-white/[0.06] px-5 py-5">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-xl font-light leading-none text-white/25 transition-colors hover:text-white/70"
            aria-label="Close"
          >
            &times;
          </button>

          <div className="pr-8">
            <p id="command-modal-title" className="text-lg font-semibold tracking-tight text-white">
              {cmd.name}
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-white/60">{cmd.description}</p>
          </div>
        </div>

        <div className="px-5 py-1">
          <DetailRow label="Usage">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
              <code className="min-w-0 break-all text-[11px] text-white/55">{usage}</code>
              <button
                type="button"
                onClick={copyUsage}
                className={`shrink-0 rounded-full px-3 py-1 text-[9px] font-semibold transition-colors ${
                  copied
                    ? 'bg-green-400/10 text-green-400/70'
                    : 'bg-accent/10 text-accent/70 hover:bg-accent/15'
                }`}
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </DetailRow>

          {cmd.aliases.length > 0 && (
            <DetailRow label="Aliases">
              <div className="flex flex-wrap gap-1.5">
                {cmd.aliases.map((alias) => (
                  <span
                    key={alias}
                    className="rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-[10px] text-white/45"
                  >
                    {alias}
                  </span>
                ))}
              </div>
            </DetailRow>
          )}

          <DetailRow label="Permissions">
            {perms === 'none' ? (
              <p className="text-[11px] text-white/30">None required</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {perms.split(',').map((p) => (
                  <span key={p} className="rounded-full bg-accent/8 px-2.5 py-1 text-[10px] text-accent/60">
                    {p.trim()}
                  </span>
                ))}
              </div>
            )}
          </DetailRow>

          {cmd.example && (
            <DetailRow label="Example">
              <p className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-[11px] text-white/50">
                {cmd.example}
              </p>
            </DetailRow>
          )}
        </div>
      </div>
    </div>
  )
}
