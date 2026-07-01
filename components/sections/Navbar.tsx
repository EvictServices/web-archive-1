'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { TbMenu2, TbX } from 'react-icons/tb'
import { DISCORD_INVITE_URL, SUPPORT_SERVER_URL } from '@/lib/constants'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'

const NAV_LINKS = [
  { href: '/commands', label: 'Commands' },
  { href: '/status', label: 'Status' },
  { href: '/embeds', label: 'Embeds' },
  { href: '/updates', label: 'Updates' },
] as const

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavLink({
  href,
  label,
  onClick,
}: {
  href: string
  label: string
  onClick?: () => void
}) {
  const pathname = usePathname()
  const active = isActivePath(pathname, href)

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`relative rounded-full px-3.5 py-1.5 text-[10px] font-medium tracking-wide transition-colors ${
        active ? 'text-white/85' : 'text-white/35 hover:text-white/65'
      }`}
    >
      {active && (
        <motion.span
          layoutId="nav-active"
          className="absolute inset-0 rounded-full border border-white/[0.08] bg-white/[0.06]"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
      <span className="relative">{label}</span>
    </Link>
  )
}

function MobileNavLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`flex items-center justify-center rounded-xl border px-3 py-3.5 text-center text-xs font-medium tracking-tight transition-colors ${
        active
          ? 'border-accent/30 bg-accent/10 text-white'
          : 'border-white/[0.06] bg-white/[0.02] text-white/45 active:bg-white/[0.05] active:text-white/70'
      }`}
    >
      {label}
    </Link>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useBodyScrollLock(menuOpen)

  useEffect(() => {
    let lastY = window.scrollY

    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      setHidden(y > lastY && y > 80)
      lastY = y
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  const barClass =
    scrolled || menuOpen
      ? 'border-white/[0.08] bg-black/70 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl'
      : 'border-white/[0.05] bg-black/30 backdrop-blur-md'

  return (
    <>
      <AnimatePresence>
        {menuOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 sm:hidden"
            aria-label="Close menu"
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>

      <header
        data-fixed-chrome
        className={`fixed top-0 left-0 right-0 z-50 px-4 pt-4 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] sm:px-6 sm:pt-5 ${
          hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="relative mx-auto max-w-6xl">
          <div className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${barClass}`}>
            <div className="sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 sm:contents">
                <Link
                  href="/"
                  className="group flex items-center gap-2.5 sm:justify-self-start sm:px-4 sm:py-2"
                  onClick={closeMenu}
                >
                  <span className="relative">
                    <img
                      src="/evict.png"
                      alt=""
                      className="h-7 w-7 rounded-full object-cover ring-1 ring-white/[0.08] transition-transform group-hover:scale-105"
                    />
                    <span className="absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full bg-accent ring-2 ring-black/80" />
                  </span>
                  <span className="text-xs font-semibold tracking-tight text-white">evict</span>
                </Link>

                <nav
                  className="hidden items-center gap-0.5 sm:flex sm:justify-self-center sm:px-2 sm:py-2"
                  aria-label="Main"
                >
                  {NAV_LINKS.map(({ href, label }) => (
                    <NavLink key={href} href={href} label={label} />
                  ))}
                </nav>

                <div className="flex items-center justify-end gap-2 sm:justify-self-end sm:px-4 sm:py-2">
                  <a
                    href={SUPPORT_SERVER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden rounded-full border border-white/[0.06] px-3.5 py-1.5 text-[10px] font-medium text-white/40 transition-all hover:border-white/[0.12] hover:text-white/65 md:inline-flex"
                  >
                    Support
                  </a>
                  <a
                    href={DISCORD_INVITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden rounded-full bg-accent px-4 py-1.5 text-[10px] font-semibold text-black transition-all hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(95,130,141,0.3)] sm:inline-flex"
                  >
                    Invite
                  </a>

                  <button
                    type="button"
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all sm:hidden ${
                      menuOpen
                        ? 'border-white/[0.12] bg-white/[0.08] text-white'
                        : 'border-white/[0.06] bg-white/[0.03] text-white/60 hover:bg-white/[0.06] hover:text-white'
                    }`}
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={menuOpen}
                  >
                    {menuOpen ? <TbX className="h-4 w-4" /> : <TbMenu2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {menuOpen && (
                <motion.div
                  key="mobile-menu"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
                  className="overflow-hidden border-t border-white/[0.06] sm:hidden"
                >
                  <nav className="grid grid-cols-2 gap-2 px-4 pt-4" aria-label="Main">
                    {NAV_LINKS.map(({ href, label }) => (
                      <MobileNavLink
                        key={href}
                        href={href}
                        label={label}
                        active={isActivePath(pathname, href)}
                        onClick={closeMenu}
                      />
                    ))}
                  </nav>

                  <div className="grid grid-cols-2 gap-2 px-4 pt-3 pb-4">
                    <a
                      href={DISCORD_INVITE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeMenu}
                      className="col-span-2 flex items-center justify-center rounded-xl bg-accent py-3 text-xs font-semibold text-black transition-all active:scale-[0.98]"
                    >
                      Invite to Discord
                    </a>
                    <a
                      href={SUPPORT_SERVER_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeMenu}
                      className="col-span-2 py-1 text-center text-[11px] font-medium text-white/35 transition-colors active:text-white/55"
                    >
                      Join support server
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
    </>
  )
}
