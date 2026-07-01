'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ParticleField from '@/components/effects/ParticleField'
import TiltCard from '@/components/effects/TiltCard'
import { DISCORD_INVITE_URL, SUPPORT_SERVER_URL } from '@/lib/constants'
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
    <section className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,_#0d1a1d_0%,_#030303_100%)]">
      <ParticleField />

      <div className="relative mx-auto flex max-w-6xl min-h-screen items-center px-6">
        <div className="grid w-full items-center gap-x-12 lg:grid-cols-2">
          <div>
            <h1 className="text-[80px] font-bold tracking-tighter leading-none text-accent sm:text-[120px] md:text-[160px]">
              evict
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mt-6 max-w-sm text-sm leading-relaxed text-white/25"
            >
              The all-in-one solution for seamless server management — powerful, polished, and visually refined.
            </motion.p>

            <div className="mt-8 flex items-center gap-3">
              <a
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-semibold text-black transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(95,130,141,0.3)]"
              >
                Invite to Discord
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </a>
              <a
                href={SUPPORT_SERVER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] px-5 py-2.5 text-xs font-medium text-white/30 transition-colors hover:border-white/[0.12] hover:text-white/50"
              >
                Join Server
              </a>
            </div>

            {stats && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-12 flex items-center gap-8"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10">
                    <svg className="h-4 w-4 text-accent/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-base font-bold tracking-tight text-white">{(stats.users / 1_000_000).toFixed(1)}M+</p>
                    <p className="text-[10px] text-white/25">users served</p>
                  </div>
                </div>

                <div className="h-8 w-px bg-white/[0.06]" />

                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10">
                    <svg className="h-4 w-4 text-accent/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="3" width="20" height="14" rx="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-base font-bold tracking-tight text-white">{(stats.guilds / 1_000).toFixed(0)}K+</p>
                    <p className="text-[10px] text-white/25">servers protected</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="hidden translate-y-24 lg:flex lg:justify-end">
            <FloatingCards />
          </div>
        </div>
      </div>
    </section>
  )
}



function FloatingCards() {
  const users = useUsers(['604463848526708757'])
  const user = users['604463848526708757']

  return (
    <div className="relative h-[500px]" style={{ perspective: 1200 }}>
      {/* Main dashboard card */}
      <TiltCard className="absolute right-0 top-4" delay={0.2}>
        <div className="w-80 rounded-2xl border border-white/[0.08] bg-[#0c1214] p-5 shadow-[0_0_80px_rgba(95,130,141,0.12)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img src="/evict.png" alt="" className="h-7 w-7 rounded-full object-cover" />
              <div>
                <p className="text-xs font-semibold text-white">evict</p>
                <p className="text-[10px] text-white/40">dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-green-400/80" />
              <span className="text-[10px] font-medium text-green-400/70">online</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { label: 'Protected', value: '27.6K', trend: '+12' },
              { label: 'Actions/hr', value: '1,847', trend: '+5%' },
              { label: 'Uptime', value: '14d 6h', trend: '99.9%' },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-2.5">
                <p className="text-[9px] text-white/40">{s.label}</p>
                <p className="mt-0.5 text-sm font-bold text-white">{s.value}</p>
                <p className="text-[9px] font-medium text-accent/60">{s.trend}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-lg border border-white/[0.06] bg-white/[0.03] p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-white/40">Threats Blocked (24h)</span>
              <span className="text-xs font-bold text-white/70">847</span>
            </div>
            <div className="mt-2.5 flex items-end gap-[3px]">
              {[20, 35, 15, 45, 30, 60, 25, 50, 40, 70, 35, 55, 28, 65, 42, 38, 72, 30, 48, 56, 33, 62, 45, 52].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-accent/40 to-accent/15"
                  style={{ height: `${h * 0.4}px` }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[8px] text-white/20">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>now</span>
            </div>
          </div>
        </div>
      </TiltCard>

      {/* Alert notification */}
      <TiltCard className="absolute left-0 top-48" delay={0.5}>
        <div className="w-72 rounded-xl border border-red-400/15 bg-[#0c1214] p-4 shadow-[0_0_40px_rgba(239,68,68,0.08)]">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-400/15">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-red-400/80">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-red-400/80">Raid Detected</p>
                <span className="text-[10px] text-white/25">just now</span>
              </div>
              <p className="mt-1 text-[11px] text-white/50">5 accounts mass-joining from same IP</p>
              <div className="mt-2.5 flex items-center gap-2">
                <span className="rounded-md bg-red-400/15 px-2 py-1 text-[10px] font-medium text-red-400/70">Blocked</span>
                <span className="rounded-md bg-white/[0.05] px-2 py-1 text-[10px] text-white/40">Server locked</span>
              </div>
            </div>
          </div>
        </div>
      </TiltCard>

      {/* Discord chat mockup */}
      <TiltCard className="absolute right-8 bottom-0" delay={0.7}>
        <div className="w-[300px] rounded-xl border border-white/[0.08] bg-[#0c1214] p-4 shadow-[0_0_60px_rgba(95,130,141,0.08)]">
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="h-7 w-7 shrink-0 rounded-full object-cover" />
              ) : (
                <div className="h-7 w-7 shrink-0 rounded-full bg-white/[0.08]" />
              )}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-white/60">{user?.display_name ?? 'vael'}</span>
                  <span className="text-[9px] text-white/20">today at 12:04</span>
                </div>
                <p className="mt-0.5 text-[11px] text-white/40">anyone know how to set up antinuke?</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <img src="/evict.png" alt="" className="h-7 w-7 shrink-0 rounded-full object-cover" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-accent">evict</span>
                  <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[8px] font-medium text-accent/70">BOT</span>
                  <span className="text-[9px] text-white/20">today at 12:04</span>
                </div>
                <div className="mt-1.5 rounded-lg border-l-2 border-accent/50 bg-white/[0.03] p-2.5">
                  <p className="text-[11px] font-semibold text-white/60">Anti-Nuke Enabled</p>
                  <p className="mt-1 text-[10px] text-white/35">Monitoring: kicks, bans, channel deletes, role changes</p>
                  <p className="mt-0.5 text-[10px] text-white/35">Threshold: 3 actions / 10s</p>
                  <p className="mt-1.5 text-[10px] font-medium text-accent/60">✓ Your server is now protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TiltCard>
    </div>
  )
}
