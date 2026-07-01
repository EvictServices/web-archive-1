'use client'

import { useEffect, useState } from 'react'
import {
  CLIENT_ID,
  FAKE_BOT_ID,
  FAKE_BOT_TAG,
  REAL_BOT_TAG,
  SUPPORT_SERVER_URL,
} from '@/lib/constants'

const STORAGE_KEY = 'evict-impersonator-warning-dismissed'

export default function ImpersonatorWarning() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return
    const timer = window.setTimeout(() => setVisible(true), 600)
    return () => window.clearTimeout(timer)
  }, [])

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="status"
      className="impersonator-warning fixed inset-x-4 bottom-4 z-40 mx-auto max-w-lg sm:inset-x-6 sm:bottom-6"
    >
      <div className="rounded-2xl border border-amber-500/20 bg-[#0c0b09]/95 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-5">
        <div className="flex gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-300/90">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="min-w-0 flex-1">
            <p className="mt-1.5 text-[12px] leading-relaxed text-white/55 sm:text-[13px]">
              <span className="font-medium text-white/70">{FAKE_BOT_TAG}</span>
              <span className="font-mono text-[11px] text-white/35"> ({FAKE_BOT_ID})</span>
              {' '}is impersonating the real{' '}
              <span className="font-medium text-white/70">{REAL_BOT_TAG}</span>
              <span className="font-mono text-[11px] text-white/35"> ({CLIENT_ID})</span>.
              {' '}If this fake bot is in your server, we recommend kicking it.
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-white/45 sm:text-[13px]">
              Check our{' '}
              <a
                href={SUPPORT_SERVER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-200/80 underline decoration-amber-200/30 underline-offset-2 transition-colors hover:text-amber-100"
              >
                support server
              </a>
              {' '}to make sure you have the real bot.
            </p>
          </div>

          <button
            type="button"
            onClick={dismiss}
            className="shrink-0 rounded-lg p-1.5 text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/60"
            aria-label="Dismiss warning"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
