import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { TbCrown, TbSparkles } from 'react-icons/tb'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import PageHeader from '@/components/ui/PageHeader'
import { PAGE_TOP_PADDING, PAGE_X_PADDING } from '@/lib/pageLayout'
import {
  type LevelLeaderboardEntry,
  type LevelUser,
  formatNumber,
  nextLevelXp,
  progressPercent,
} from '@/lib/levels'
import { userAvatarUrl } from '@/lib/avatars'

interface PageProps {
  params: Promise<{ guildId: string }>
}

interface GuildInfo {
  name: string
  guild_id: string
  icon_url: string | null
}

function fallbackUserName(userId: string): string {
  return `User ${String(userId).slice(-6)}`
}

async function fetchGuildInfo(guildId: string): Promise<GuildInfo | null> {
  try {
    const res = await fetch(`http://127.0.0.1:8000/guild/find?idx=${encodeURIComponent(guildId)}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    const data = (await res.json()) as Partial<GuildInfo>
    if (!data.name) return null
    return {
      name: data.name,
      guild_id: String(data.guild_id ?? guildId),
      icon_url: typeof (data as { icon_url?: unknown }).icon_url === 'string'
        ? ((data as { icon_url?: string }).icon_url ?? null)
        : null,
    }
  } catch {
    return null
  }
}

async function fetchBackendLeaderboard(guildId: string): Promise<LevelLeaderboardEntry[] | null> {
  try {
    const pg = (await import('pg')).default as any
    const connectionString =
      process.env.DATABASE_URL ||
      `postgresql://${process.env.POSTGRES_USER || 'postgres'}:${process.env.POSTGRES_PASSWORD || 'admin'}@${process.env.POSTGRES_HOST || '127.0.0.1'}:${process.env.POSTGRES_PORT || '5432'}/${process.env.POSTGRES_DB || 'evict'}`

    const pool = new pg.Pool({
      connectionString,
      max: 2,
    })

    const result = await pool.query(
      `
      SELECT user_id, level, xp, total_xp
      FROM level.member
      WHERE guild_id = $1
        AND level > 0
      ORDER BY total_xp DESC
      LIMIT 100
      `,
      [guildId]
    )

    await pool.end()
    const entries = Array.isArray(result.rows) ? result.rows : []

    const normalized = entries
      .map((entry: Partial<LevelLeaderboardEntry>) => ({
        user_id: String(entry.user_id ?? ''),
        level: Number(entry.level ?? 0),
        xp: Number(entry.xp ?? 0),
        total_xp: Number(entry.total_xp ?? 0),
      }))
      .filter((entry: LevelLeaderboardEntry) => /^\d{5,}$/.test(entry.user_id) && entry.level > 0)

    return normalized
  } catch {
    return null
  }
}

async function fetchUsers(ids: string[]): Promise<Record<string, LevelUser>> {
  if (ids.length === 0) return {}
  try {
    const h = await headers()
    const host = h.get('x-forwarded-host') || h.get('host') || '127.0.0.1:3000'
    const proto = h.get('x-forwarded-proto') || (host.includes('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https')
    const uniqueIds = [...new Set(ids)]
    const out: Record<string, LevelUser> = {}

    const bulk = await fetch(`${proto}://${host}/api/users/find`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_ids: uniqueIds }),
      cache: 'no-store',
    })

    if (bulk.ok) {
      const users = (await bulk.json()) as LevelUser[]
      for (const user of users) {
        if (!user?.user_id) continue
        out[String(user.user_id)] = user
      }
    }

    const missing = uniqueIds.filter((id) => !out[id])
    if (missing.length === 0) return out

    const BATCH_SIZE = 12
    for (let i = 0; i < missing.length; i += BATCH_SIZE) {
      const slice = missing.slice(i, i + BATCH_SIZE)
      const results = await Promise.all(
        slice.map(async (id) => {
          const res = await fetch(`${proto}://${host}/api/user/find`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: id }),
            cache: 'no-store',
          })
          if (!res.ok) return null
          const user = (await res.json()) as LevelUser | null
          if (!user?.user_id) return null
          return user
        })
      )

      for (const user of results) {
        if (!user) continue
        out[String(user.user_id)] = user
      }
    }

    return out
  } catch {
    return {}
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { guildId } = await params
  return {
    title: `Evict • Leaderboard • ${guildId}`,
  }
}

