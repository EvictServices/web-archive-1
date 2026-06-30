'use client'

import { useState, useEffect, useRef, useMemo, startTransition } from 'react'
import type { TicketAttachment, TicketEmbed, TicketUser } from '@/lib/tickets'
import { formatTimestamp, formatFileSize, getFallbackAvatar, getAvatarUrl, parseContentCached } from '@/components/tickets/helpers'

const INITIAL_BATCH = 20
const LOAD_MORE_BATCH = 40
const GROUP_MS = 7 * 60 * 1000

interface Message {
  id: string
  author_id: string
  content: string
  timestamp: string
  edited_timestamp: string | null
}

interface MessageGroup {
  authorId: string
  messages: Message[]
}

interface Props {
  messages: Message[]
  users: TicketUser[]
  attachments: TicketAttachment[]
  embeds: TicketEmbed[]
}

function embedColor(hex: string | null) {
  if (!hex) return '#202225'
  const n = parseInt(hex, 10)
  if (Number.isNaN(n)) return '#202225'
  return `#${n.toString(16).padStart(6, '0')}`
}

function normalizeContent(content: string): string {
  return content.replace(/\n{3,}/g, '\n\n').trim()
}

function buildGroups(messages: Message[]): MessageGroup[] {
  const groups: MessageGroup[] = []

  for (const msg of messages) {
    const last = groups[groups.length - 1]
    if (last && last.authorId === msg.author_id) {
      const prev = last.messages[last.messages.length - 1]
      const gap = new Date(msg.timestamp).getTime() - new Date(prev.timestamp).getTime()
      if (gap < GROUP_MS) {
        last.messages.push(msg)
        continue
      }
    }
    groups.push({ authorId: msg.author_id, messages: [msg] })
  }

  return groups
}

function isImageAttachment(filename: string, url: string) {
  return /\.(png|jpe?g|gif|webp|bmp)$/i.test(filename) || /\.(png|jpe?g|gif|webp)(\?|$)/i.test(url)
}

