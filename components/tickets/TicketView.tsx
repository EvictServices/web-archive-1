'use client'

import { useEffect, useMemo, useState } from 'react'
import type { TicketTranscriptResponse as TicketData, TicketUser } from '@/lib/tickets'
import { formatTimestamp, getFallbackAvatar, getAvatarUrl, getInvolvedLabel } from '@/components/tickets/helpers'
import TranscriptMessages from '@/components/tickets/TranscriptMessages'
import ImpersonatorWarning from '@/components/tickets/ImpersonatorWarning'

interface Props {
  ticketData: TicketData
  ticketId: string
}

export default function TicketView({ ticketData, ticketId }: Props) {
  const { messages, attachments, embeds, channel, ticket: ticketMeta } = ticketData.ticket
  const [users, setUsers] = useState<TicketUser[]>(ticketData.ticket.users)

  const messageAuthorIds = useMemo(
    () => new Set(messages.map((m) => m.author_id)),
    [messages],
  )
  const people = useMemo(() => {
    const ids = new Set<string>(messageAuthorIds)
    if (ticketMeta?.opened_by_id) ids.add(ticketMeta.opened_by_id)
    if (ticketMeta?.closed_by_id) ids.add(ticketMeta.closed_by_id)
    return [...ids]
  }, [messageAuthorIds, ticketMeta?.opened_by_id, ticketMeta?.closed_by_id])

  const userMap = useMemo(() => new Map(users.map((u) => [u.id, u])), [users])

  useEffect(() => {
    if (people.length === 0) return

    const controller = new AbortController()
    fetch('/api/users/find', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_ids: people }),
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((rows: Array<{ user_id?: string; username?: string; display_name?: string; avatar?: string | null; bot?: boolean }>) => {
        if (!Array.isArray(rows) || rows.length === 0) return
        setUsers((prev) => {
          const map = new Map(prev.map((u) => [u.id, u]))
          for (const row of rows) {
            const id = String(row.user_id ?? '')
            if (!id) continue
            const existing = map.get(id)
            if (existing) {
              map.set(id, {
                ...existing,
                username: row.username || existing.username,
                global_name: row.display_name || existing.global_name,
                avatar: row.avatar || existing.avatar,
                bot: row.bot ?? existing.bot,
              })
            } else {
              map.set(id, {
                id,
                username: row.username || 'Unknown',
                global_name: row.display_name || null,
                discriminator: '0',
                avatar: row.avatar || null,
                bot: row.bot || false,
              })
            }
          }
          return [...map.values()]
        })
      })
      .catch(() => {})

    return () => controller.abort()
  }, [people])

  return (
    <main className="relative flex-1">
      <ImpersonatorWarning users={users} />
      <div className="mx-auto max-w-6xl px-4 pt-24 pb-16 sm:px-6 sm:pb-24">
        <header className="mb-6 text-center sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/[0.06]" />
            <span className="text-[9px] font-medium tracking-[0.2em] text-white/60 uppercase">Transcript</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/[0.06]" />
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="flex flex-col gap-3 lg:sticky lg:top-24 lg:self-start">
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3">
                <p className="text-[9px] font-medium tracking-wider text-white/40 uppercase">Messages</p>
                <p className="mt-1 text-xl font-bold tabular-nums text-white">{messages.length}</p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3">
                <p className="text-[9px] font-medium tracking-wider text-white/40 uppercase">Participants</p>
                <p className="mt-1 text-xl font-bold tabular-nums text-white">{people.length}</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3">
              <p className="text-[9px] font-medium tracking-wider text-white/40 uppercase">Opened</p>
              <p className="mt-1 text-[12px] text-white/65">{formatTimestamp(channel.created_at)}</p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3">
              <p className="text-[9px] font-medium tracking-wider text-white/40 uppercase">Close Reason</p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-white/60">
                {ticketMeta?.reason || 'No reason provided.'}
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
              <p className="mb-2.5 text-[9px] font-medium tracking-wider text-white/40 uppercase">Involved</p>
              <div className="flex flex-col gap-2">
                {people.map((pid) => {
                  const user = userMap.get(pid)
                  return (
                    <div key={pid} className="flex items-center gap-2.5">
                      <img
                        src={user ? getAvatarUrl(user) : getFallbackAvatar('0')}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="h-7 w-7 shrink-0 rounded-full object-cover"
                        onError={(e) => {
                          const img = e.currentTarget
                          const fallback = getFallbackAvatar('0')
                          if (img.src !== fallback) img.src = fallback
                        }}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-medium text-white/75">{getInvolvedLabel(user)}</p>
                        {user?.bot && <span className="text-[9px] font-medium text-[#5865f2]">BOT</span>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <p className="hidden px-1 font-mono text-[9px] text-white/20 lg:block" title={ticketId}>
              {ticketId}
            </p>
          </aside>

          <section className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#1e1f22]">
            <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] bg-[#111214] px-3 py-2.5 sm:px-4 sm:py-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="text-[12px] text-white/30">#</span>
                <span className="truncate text-[12px] font-medium text-white/55 sm:text-[13px]">{channel.name}</span>
              </div>
              <span className="shrink-0 text-[10px] tabular-nums text-white/25">{messages.length} msgs</span>
            </div>
            <TranscriptMessages
              messages={messages}
              users={users}
              attachments={attachments}
              embeds={embeds}
            />
          </section>
        </div>
      </div>
    </main>
  )
}
