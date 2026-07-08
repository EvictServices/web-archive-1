'use client'

import { motion } from 'framer-motion'
import { TbArrowRight, TbCheck } from 'react-icons/tb'
import { DISCORD_INVITE_URL, SUPPORT_SERVER_URL } from '@/lib/constants'

const SETUP_STEPS = [
  { label: 'Anti-nuke armed', time: 'instant' },
  { label: 'Welcome messages on', time: '20s' },
  { label: 'Self-serve roles live', time: '40s' },
]

function JoinMock() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/25 p-4">
      <div className="flex items-center gap-3">
        <img src="/evict.png" alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-accent">evict</span>
            <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
              BOT
            </span>
          </div>
          <p className="text-xs text-white/40">just joined your server</p>
        </div>
        <span className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full bg-accent/12 px-2.5 py-1 text-[11px] font-medium text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Online
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {SETUP_STEPS.map((step) => (
          <div
            key={step.label}
            className="flex items-center gap-2.5 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3.5 py-2.5"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15">
              <TbCheck className="h-3 w-3 text-accent" />
            </span>
            <span className="text-[13px] text-white/70">{step.label}</span>
            <span className="ml-auto shrink-0 text-xs text-white/30">{step.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px 0px' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-card p-8 sm:p-12"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_120%_at_85%_10%,rgba(95,130,141,0.12),transparent_60%)]"
          />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.2em] text-accent-bright uppercase">
                Get started
              </span>
              <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
                Ready when you are.
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/50">
                Evict is protecting your server the moment it joins — no config files, no
                dashboards to wrestle with. And if you get stuck, real people in the support
                server will help you out.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={DISCORD_INVITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black transition-all hover:brightness-110 hover:shadow-[0_0_32px_rgba(95,130,141,0.35)]"
                >
                  Add to Discord
                  <TbArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <a
                  href={SUPPORT_SERVER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border border-white/[0.1] px-6 py-3 text-sm font-medium text-white/60 transition-colors hover:border-white/[0.2] hover:text-white/90"
                >
                  Join the support server
                </a>
              </div>

              <p className="mt-6 text-xs text-white/35">Free to add · set up in under a minute</p>
            </div>

            <JoinMock />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