export default function TranscriptMessages({ messages, users, attachments, embeds }: Props) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH)
  const scrollRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const userMap = useMemo(() => new Map(users.map((u) => [u.id, u])), [users])

  const attachmentMap = useMemo(() => {
    const map = new Map<string, TicketAttachment[]>()
    attachments.forEach((att) => {
      const list = map.get(att.message_id) || []
      list.push(att)
      map.set(att.message_id, list)
    })
    return map
  }, [attachments])

  const embedMap = useMemo(() => {
    const map = new Map<string, TicketEmbed[]>()
    embeds.forEach((emb) => {
      const list = map.get(emb.message_id) || []
      list.push(emb)
      map.set(emb.message_id, list)
    })
    return map
  }, [embeds])

  const visibleMessages = useMemo(() => messages.slice(0, visibleCount), [messages, visibleCount])
  const groups = useMemo(() => buildGroups(visibleMessages), [visibleMessages])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => setShowScrollTop(el.scrollTop > 400)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (visibleCount >= messages.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          startTransition(() => {
            setVisibleCount((prev) => Math.min(prev + LOAD_MORE_BATCH, messages.length))
          })
        }
      },
      { root: scrollRef.current, rootMargin: '600px' },
    )
    const el = sentinelRef.current
    if (el) observer.observe(el)
    return () => { if (el) observer.unobserve(el) }
  }, [visibleCount, messages.length])

  return (
    <>
      <div ref={scrollRef} className="max-h-[min(72vh,900px)] overflow-y-auto overscroll-contain py-2 scrollbar-hide">
        {groups.map((group) => {
          const author = userMap.get(group.authorId)
          if (!author) return null

          const first = group.messages[0]
          const hasEdited = group.messages.some((m) => m.edited_timestamp)

          return (
            <div
              key={first.id}
              className="group/msg flex gap-3 px-3 py-1.5 transition-colors hover:bg-white/[0.025] sm:gap-4 sm:px-4"
            >
              <img
                src={getAvatarUrl(author)}
                alt=""
                referrerPolicy="no-referrer"
                className="mt-0.5 h-9 w-9 shrink-0 rounded-full object-cover sm:h-10 sm:w-10"
                onError={(e) => {
                  const img = e.currentTarget
                  const fallback = getFallbackAvatar(author.discriminator)
                  if (img.src !== fallback) img.src = fallback
                }}
              />

              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className={`text-[14px] font-semibold sm:text-[15px] ${author.bot ? 'text-[#5865f2]' : 'text-[#f2f3f5]'}`}>
                    {author.global_name || author.username}
                  </span>
                  {author.bot && (
                    <span className="rounded bg-[#5865f2] px-1 py-px text-[9px] font-bold text-white">BOT</span>
                  )}
                  <span className="text-[11px] text-[#949ba4]">{formatTimestamp(first.timestamp)}</span>
                  {hasEdited && (
                    <span className="text-[10px] text-[#949ba4]">(edited)</span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  {group.messages.map((msg) => {
                    const msgAttachments = attachmentMap.get(msg.id) || []
                    const msgEmbeds = embedMap.get(msg.id) || []
                    const content = normalizeContent(msg.content)

                    return (
                      <div key={msg.id} className="flex flex-col gap-1">
                        {content && (
                          <div className="break-words text-[14px] leading-[1.375] text-[#dbdee1] whitespace-pre-wrap sm:text-[15px]">
                            {parseContentCached(content, userMap)}
                          </div>
                        )}

                        {msgEmbeds.map((emb, idx) => (
                          <div key={idx} className="flex max-w-full sm:max-w-[520px]">
                            <div className="w-1 shrink-0 rounded-l-[4px]" style={{ background: embedColor(emb.color) }} />
                            <div className="min-w-0 flex-1 rounded-r-[4px] border border-l-0 border-white/[0.06] bg-black/20 p-2.5 sm:p-3">
                              {emb.author?.name && (
                                <div className="mb-1 flex items-center gap-2">
                                  {emb.author.icon_url && (
                                    <img src={emb.author.icon_url} alt="" className="h-5 w-5 rounded-full" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                                  )}
                                  <span className="text-[13px] font-semibold text-[#f2f3f5]">{emb.author.name}</span>
                                </div>
                              )}
                              {emb.title && (
                                emb.url ? (
                                  <a
                                    href={emb.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mb-0.5 block text-[14px] font-semibold text-[#00a8fc] hover:underline sm:text-[15px]"
                                  >
                                    {emb.title}
                                  </a>
                                ) : (
                                  <div className="mb-0.5 text-[14px] font-semibold text-[#f2f3f5] sm:text-[15px]">
                                    {emb.title}
                                  </div>
                                )
                              )}
                              {emb.description && (
                                <div className="break-words text-[13px] leading-[1.375] text-[#dbdee1] whitespace-pre-wrap sm:text-[14px]">
                                  {parseContentCached(emb.description, userMap)}
                                </div>
                              )}
                              {emb.fields.length > 0 && (
                                <div className="mt-1.5 grid grid-cols-1 gap-1.5 sm:grid-cols-3">
                                  {emb.fields.map((field, fi) => (
                                    <div key={fi} className={field.inline ? 'sm:col-span-1' : 'sm:col-span-3'}>
                                      <div className="text-[12px] font-semibold text-[#f2f3f5]">{field.name}</div>
                                      <div className="text-[13px] text-[#dbdee1] whitespace-pre-wrap">{parseContentCached(field.value, userMap)}</div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {emb.image?.url && (
                                <img src={emb.image.url} alt="" className="mt-1.5 max-h-[300px] max-w-full rounded object-contain" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                              )}
                              {emb.thumbnail?.url && (
                                <img src={emb.thumbnail.url} alt="" className="mt-1.5 max-h-20 max-w-20 rounded object-cover" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                              )}
                              {(emb.footer?.text || emb.timestamp) && (
                                <div className="mt-1.5 flex items-center gap-2 text-[11px] text-[#949ba4]">
                                  {emb.footer?.icon_url && (
                                    <img src={emb.footer.icon_url} alt="" className="h-4 w-4 rounded-full" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                                  )}
                                  <span>
                                    {emb.footer?.text}
                                    {emb.footer?.text && emb.timestamp && ' • '}
                                    {emb.timestamp && formatTimestamp(emb.timestamp)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        {msgAttachments.map((att, idx) => {
                          const isImage = isImageAttachment(att.filename, att.url) && !failedImages.has(att.url)
                          if (isImage) {
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setImagePreview(att.url)}
                                className="block max-w-full overflow-hidden rounded-lg sm:max-w-[400px]"
                              >
                                <img
                                  src={att.url}
                                  alt={att.filename}
                                  loading="lazy"
                                  referrerPolicy="no-referrer"
                                  className="max-h-[350px] max-w-full rounded-lg object-contain"
                                  onError={() => setFailedImages((prev) => new Set(prev).add(att.url))}
                                />
                              </button>
                            )
                          }
                          return (
                            <a
                              key={idx}
                              href={att.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex max-w-full items-center gap-2.5 rounded-lg border border-[#1e1f22] bg-[#2b2d31] px-3 py-2 text-[#dbdee1] transition-colors hover:bg-[#313338] sm:max-w-md"
                            >
                              <svg className="h-8 w-8 shrink-0 text-[#b5bac1]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 2C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2H6ZM13 9V3.5L18.5 9H13Z" />
                              </svg>
                              <div className="min-w-0">
                                <div className="truncate text-[13px] font-medium text-[#00a8fc]">{att.filename}</div>
                                <div className="text-[11px] text-[#949ba4]">{formatFileSize(att.file_size)}</div>
                              </div>
                            </a>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}

        {visibleCount < messages.length && (
          <div ref={sentinelRef} className="py-6 text-center text-[11px] text-[#949ba4]">
            Loading more messages…
          </div>
        )}
      </div>

      {showScrollTop && (
        <button
          type="button"
          onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed right-4 bottom-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-accent/90 text-white shadow-lg transition-opacity sm:right-6 sm:bottom-8"
          aria-label="Scroll to top"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 5l-7 7h4v4h6v-4h4l-7-7z" />
          </svg>
        </button>
      )}

      {imagePreview && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setImagePreview(null)}
        >
          <img
            src={imagePreview}
            alt="Preview"
            className="max-h-full max-w-full rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
