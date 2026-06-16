'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import ParticleField from '@/components/effects/ParticleField'
import TiltCard from '@/components/effects/TiltCard'
import { DISCORD_INVITE_URL, SUPPORT_SERVER_URL } from '@/lib/constants'

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
        <div className="grid w-full items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-[80px] font-bold tracking-tighter leading-none text-accent sm:text-[120px] md:text-[160px]">
              evict
            </h1>

            <TypewriterText
              text="The all-in-one solution for seamless server management — powerful, polished, and visually refined."
              className="mt-6 max-w-sm text-sm leading-relaxed text-white/25"
            />

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
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-12 inline-flex items-center gap-0 rounded-2xl border border-white/[0.04] bg-white/[0.02] px-6 py-4 backdrop-blur-sm"
              >
                <div className="relative px-4">
                  <div className="text-2xl font-bold text-white">
                    <AnimatedNumber value={stats.users / 1_000_000} suffix="M" />
                  </div>
                  <p className="mt-1 text-[9px] font-medium tracking-wider text-white/20 uppercase">Members</p>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.2, duration: 0.8, ease: 'easeOut' }}
                    className="absolute -bottom-1 left-4 right-4 h-px origin-left bg-accent/30"
                  />
                </div>

                <div className="h-8 w-px bg-white/[0.04]" />

                <div className="relative px-4">
                  <div className="text-2xl font-bold text-white">
                    <AnimatedNumber value={stats.guilds / 1_000} suffix="K" />
                  </div>
                  <p className="mt-1 text-[9px] font-medium tracking-wider text-white/20 uppercase">Servers</p>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.4, duration: 0.8, ease: 'easeOut' }}
                    className="absolute -bottom-1 left-4 right-4 h-px origin-left bg-accent/30"
                  />
                </div>

              </motion.div>
            )}
          </div>

          <div className="hidden lg:block">
            <FloatingCards />
          </div>
        </div>
      </div>
    </section>
  )
}

function TypewriterText({ text, className }: { text: string; className: string }) {
  const [display, setDisplay] = useState('')
  const idx = useRef(0)

  useEffect(() => {
    idx.current = 0
    setDisplay('')
    const t = setInterval(() => {
      idx.current++
      setDisplay(text.slice(0, idx.current))
      if (idx.current >= text.length) clearInterval(t)
    }, 12)
    return () => clearInterval(t)
  }, [text])

  return <p className={className}>{display}</p>
}

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [num, setNum] = useState(0)

  useEffect(() => {
    const duration = 1500
    const start = performance.now()
    const from = 0

    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setNum(from + (value - from) * eased)
      if (p < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [value])

  const formatted = value % 1 === 0 ? Math.floor(num).toString() : num.toFixed(2)

  return <p className="text-lg font-semibold text-white">{formatted}{suffix}</p>
}


function FloatingCards() {
  return (
    <div className="relative h-[440px]" style={{ perspective: 1200 }}>
      <TiltCard className="absolute right-4 top-0" delay={0.2} initialX={40} initialY={-30}>
        <div className="w-64 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 shadow-[0_0_60px_rgba(95,130,141,0.15),0_0_120px_rgba(95,130,141,0.06)] backdrop-blur-md">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-400/60" />
            <div className="h-2 w-2 rounded-full bg-yellow-400/60" />
            <div className="h-2 w-2 rounded-full bg-red-400/60" />
            <span className="ml-2 text-[9px] font-medium text-white/20">bash</span>
          </div>
          <div className="font-mono text-[10px] leading-relaxed">
            <p className="text-white/30">$ <span className="text-accent">evict</span> setup --server</p>
            <p className="mt-1 text-white/15">detected 12 channels...</p>
            <p className="text-white/15">permissions verified</p>
            <p className="text-white/15">anti-nuke enabled</p>
            <p className="mt-1 text-green-400/50">ready in 0.3s</p>
            <p className="mt-1 text-accent/40">_</p>
          </div>
        </div>
      </TiltCard>

      <TiltCard className="absolute right-28 top-36" delay={0.5} initialX={60} initialY={20}>
        <div className="w-52 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 shadow-[0_0_60px_rgba(95,130,141,0.15),0_0_120px_rgba(95,130,141,0.06)] backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/15">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-medium text-white">Anti-Nuke</p>
              <p className="text-[10px] text-white/25">active</p>
            </div>
          </div>
          <div className="mt-3 flex items-end gap-0.5">
            {[45, 32, 60, 28, 50, 38, 72, 44, 56, 30, 48, 65, 40, 55, 35].map((h, i) => (
              <div key={i} className="w-1 rounded-t-sm bg-accent/25" style={{ height: `${h * 0.5}px` }} />
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[9px] text-white/15">threats blocked</span>
            <span className="text-[10px] font-semibold text-white/60">847</span>
          </div>
        </div>
      </TiltCard>

      <TiltCard className="absolute right-8 top-72" delay={0.8} initialX={30} initialY={50}>
        <div className="w-56 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 shadow-[0_0_60px_rgba(95,130,141,0.15),0_0_120px_rgba(95,130,141,0.06)] backdrop-blur-md">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-medium text-white/40">Live Activity</p>
            <span className="flex h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          </div>
          <div className="mt-3 space-y-2">
            {[
              { cmd: 'ban', user: 'toxic_user', time: '2s' },
              { cmd: 'mute', user: 'spam_bot', time: '8s' },
              { cmd: 'log', user: 'role_update', time: '12s' },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="rounded bg-accent/10 px-1.5 py-0.5 text-[9px] font-mono text-accent/70">/{a.cmd}</span>
                <span className="text-[10px] text-white/30">{a.user}</span>
                <span className="ml-auto text-[9px] text-white/15">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </TiltCard>
    </div>
  )
}
