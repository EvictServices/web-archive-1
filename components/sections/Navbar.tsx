'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DISCORD_INVITE_URL } from '@/lib/constants'

const NAV_LINKS = [
  { href: '/commands', label: 'Commands' },
  { href: '/status', label: 'Status' },
  { href: '/embeds', label: 'Embeds' },
  { href: '/updates', label: 'Updates' },
] as const

export default function Navbar() {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY

    const onScroll = () => {
      const y = window.scrollY
      const down = y > lastY && y > 60
      setHidden(down)
      setScrolled(y > 10)
      lastY = y
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div
        className={`relative mx-auto max-w-6xl transition-all duration-500 ${
          scrolled || menuOpen
            ? 'border-b border-white/[0.04] bg-black/40 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2" onClick={closeMenu}>
            <img src="/evict.png" alt="evict" className="h-6 w-6 rounded-full object-cover" />
            <span className="text-xs font-semibold tracking-tight text-white">evict</span>
          </Link>

          <div className="hidden items-center gap-1 rounded-full border border-white/[0.04] bg-white/[0.02] px-1.5 py-1 sm:flex">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-full px-3 py-1 text-[9px] font-medium tracking-wide text-white/30 transition-all hover:bg-white/[0.04] hover:text-white/60"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={DISCORD_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full bg-accent px-4 py-1.5 text-[10px] font-semibold text-black transition-all hover:scale-105 sm:inline-flex"
            >
              Invite
            </a>

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.03] text-white/60 transition-all hover:bg-white/[0.06] hover:text-white sm:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                {menuOpen ? (
                  <>
                    <path d="M6 6l12 12" />
                    <path d="M18 6L6 18" />
                  </>
                ) : (
                  <>
                    <path d="M4 7h16" />
                    <path d="M4 12h16" />
                    <path d="M4 17h16" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 top-[57px] bg-black/50 sm:hidden"
              aria-label="Close menu"
              onClick={closeMenu}
            />
            <div className="relative border-t border-white/[0.04] px-6 py-4 sm:hidden">
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMenu}
                    className="rounded-lg px-3 py-2.5 text-xs font-medium tracking-wide text-white/50 transition-all hover:bg-white/[0.04] hover:text-white/80"
                  >
                    {label}
                  </Link>
                ))}
                <a
                  href={DISCORD_INVITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="mt-2 rounded-full bg-accent px-4 py-2.5 text-center text-[11px] font-semibold text-black transition-all hover:scale-[1.02]"
                >
                  Invite
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}