export default async function GuildLeaderboardPage({ params }: PageProps) {
  const { guildId } = await params
  const guild = await fetchGuildInfo(guildId)

  if (!guild) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <div className="line-grid pointer-events-none absolute inset-0 opacity-10" />
        <Navbar />

        <div className={`relative mx-auto w-full max-w-7xl flex-1 pb-16 sm:pb-24 ${PAGE_X_PADDING} ${PAGE_TOP_PADDING}`}>
          <PageHeader
            label="Who's been talking"
            title="Level Leaderboard"
            description={`Guild ${guildId}`}
          />

          <div className="mt-10 rounded-2xl border border-red-400/20 bg-red-500/[0.05] px-6 py-12 text-center">
            <p className="text-sm font-medium text-red-300/80">Guild not found</p>
            <p className="mt-2 text-[11px] text-red-200/60">
              The cluster could not resolve this guild ID, so leaderboard data was not loaded.
            </p>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  const entries = (await fetchBackendLeaderboard(guildId)) ?? []
  const users = await fetchUsers(entries.map((entry) => entry.user_id))

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="line-grid pointer-events-none absolute inset-0 opacity-10" />
      <Navbar />

      <div className={`relative mx-auto w-full max-w-7xl flex-1 pb-16 sm:pb-24 ${PAGE_X_PADDING} ${PAGE_TOP_PADDING}`}>
        <PageHeader
          label="Who's been talking"
          title="Level Leaderboard"
          description={
            <span className="inline-flex items-center gap-2">
              <img
                src={guild.icon_url || '/evict.png'}
                alt=""
                className="h-8 w-8 rounded-full object-cover ring-1 ring-white/[0.1]"
              />
              <span>{guild.name} · {guild.guild_id}</span>
            </span>
          }
        />

        {entries.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-12 text-center">
            <p className="text-sm text-white/45">No level leaderboard data is available for this guild yet.</p>
            <p className="mt-2 text-[11px] text-white/30">Once the backend exposes leaderboard entries, usernames and avatars will appear automatically.</p>
          </div>
        ) : (
        <>
        <div className="mt-10 grid gap-3 lg:grid-cols-3">
          {entries.slice(0, 3).map((entry, i) => {
            const user = users[entry.user_id]
            return (
              <div key={entry.user_id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] tracking-[0.12em] text-white/35 uppercase">#{i + 1}</p>
                  <TbCrown className="h-4 w-4 text-amber-300/70" />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <img
                    src={user?.avatar || userAvatarUrl(entry.user_id, null, 64)}
                    alt=""
                    className="h-7 w-7 rounded-full object-cover ring-1 ring-white/[0.08]"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-white/85">{user?.display_name || user?.username || fallbackUserName(entry.user_id)}</p>
                    <p className="font-mono text-[10px] text-white/35">{entry.user_id}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-white/55">Level {formatNumber(entry.level)}</p>
                <p className="mt-1 text-base font-bold text-white/80">{formatNumber(entry.total_xp)} XP</p>
              </div>
            )
          })}
        </div>

        <div className="mt-4 space-y-2 md:hidden">
          {entries.map((entry, index) => {
            const user = users[entry.user_id]
            const pct = progressPercent(entry)
            return (
              <div key={`${entry.user_id}-${index}`} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex items-center gap-2">
                    <img
                      src={user?.avatar || userAvatarUrl(entry.user_id, null, 48)}
                      alt=""
                      className="h-6 w-6 shrink-0 rounded-full object-cover ring-1 ring-white/[0.08]"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-semibold text-white/85">{user?.display_name || user?.username || fallbackUserName(entry.user_id)}</p>
                      <p className="truncate font-mono text-[10px] text-white/30">{entry.user_id}</p>
                    </div>
                  </div>
                  <p className="font-mono text-[11px] text-white/35">#{index + 1}</p>
                </div>

                <div className="mt-2.5 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
                    <div className="h-full rounded-full bg-accent/60" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[10px] text-white/30">{Math.round(pct)}%</span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                  <div className="rounded-lg border border-white/[0.04] bg-black/20 px-2.5 py-2">
                    <p className="text-[9px] tracking-[0.12em] text-white/30 uppercase">Level</p>
                    <p className="mt-1 text-sm font-semibold text-white/80">{formatNumber(entry.level)}</p>
                    <p className="mt-0.5 text-[10px] text-white/30">{formatNumber(entry.xp)}/{formatNumber(nextLevelXp(entry.level))}</p>
                  </div>
                  <div className="rounded-lg border border-white/[0.04] bg-black/20 px-2.5 py-2 text-right">
                    <p className="text-[9px] tracking-[0.12em] text-white/30 uppercase">Total XP</p>
                    <p className="mt-1 text-sm font-semibold text-white/80">{formatNumber(entry.total_xp)}</p>
                    <p className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-white/30">
                      <TbSparkles className="h-3 w-3" /> XP
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-white/[0.06] bg-white/[0.02] md:block">
          <div className="grid min-w-[760px] grid-cols-[72px_1fr_112px_132px] gap-4 border-b border-white/[0.04] px-5 py-3 text-[10px] tracking-[0.12em] text-white/30 uppercase">
            <span>Rank</span>
            <span>User</span>
            <span>Level</span>
            <span className="text-right">Total XP</span>
          </div>

          {entries.map((entry, index) => {
            const user = users[entry.user_id]
            const pct = progressPercent(entry)
            return (
              <div
                key={`${entry.user_id}-${index}`}
                className="grid min-w-[760px] grid-cols-[72px_1fr_112px_132px] gap-4 border-b border-white/[0.03] px-5 py-3.5 text-[13px] text-white/65 last:border-b-0"
              >
                <span className="font-mono text-[12px] text-white/35">#{index + 1}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <img
                      src={user?.avatar || userAvatarUrl(entry.user_id, null, 48)}
                      alt=""
                      className="h-6 w-6 shrink-0 rounded-full object-cover ring-1 ring-white/[0.08]"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-white/85">{user?.display_name || user?.username || fallbackUserName(entry.user_id)}</p>
                      <p className="truncate font-mono text-[10px] text-white/30">{entry.user_id}</p>
                    </div>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
                      <div className="h-full rounded-full bg-accent/60" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[11px] text-white/30">{Math.round(pct)}%</span>
                  </div>
                </div>
                <div className="flex flex-col justify-center text-right text-white/65">
                  <p className="text-sm font-semibold">{formatNumber(entry.level)}</p>
                  <p className="mt-0.5 text-[10px] text-white/30">{formatNumber(entry.xp)}/{formatNumber(nextLevelXp(entry.level))}</p>
                </div>
                <div className="flex flex-col items-end text-right">
                  <p className="text-sm font-semibold text-white/80">{formatNumber(entry.total_xp)}</p>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-white/30">
                    <TbSparkles className="h-3 w-3" /> XP
                  </p>
                </div>
              </div>
            )
          })}
        </div>
        </>
        )}
      </div>

      <Footer />
    </div>
  )
}
