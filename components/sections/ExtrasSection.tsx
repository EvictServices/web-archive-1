'use client'

import Link from 'next/link'
import type { IconType } from 'react-icons'
import {
  TbBrandInstagram,
  TbChartBar,
  TbLayoutBoard,
  TbListDetails,
  TbPalette,
  TbStar,
  TbStarFilled,
} from 'react-icons/tb'
import SectionHeader from '@/components/ui/SectionHeader'
import GlassCard from '@/components/ui/GlassCard'
import { useUsers } from '@/hooks/useUsers'

const USER_IDS = {
  vael: '604463848526708757',
  isia: '368896789438529538',
  fshua: '357975942276055041',
} as const

const USER_FALLBACKS: Record<string, string> = {
  [USER_IDS.vael]: 'vael',
  [USER_IDS.isia]: 'isia',
  [USER_IDS.fshua]: 'fshua',
}

function displayName(id: string, user?: { display_name?: string; username?: string }): string {
  return user?.display_name || user?.username?.split('#')[0] || USER_FALLBACKS[id] || 'member'
}

function Avatar({ user, size = 'h-6 w-6' }: { user?: { avatar: string | null }; size?: string }) {
  return user?.avatar ? (
    <img src={user.avatar} alt="" className={`${size} shrink-0 rounded-full object-cover`} />
  ) : (
    <div className={`${size} shrink-0 rounded-full bg-white/[0.08]`} />
  )
}

function CardText({ Icon, title, desc }: { Icon: IconType; title: string; desc: string }) {
  return (
    <div>
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10 sm:h-10 sm:w-10">
        <Icon className="h-4 w-4 text-accent sm:h-5 sm:w-5" />
      </span>
      <h3 className="font-display mt-2.5 text-[15px] font-semibold tracking-tight text-white sm:mt-4 sm:text-lg">{title}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-white/50 sm:mt-2 sm:text-sm">{desc}</p>
    </div>
  )
}

function StarboardMock() {
  const users = useUsers([USER_IDS.vael])
  const user = users[USER_IDS.vael]
  const name = displayName(USER_IDS.vael, user)

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/25 p-3 sm:p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white/40">#starboard</span>
        <span className="flex items-center gap-1 text-xs font-medium text-yellow-400/80">
          <TbStarFilled className="h-3.5 w-3.5" />
          24
        </span>
      </div>
      <div className="mt-3 flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3.5">
        <Avatar user={user} size="h-8 w-8" />
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-xs sm:text-[13px] font-semibold text-white/80">{name}</span>
            <span className="text-xs text-white/30">#general</span>
          </div>
          <p className="mt-1 text-xs sm:text-[13px] leading-relaxed text-white/55">
            this announcement is huge fr
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.05]">
          <div className="h-full w-[80%] rounded-full bg-yellow-400/40" />
        </div>
        <span className="text-xs text-white/30">threshold: 5</span>
      </div>
    </div>
  )
}

