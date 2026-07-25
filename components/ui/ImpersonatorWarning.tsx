'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { TbAlertTriangle, TbShieldCheck, TbX } from 'react-icons/tb'
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
  const startYRef = useRef(0)

  const dismiss = useCallback(() => {
    sessionStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }, [])

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return
    const timer = window.setTimeout(() => setVisible(true), 600)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!visible) return

    startYRef.current = window.scrollY

    const onScroll = () => {
      if (Math.abs(window.scrollY - startYRef.current) > 24) {
        dismiss()
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [visible, dismiss])

  if (!visible) return null

  return (
    <div
      role="status"
      className="impersonator-warning fixed inset-x-4 bottom-4 z-40 mx-auto max-w-md sm:inset-x-6 sm:bottom-6"
    >
      <div className="rounded-3xl border border-white/[0.08] bg-overlay/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/12">
            <TbAlertTriangle className="h-4.5 w-4.5 text-amber-300" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">Watch out for a fake evict</p>
            <p className="text-xs text-white/45">A copycat bot is using our name.</p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="shrink-0 rounded-lg p-1.5 text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/70"
            aria-label="Dismiss warning"
          >
            <TbX className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-3 rounded-xl border border-amber-400/15 bg-amber-400/[0.05] px-3.5 py-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-sm font-semibold text-amber-300/70">
              ?
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-amber-200/90">{FAKE_BOT_TAG}</p>
              <p className="truncate font-mono text-[11px] text-white/30">{FAKE_BOT_ID}</p>
            </div>
            <span className="shrink-0 rounded-full bg-amber-400/12 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-amber-300 uppercase">
              Fake — kick it
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5">
            <img src="/evict.png" alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-white/85">{REAL_BOT_TAG}</p>
              <p className="truncate font-mono text-[11px] text-white/30">{CLIENT_ID}</p>
            </div>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-accent/12 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-accent uppercase">
              <TbShieldCheck className="h-3 w-3" aria-hidden />
              Real
            </span>
          </div>
        </div>

        <p className="mt-4 text-xs text-white/40">
          Check the ID before trusting a bot, or verify on our{' '}
          <a
            href={SUPPORT_SERVER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent underline decoration-accent/30 underline-offset-2 transition-colors hover:text-white"
          >
            support server
          </a>
          .
        </p>
      </div>
    </div>
  )
}
