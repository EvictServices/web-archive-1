'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TbShieldCheck } from 'react-icons/tb'
import { DISCORD_INVITE_URL, SUPPORT_SERVER_URL } from '@/lib/constants'
import { formatNumber } from '@/lib/status'
import { useUsers } from '@/hooks/useUsers'

export default function HeroSection() {
  const [stats, setStats] = useState<{ users: number; guilds: number } | null>(null)

  useEffect(() => {
    fetch('/api/health', { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error('unreachable')
        return r.json()
      })
      .then((d) => {
        if (typeof d.users === 'number' && typeof d.guilds === 'number') {
          setStats({ users: d.users, guilds: d.guilds })
        }
      })
      .catch(() => setStats({ users: 5952554, guilds: 27613 }))
  }, [])

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_#0d1a1d_0%,_#0a0b0d_100%)]">
      <div className="relative mx-auto flex min-h-dvh max-w-6xl items-center px-6 pt-28 pb-16 lg:pt-20">
        <div className="grid w-full items-center gap-x-16 gap-y-10 lg:grid-cols-[1.05fr_1fr]">
          <div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.55 }}
              className="font-display mt-6 text-5xl font-semibold tracking-tight text-balance text-white sm:text-6xl"
            >
              Your server,
              <br />
              <span className="text-accent">handled.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.55 }}
              className="mt-6 max-w-md text-base leading-relaxed text-white/55"
            >
              Evict protects against raids, welcomes new members, manages roles and voice
              channels, and rewards the people who show up every day — so you can spend your
              time in the community, not on it.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24, duration: 0.55 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black transition-all hover:brightness-110 hover:shadow-[0_0_32px_rgba(95,130,141,0.35)]"
              >
                Add to Discord
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </a>
              <a
                href={SUPPORT_SERVER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-white/[0.1] px-6 py-3 text-sm font-medium text-white/60 transition-colors hover:border-white/[0.2] hover:text-white/90"
              >
                Join the support server
              </a>
            </motion.div>

            {stats && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-10 text-sm text-white/40"
              >
                Trusted by{' '}
                <span className="font-semibold text-white/80">{formatNumber(stats.users)} members</span>{' '}
                across{' '}
                <span className="font-semibold text-white/80">{formatNumber(stats.guilds)} servers</span>
              </motion.p>
            )}
          </div>

          <div className="hidden lg:block">
            <HeroChatCard />
          </div>
        </div>
      </div>
    </section>
  )
}

function HeroChatCard() {
  const users = useUsers(['604463848526708757'])
  const user = users['604463848526708757']

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-3xl border border-white/[0.08] bg-card p-4 shadow-[0_24px_80px_rgba(0,0,0,0.5)] sm:p-6"
      >
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-4">
          <span className="text-lg text-white/25">#</span>
          <span className="text-sm font-semibold text-white/80">general</span>
          <span className="ml-auto text-xs text-white/30">1,204 online</span>
        </div>

        <div className="mt-5 space-y-5">
          <div className="flex items-start gap-3">
            {user?.avatar ? (
              <img src={user.avatar} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
            ) : (
              <div className="h-9 w-9 shrink-0 rounded-full bg-white/[0.08]" />
            )}
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-white/85">{user?.display_name ?? 'vael'}</span>
                <span className="text-xs text-white/30">today at 12:04</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-white/60">
                we got raided again last night… anyone know how to stop this?
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <img src="/evict.png" alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-accent">evict</span>
                <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                  BOT
                </span>
                <span className="text-xs text-white/30">today at 12:04</span>
              </div>
              <div className="mt-2 rounded-xl border-l-[3px] border-accent bg-white/[0.03] p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-white/85">
                  <TbShieldCheck className="h-4 w-4 text-accent" />
                  Anti-nuke is on
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  Watching for mass kicks, bans, channel deletes, and role changes.
                  Anything suspicious gets blocked before it lands.
                </p>
                <p className="mt-3 text-xs font-medium text-accent/80">
                  Your server is protected — nothing else to set up.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16, x: 8 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ delay: 0.7, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -top-8 -right-4 hidden items-center gap-3 rounded-2xl border border-white/[0.08] bg-overlay px-4 py-3 shadow-[0_16px_48px_rgba(0,0,0,0.5)] lg:flex"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-400/15">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-red-400">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </span>
        <div>
          <p className="text-sm font-semibold text-white/85">Raid blocked</p>
          <p className="text-xs text-white/40">5 accounts stopped in 0.3s</p>
        </div>
      </motion.div>
    </div>
  )
}