function AuditLogsMock() {
  const users = useUsers([USER_IDS.vael, USER_IDS.isia, USER_IDS.fshua])

  const rows = [
    {
      badge: 'EDIT',
      badgeClass: 'bg-blue-400/15 text-blue-300',
      id: USER_IDS.vael,
      text: 'edited a message in #general',
    },
    {
      badge: 'JOIN',
      badgeClass: 'bg-green-400/15 text-green-300',
      id: USER_IDS.isia,
      text: 'joined via discord.gg/evict',
    },
    {
      badge: 'ROLE',
      badgeClass: 'bg-purple-400/15 text-purple-300',
      id: USER_IDS.fshua,
      text: 'picked the Gamer role',
    },
  ]

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/25 p-3 sm:p-4">
      <span className="text-xs font-medium text-white/40">#audit-logs</span>
      <div className="mt-2.5 space-y-1.5 sm:mt-3 sm:space-y-2">
        {rows.map((row) => {
          const user = users[row.id]
          return (
            <div
              key={row.badge}
              className="flex items-center gap-2.5 rounded-xl border border-white/[0.05] bg-white/[0.02] px-2.5 py-1.5 sm:px-3.5 sm:py-2.5"
            >
              <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold ${row.badgeClass}`}>
                {row.badge}
              </span>
              <Avatar user={user} size="h-5 w-5" />
              <span className="truncate text-xs sm:text-[13px] text-white/55">
                <span className="font-medium text-white/75">{displayName(row.id, user)}</span>{' '}
                {row.text}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SocialMock() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/25 p-3 sm:p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10">
          <TbBrandInstagram className="h-4.5 w-4.5 text-accent" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-[13px] font-semibold text-white/80">Instagram</p>
          <p className="text-xs text-white/35">@evictbot · 2m ago</p>
        </div>
        <span className="shrink-0 rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-semibold text-accent">
          REPOSTED
        </span>
      </div>
      <p className="mt-3 text-xs sm:text-[13px] leading-relaxed text-white/55">
        New update dropping tonight… stay tuned
      </p>
      <div className="mt-3 flex items-center gap-4 text-xs text-white/35">
        <span>2.4K likes</span>
        <span>142 comments</span>
        <span className="ml-auto text-white/25">→ #social-feed</span>
      </div>
    </div>
  )
}

function BrandingMock() {
  const users = useUsers([USER_IDS.isia])
  const user = users[USER_IDS.isia]
  const name = displayName(USER_IDS.isia, user)

  const colors = ['#5f828d', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981']

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/25 p-3 sm:p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white/40">Embed theme</span>
        <span className="text-xs text-white/30">Teal selected</span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        {colors.map((color, i) => (
          <span
            key={color}
            className={`h-6 w-6 rounded-full ${i === 0 ? 'ring-2 ring-white/40 ring-offset-2 ring-offset-card' : 'opacity-70'}`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <div className="mt-4 rounded-xl border-l-[3px] border-accent bg-white/[0.03] p-3.5">
        <div className="flex items-center gap-2">
          <img src="/evict.png" alt="" className="h-5 w-5 rounded-full object-cover" />
          <span className="text-xs font-semibold text-white/70">evict</span>
        </div>
        <p className="mt-2 flex items-center gap-2 text-xs sm:text-[13px] font-semibold text-white/80">
          <Avatar user={user} size="h-4.5 w-4.5" />
          Member joined
        </p>
        <p className="mt-1 text-xs leading-relaxed text-white/45">{name} just joined — say hi in #general</p>
      </div>
    </div>
  )
}

function EmbedBuilderMock() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/25 p-3 sm:p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white/40">Preview</span>
        <span className="rounded-md bg-white/[0.05] px-2 py-0.5 text-[10px] font-medium text-white/40">
          draft
        </span>
      </div>
      <div className="mt-3 rounded-xl border-l-[3px] border-accent bg-white/[0.03] p-3.5">
        <p className="text-xs sm:text-[13px] font-semibold text-white/80">Server rules</p>
        <p className="mt-1.5 text-xs leading-relaxed text-white/45">
          Be kind, keep it on topic, and no self-promo outside #showcase.
        </p>
        <p className="mt-2.5 text-[11px] text-white/30">evict · updated just now</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {['title', 'description', 'color', 'footer'].map((field) => (
          <span
            key={field}
            className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-white/45"
          >
            {field}
          </span>
        ))}
      </div>
    </div>
  )
}

function LeaderboardMock() {
  const users = useUsers([USER_IDS.vael, USER_IDS.isia, USER_IDS.fshua])

  const rows = [
    { id: USER_IDS.vael, rank: 1, messages: '12,847' },
    { id: USER_IDS.isia, rank: 2, messages: '11,203' },
    { id: USER_IDS.fshua, rank: 3, messages: '9,586' },
  ]

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/25 p-3 sm:p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white/40">Top members</span>
        <span className="text-xs text-white/30">this month</span>
      </div>
      <div className="mt-2.5 space-y-1.5 sm:mt-3 sm:space-y-2">
        {rows.map((row) => {
          const user = users[row.id]
          return (
            <div
              key={row.id}
              className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-2.5 py-1.5 sm:px-3.5 sm:py-2.5"
            >
              <span className={`w-5 text-center text-xs sm:text-[13px] font-semibold ${row.rank === 1 ? 'text-yellow-400/90' : 'text-white/35'}`}>
                {row.rank}
              </span>
              <Avatar user={user} />
              <span className="truncate text-xs sm:text-[13px] font-medium text-white/70">
                {displayName(row.id, user)}
              </span>
              <span className="ml-auto shrink-0 text-xs text-white/35">{row.messages} msgs</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const extras: { Icon: IconType; title: string; desc: string; mock: React.ReactNode }[] = [
  {
    Icon: TbStar,
    title: 'Starboard',
    desc: 'The community pins its own highlights. Messages that hit a star threshold get reposted to a dedicated channel.',
    mock: <StarboardMock />,
  },
  {
    Icon: TbListDetails,
    title: 'Audit logs',
    desc: 'Edits, deletions, joins, leaves, role changes — every action lands in your log channel with full context.',
    mock: <AuditLogsMock />,
  },
  {
    Icon: TbBrandInstagram,
    title: 'Social reposts',
    desc: 'New posts from Instagram, TikTok, X, and YouTube land in your server automatically, minutes after they go up.',
    mock: <SocialMock />,
  },
  {
    Icon: TbPalette,
    title: 'Your branding',
    desc: 'Custom avatar, banner, bio, embed colors, and context emojis. Evict looks like part of your server, not a guest.',
    mock: <BrandingMock />,
  },
  {
    Icon: TbLayoutBoard,
    title: 'Embed builder',
    desc: 'Design rich embeds visually and drop them anywhere — announcements, rules, welcome messages.',
    mock: <EmbedBuilderMock />,
  },
  {
    Icon: TbChartBar,
    title: 'Leaderboards',
    desc: 'Public rankings for messages and activity, so members can see where they stand at a glance.',
    mock: <LeaderboardMock />,
  },
]

export default function ExtrasSection() {
  return (
    <section className="relative px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          label="Beyond the basics"
          headline="Small things, done properly."
          subline="The details that make a server feel looked after — included, not sold separately."
        />

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          {extras.map((item, i) => (
            <GlassCard key={item.title}>
              <CardText Icon={item.Icon} title={item.title} desc={item.desc} />
              <div className="mt-4 flex flex-1 flex-col justify-end sm:mt-6">{item.mock}</div>
            </GlassCard>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/commands"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-white"
          >
            Browse all commands
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
