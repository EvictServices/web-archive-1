'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { type AvatarRecord, formatFullDate, formatRelativeTime, userAvatarUrl } from '@/lib/avatars'
import AvatarCardImage from './AvatarCardImage'
import { PageLabel } from '@/components/ui/PageHeader'
import { PAGE_TOP_PADDING, PAGE_X_PADDING } from '@/lib/pageLayout'
import { useLightMotion } from '@/hooks/useLightMotion'

const PAGE_SIZE = 24

interface AvatarsViewProps {
  avatars: AvatarRecord[]
  userId: string
  username: string | null
  avatarHash?: string | null
}

function AvatarModal({
  avatar,
  avatarId,
  onClose,
}: {
  avatar: AvatarRecord
  avatarId: number
  onClose: () => void
}) {
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handler)
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0a0a0a] shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-center justify-between border-b border-white/[0.04] px-5 py-3.5">
          <span className="text-[11px] font-semibold tracking-wide text-white/30">Avatar #{avatarId}</span>
          <div className="flex items-center gap-1">
            <a
              href={avatar.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-1.5 text-white/20 transition-colors hover:bg-white/[0.05] hover:text-white/70"
              title="Open image"
              onClick={(e) => e.stopPropagation()}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-white/20 transition-colors hover:bg-white/[0.05] hover:text-white/70"
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-5">
          <img src={avatar.url} alt={`Avatar #${avatarId}`} className="w-full rounded-xl" />
        </div>

        <div className="border-t border-white/[0.03] px-5 py-3.5">
          <div className="flex items-center justify-between py-1.5">
            <span className="text-[10px] font-medium tracking-wider text-white/60 uppercase">Captured</span>
            <span className="text-[12px] font-mono text-white/50">{formatFullDate(avatar.created_at)}</span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-[10px] font-medium tracking-wider text-white/60 uppercase">Relative</span>
            <span className="text-[12px] font-mono text-white/50">{formatRelativeTime(avatar.created_at)}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function AvatarsView({ avatars, userId, username, avatarHash }: AvatarsViewProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarRecord | null>(null)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const visibleAvatars = avatars.slice(0, visibleCount)
  const hasMore = visibleCount < avatars.length
  const lightMotion = useLightMotion()
  const latestAvatar = avatars[0]
  const profileUrl = userAvatarUrl(userId, avatarHash ?? null, 128)
  const title = username ? `${username}'s Avatars` : 'Avatar History'

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="line-grid absolute inset-0 opacity-10" />

      <div className="relative flex-1">
        <div className={`mx-auto max-w-5xl pb-10 ${PAGE_X_PADDING} ${PAGE_TOP_PADDING}`}>
          <motion.header
            className="text-center"
            initial={{ opacity: 0, y: lightMotion ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: lightMotion ? 0.2 : 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <PageLabel label="Every look, remembered" />

            <div className="mt-8 flex flex-col items-center text-center">
              <img
                src={profileUrl}
                alt=""
                className="h-16 w-16 rounded-full object-cover ring-2 ring-white/[0.06]"
                width={64}
                height={64}
              />
              <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">{title}</h1>
              <p className="mt-2 max-w-sm text-[11px] leading-relaxed text-white/60">
                Past profile pictures captured and archived by Evict.
              </p>
            </div>
          </motion.header>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium tracking-wider text-white/60 uppercase">Total</span>
              <span className="text-[15px] font-bold text-white">{avatars.length.toLocaleString()}</span>
            </div>
            <div className="h-4 w-px bg-white/[0.06]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium tracking-wider text-white/60 uppercase">Showing</span>
              <span className="text-[15px] font-bold text-white">
                {hasMore ? visibleCount.toLocaleString() : avatars.length.toLocaleString()}
              </span>
            </div>
            <div className="h-4 w-px bg-white/[0.06]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium tracking-wider text-white/60 uppercase">Latest</span>
              <span className="text-[15px] font-bold text-white/60">
                {latestAvatar ? formatRelativeTime(latestAvatar.created_at) : '—'}
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-6 pb-24">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {visibleAvatars.map((avatar, idx) => (
              <motion.button
                key={`${avatar.url}-${idx}`}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.01, 0.2), duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                onClick={() => setSelectedAvatar(avatar)}
                title={formatFullDate(avatar.created_at)}
                className="group relative aspect-square overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]"
              >
                <div className="relative h-full w-full">
                  <AvatarCardImage
                    url={avatar.url}
                    alt={`Avatar from ${formatFullDate(avatar.created_at)}`}
                    index={idx}
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 via-black/30 to-transparent px-2.5 pb-2 pt-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-[9px] text-white/80">{formatRelativeTime(avatar.created_at)}</span>
                  <span className="text-[9px] text-white/40">#{avatar.id}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, avatars.length))}
                className="rounded-full border border-white/[0.06] bg-white/[0.02] px-6 py-2.5 text-[11px] font-medium text-white/30 transition-all hover:border-accent/20 hover:bg-accent/[0.03] hover:text-accent/60"
              >
                Load more ({Math.min(PAGE_SIZE, avatars.length - visibleCount)} remaining)
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedAvatar && (
          <AvatarModal
            avatar={selectedAvatar}
            avatarId={selectedAvatar.id}
            onClose={() => setSelectedAvatar(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
