'use client'

import { motion } from 'framer-motion'
import { type Update, timeAgo, getTagBadgeClass } from '@/lib/updates'

interface Props {
  updates: Update[]
}

export default function UpdatesView({ updates }: Props) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="line-grid absolute inset-0 opacity-10" />

      <div className="relative flex-1">
        <div className="mx-auto max-w-3xl px-6 pt-24 pb-24">
          <motion.header
            className="text-center"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/[0.06]" />
              <span className="text-[9px] font-medium tracking-[0.2em] text-white/60 uppercase">Changelog</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/[0.06]" />
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">Updates</h1>
            <p className="mx-auto mt-3 max-w-md text-[11px] leading-relaxed text-white/60">
              {updates.length === 0 ? (
                'Release notes and patch history for Evict.'
              ) : (
                <>
                  <span className="font-semibold text-white/70">{updates.length}</span>
                  {' '}
                  {updates.length === 1 ? 'release' : 'releases'}
                  {' of what\'s new, improved, and fixed.'}
                </>
              )}
            </p>
          </motion.header>

          {/* Timeline */}
          {updates.length === 0 ? (
            <div className="mt-16 text-center">
              <p className="text-sm text-white/20">No updates yet.</p>
            </div>
          ) : (
            <div className="mt-12 space-y-0">
              {updates.map((u, i) => (
                <motion.article
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="relative pl-8 pb-12 last:pb-0"
                >
                  {/* Timeline line */}
                  {i < updates.length - 1 && (
                    <div className="absolute left-[7px] top-3 bottom-0 w-px bg-white/[0.06]" />
                  )}

                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1.5 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-white/[0.08] bg-[#0a0a0a]">
                    <div className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-accent' : 'bg-white/20'}`} />
                  </div>

                  {/* Date & version */}
                  <div className="flex items-center gap-3">
                    <time className="text-[11px] font-medium text-white/40">{u.date}</time>
                    {timeAgo(u.date) && (
                      <span className="text-[10px] text-white/20">{timeAgo(u.date)}</span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="mt-2 text-lg font-semibold tracking-tight text-white">{u.title}</h2>

                  {/* Description */}
                  {u.description && (
                    <p className="mt-2 text-[12px] leading-relaxed text-white/35">{u.description}</p>
                  )}

                  {/* Sections */}
                  <div className="mt-5 space-y-5">
                    {u.sections.map((section, si) => (
                      <div key={si}>
                        <h3 className="text-[10px] font-semibold tracking-wider text-white/50 uppercase">
                          {section.heading}
                        </h3>
                        <ul className="mt-2.5 space-y-2">
                          {section.items.map((item, ii) => (
                            <li key={ii} className="flex items-start gap-2.5">
                              <span
                                className={`mt-[2px] inline-flex shrink-0 items-center rounded px-1.5 py-[2px] text-[8px] font-semibold uppercase tracking-wide border ${getTagBadgeClass(item.tag)}`}
                              >
                                {item.tag}
                              </span>
                              <span className="text-[12px] leading-relaxed text-white/45">{item.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
