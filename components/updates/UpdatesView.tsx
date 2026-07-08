'use client'

import { motion } from 'framer-motion'
import type { IconType } from 'react-icons'
import { TbArrowsExchange, TbBug, TbMinus, TbSparkles, TbTrendingUp } from 'react-icons/tb'
import PageHeader from '@/components/ui/PageHeader'
import { PAGE_TOP_PADDING, PAGE_X_PADDING } from '@/lib/pageLayout'
import { type Update, timeAgo, getTagBadgeClass } from '@/lib/updates'

const TAG_ICONS: Record<string, IconType> = {
  new: TbSparkles,
  improved: TbTrendingUp,
  changed: TbArrowsExchange,
  fixed: TbBug,
  removed: TbMinus,
}

interface Props {
  updates: Update[]
}

export default function UpdatesView({ updates }: Props) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="relative flex-1">
        <div className={`mx-auto max-w-3xl pb-24 ${PAGE_X_PADDING} ${PAGE_TOP_PADDING}`}>
          <PageHeader
            label="What we've been shipping"
            title="Updates"
            description={
              updates.length === 0 ? (
                'Release notes and patch history for Evict.'
              ) : (
                <>
                  <span className="font-semibold text-white/70">{updates.length}</span>
                  {' '}
                  {updates.length === 1 ? 'release' : 'releases'}
                  {' of what\'s new, improved, and fixed.'}
                </>
              )
            }
          />

          {updates.length === 0 ? (
            <div className="mt-16 rounded-3xl border border-dashed border-white/[0.1] px-6 py-20 text-center">
              <p className="text-sm font-medium text-white/50">No updates yet.</p>
              <p className="mt-2 text-xs text-white/35">Release notes will show up here.</p>
            </div>
          ) : (
            <div className="mt-12">
              {updates.map((u, i) => (
                <motion.article
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.06, 0.3), duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="relative pb-10 pl-8 last:pb-0 sm:pl-10"
                >
                  {i < updates.length - 1 && (
                    <div className="absolute top-4 bottom-0 left-[7px] w-px bg-white/[0.07]" />
                  )}

                  <div
                    className={`absolute top-6 left-0 h-[15px] w-[15px] rounded-full border-2 ${
                      i === 0
                        ? 'border-accent bg-accent/25'
                        : 'border-white/[0.15] bg-card'
                    }`}
                  />

                  <div className="rounded-3xl border border-white/[0.07] bg-card p-6 transition-colors hover:border-white/[0.12] sm:p-7">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <time className="text-xs font-medium text-white/45">{u.date}</time>
                      {timeAgo(u.date) && (
                        <span className="text-xs text-white/30">{timeAgo(u.date)}</span>
                      )}
                      {i === 0 && (
                        <span className="rounded-full bg-accent/12 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-accent uppercase">
                          Latest
                        </span>
                      )}
                    </div>

                    <h2 className="font-display mt-3 text-xl font-semibold tracking-tight text-white">
                      {u.title}
                    </h2>

                    {u.description && (
                      <p className="mt-2 text-sm leading-relaxed text-white/50">{u.description}</p>
                    )}

                    <div className="mt-6 space-y-6">
                      {u.sections.map((section, si) => (
                        <div key={si}>
                          <h3 className="text-[11px] font-semibold tracking-wider text-white/40 uppercase">
                            {section.heading}
                          </h3>
                          <ul className="mt-3 space-y-2.5">
                            {section.items.map((item, ii) => {
                              const TagIcon = TAG_ICONS[item.tag] ?? TbSparkles
                              return (
                                <li key={ii} className="flex items-start gap-3">
                                  <span
                                    className={`mt-px inline-flex w-[5.75rem] shrink-0 items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${getTagBadgeClass(item.tag)}`}
                                  >
                                    <TagIcon className="h-3 w-3 shrink-0" />
                                    {item.tag}
                                  </span>
                                  <span className="text-[13px] leading-relaxed text-white/60">{item.text}</span>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
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
