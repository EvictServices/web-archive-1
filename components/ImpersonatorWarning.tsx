'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { TbAlertTriangle, TbX } from 'react-icons/tb'
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
      <div className="rounded-2xl border border-white/[0.06] bg-[#0a0f11]/95 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-500/15 bg-amber-500/[0.06] text-amber-300/80">
            <TbAlertTriangle className="h-4 w-4" aria-hidden />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-white/85">Impersonator warning</p>
              <button
                type="button"
                onClick={dismiss}
                className="-mt-0.5 shrink-0 rounded-lg p-1 text-white/25 transition-colors hover:bg-white/[0.06] hover:text-white/55"
                aria-label="Dismiss warning"
              >
                <TbX className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <p className="mt-1 text-xs leading-relaxed text-white/45">
              A fake bot is copying our name. Kick it if it&apos;s in your server.
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-amber-500/15 bg-amber-500/[0.04] px-3 py-2">
                <p className="text-[9px] font-medium tracking-[0.12em] text-amber-300/50 uppercase">Fake</p>
                <p className="mt-1 text-xs font-semibold text-amber-200/85">{FAKE_BOT_TAG}</p>
                <p className="mt-0.5 truncate font-mono text-[10px] text-white/25">{FAKE_BOT_ID}</p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                <p className="text-[9px] font-medium tracking-[0.12em] text-white/30 uppercase">Real</p>
                <p className="mt-1 text-xs font-semibold text-white/75">{REAL_BOT_TAG}</p>
                <p className="mt-0.5 truncate font-mono text-[10px] text-white/25">{CLIENT_ID}</p>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-white/35">
              Verify on our{' '}
              <a
                href={SUPPORT_SERVER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-white/55 underline decoration-white/15 underline-offset-2 transition-colors hover:text-white/75"
              >
                support server
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
