'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { type Update, timeAgo, getTagBadgeClass } from '@/lib/updates'

interface Props {
  updates: Update[]
}

export default function UpdatesView({ updates }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const u = updates[activeIndex]

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="line-grid absolute inset-0 opacity-10" />

      <div className="relative flex-1">
        {/* Hero */}
        <div className="mx-auto max-w-5xl px-6 pt-24 pb-10">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/[0.06]" />
            <span className="text-[9px] font-medium tracking-[0.2em] text-white/60 uppercase">Product</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/[0.06]" />
          </div>
          <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">Updates</h1>
          <p className="mt-3 text-center text-[12px] text-white/60">
            Latest changelog entries and release notes for Evict.
          </p>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-5xl px-6 pb-24">
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Sidebar */}
            <aside className="lg:w-56 lg:flex-shrink-0">
              <div className="sticky top-24">
                <p className="mb-3 text-[9px] font-medium tracking-[0.15em] text-white/60 uppercase">Releases</p>
                <div className="space-y-1">
                  {updates.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-white/20">No updates yet.</div>
                  ) : (
                    updates.map((entry, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`w-full rounded-xl px-4 py-3 text-left transition-all ${
                          i === activeIndex
                            ? 'border border-white/[0.06] bg-white/[0.04]'
                            : 'border border-transparent hover:bg-white/[0.02]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`h-1.5 w-1.5 rounded-full ${i === activeIndex ? 'bg-accent' : 'bg-white/10'}`} />
                          <span className={`text-[10px] font-medium ${i === activeIndex ? 'text-accent/70' : 'text-white/30'}`}>
                            Entry {updates.length - i}
                          </span>
                        </div>
                        <div className={`mt-1 text-[11px] font-semibold ${i === activeIndex ? 'text-white' : 'text-white/40'}`}>
                          {entry.title || ''}
                        </div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-[9px] text-white/20">
                          <span>{entry.date}</span>
                          <span>&middot;</span>
                          <span>{timeAgo(entry.date)}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </aside>

            {/* Detail panel */}
            <main className="flex-1">
              <AnimatePresence mode="wait">
                {u ? (
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.015]"
                  >
                    {/* Header */}
                    <div className="border-b border-white/[0.04] px-6 py-5">
                      <span className="text-[10px] font-medium text-accent/50">Entry {updates.length - activeIndex}</span>
                      <h2 className="mt-1 text-[18px] font-bold tracking-tight text-white">{u.title || ''}</h2>
                      <p className="mt-1 text-[11px] text-white/30">
                        {u.date}{timeAgo(u.date) ? ` — ${timeAgo(u.date)}` : ''}
                      </p>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-5">
                      {u.description && (
                        <p className="mb-6 text-[12px] leading-relaxed text-white/40">
                          {u.description}
                        </p>
                      )}

                      <div className="space-y-6">
                        {(u.sections || []).map((s, si) => (
                          <div key={si}>
                            <h3 className="mb-3 text-[10px] font-semibold tracking-wider text-white/50 uppercase">
                              {s.heading}
                            </h3>
                            <ul className="space-y-2">
                              {s.items.map((item, ii) => (
                                <li key={ii} className="flex items-start gap-2.5">
                                  <span
                                    className={`mt-0.5 inline-flex flex-shrink-0 items-center rounded border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${getTagBadgeClass(item.tag)}`}
                                  >
                                    {item.tag}
                                  </span>
                                  <span className="text-[12px] leading-relaxed text-white/40">{item.text}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex h-64 items-center justify-center rounded-2xl border border-white/[0.04] bg-white/[0.015]">
                    <span className="text-[11px] text-white/20">No updates available</span>
                  </div>
                )}
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
