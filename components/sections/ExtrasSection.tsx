'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { IconType } from 'react-icons'
import {
  TbAlertTriangle,
  TbBolt,
  TbBroadcast,
  TbCheck,
  TbCircleCheck,
  TbClick,
  TbCircleX,
  TbDeviceGamepad2,
  TbFileText,
  TbHandClick,
  TbInfoCircle,
  TbLoader2,
  TbLock,
  TbMusic,
  TbNews,
  TbPalette,
  TbPhoto,
  TbSelector,
  TbUser,
  TbUsers,
} from 'react-icons/tb'
import SectionHeader from '@/components/ui/SectionHeader'
import GlassCard from '@/components/ui/GlassCard'
import { useUsers } from '@/hooks/useUsers'

const INTEREST_ROLES: { Icon: IconType; role: string; members: string }[] = [
  { Icon: TbDeviceGamepad2, role: 'Gamer', members: '4.2K' },
  { Icon: TbPalette, role: 'Artist', members: '1.8K' },
  { Icon: TbMusic, role: 'Music', members: '3.1K' },
  { Icon: TbNews, role: 'News', members: '892' },
  { Icon: TbBroadcast, role: 'Streaming', members: '2.4K' },
]

const ROLE_USER_IDS = ['604463848526708757', '368896789438529538', '357975942276055041'] as const

const COLOR_ROLES = [
  { color: '#5f828d', name: 'Teal', members: '3.2K', active: true },
  { color: '#8b5cf6', name: 'Purple', members: '1.8K', active: false },
  { color: '#f59e0b', name: 'Amber', members: '942', active: false },
  { color: '#ef4444', name: 'Rose', members: '610', active: false },
] as const

const ASSIGNMENT_TYPES = [
  { label: 'Reaction', Icon: TbClick },
  { label: 'Button', Icon: TbHandClick },
  { label: 'Dropdown', Icon: TbSelector },
] as const

function RolesMock() {
  const users = useUsers([...ROLE_USER_IDS])
  const previewUser = users[ROLE_USER_IDS[0]]
  const previewName = previewUser?.display_name || 'vael'

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-1.5">
        {ASSIGNMENT_TYPES.map(({ label, Icon }) => (
          <div key={label} className="rounded-lg border border-white/[0.04] bg-black/20 px-2 py-1.5 text-center">
            <Icon className="mx-auto h-3 w-3 text-accent/50" />
            <p className="mt-1 text-[6px] text-white/30">{label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
        <div className="flex items-center justify-between">
          <p className="text-[7px] font-medium tracking-wider text-white/30 uppercase">Color roles</p>
          <span className="text-[6px] text-white/15">pick one · exclusive</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {COLOR_ROLES.map((role) => (
            <span
              key={role.name}
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[7px] ${
                role.active
                  ? 'border-white/[0.12] bg-white/[0.04] text-white/55'
                  : 'border-white/[0.04] text-white/25'
              }`}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: role.color }} />
              <span>{role.name}</span>
              {role.active && <TbCheck className="h-2 w-2 text-accent/60" />}
              <span className="text-white/15">· {role.members}</span>
            </span>
          ))}
        </div>
        <div className="mt-2.5 flex items-center gap-2 rounded-lg border border-white/[0.03] bg-black/20 px-2 py-1.5">
          {previewUser?.avatar ? (
            <img src={previewUser.avatar} alt="" className="h-5 w-5 rounded-full object-cover" />
          ) : (
            <div className="h-5 w-5 rounded-full bg-accent/15" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[7px] font-medium text-white/45">{previewName}</p>
            <p className="text-[6px] text-white/20">assigned Teal</p>
          </div>
          <span className="h-2 w-2 rounded-full bg-[#5f828d]" />
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
        <div className="flex items-center justify-between">
          <p className="text-[7px] font-medium tracking-wider text-white/30 uppercase">Interests</p>
          <span className="text-[6px] text-white/15">multi-select</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {INTEREST_ROLES.map(({ Icon, role, members }, i) => {
            const user = users[ROLE_USER_IDS[i % ROLE_USER_IDS.length]]
            return (
              <span
                key={role}
                className="inline-flex items-center gap-1 rounded-full border border-white/[0.04] bg-white/[0.02] px-2 py-1 text-[7px] text-white/30"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="h-3 w-3 rounded-full object-cover" />
                ) : (
                  <Icon className="h-2.5 w-2.5 text-white/35" />
                )}
                <span>{role}</span>
                <span className="text-white/12">· {members}</span>
              </span>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] px-2.5 py-1.5 text-[6px] text-white/20">
        <span className="flex items-center gap-1">
          <TbUsers className="h-2.5 w-2.5 text-accent/40" />
          12 roles configured
        </span>
        <span>9.8K assignments today</span>
      </div>
    </div>
  )
}

const EMBED_COLORS = [
  { hex: '#5f828d', name: 'Teal' },
  { hex: '#8b5cf6', name: 'Purple' },
  { hex: '#f59e0b', name: 'Amber' },
  { hex: '#ef4444', name: 'Rose' },
  { hex: '#10b981', name: 'Green' },
  { hex: '#3b82f6', name: 'Blue' },
] as const

const CONTEXT_EMOJIS: { label: string; Icon: IconType; color: string }[] = [
  { label: 'Success', Icon: TbCircleCheck, color: 'bg-green-400/10 text-green-400/60' },
  { label: 'Warning', Icon: TbAlertTriangle, color: 'bg-yellow-400/10 text-yellow-400/60' },
  { label: 'Error', Icon: TbCircleX, color: 'bg-red-400/10 text-red-400/60' },
  { label: 'Info', Icon: TbInfoCircle, color: 'bg-blue-400/10 text-blue-400/60' },
  { label: 'Loading', Icon: TbLoader2, color: 'bg-white/[0.04] text-white/35' },
  { label: 'Lock', Icon: TbLock, color: 'bg-accent/10 text-accent/55' },
]

function CustomizeMock() {
  const activeColor = EMBED_COLORS[0].hex

  return (
    <div className="flex gap-3">
      <div className="w-[7.5rem] shrink-0 space-y-2">
        <div className="overflow-hidden rounded-xl border border-white/[0.04] bg-white/[0.02]">
          <div className="h-10 w-full bg-gradient-to-br from-accent/25 via-accent/10 to-transparent" />
          <div className="px-2.5 pb-2.5">
            <img src="/evict.png" alt="evict" className="mx-auto -mt-4 h-9 w-9 rounded-full border-2 border-black object-cover" />
            <div className="mt-1.5 flex items-center justify-center gap-1">
              <p className="text-[8px] font-medium text-white/55">evict</p>
              <span className="h-1.5 w-1.5 rounded-full bg-green-400/70" />
            </div>
            <p className="text-center text-[6px] leading-relaxed text-white/20">your server&apos;s backbone</p>
          </div>
        </div>

        <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-2">
          <p className="text-[7px] font-medium tracking-wider text-white/25 uppercase">Status</p>
          <p className="mt-1 flex items-center gap-1 text-[7px] text-accent/50">
            <TbBolt className="h-2.5 w-2.5 shrink-0" />
            Protecting 27K servers
          </p>
        </div>

        <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-2">
          <p className="text-[7px] font-medium tracking-wider text-white/25 uppercase">Bio</p>
          <p className="mt-1 text-[6px] leading-relaxed text-white/25">all-in-one server management.</p>
        </div>

        <div className="grid grid-cols-3 gap-1">
          {[
            { label: 'Banner', Icon: TbPhoto },
            { label: 'Avatar', Icon: TbUser },
            { label: 'Bio', Icon: TbFileText },
          ].map(({ label, Icon }) => (
            <div key={label} className="rounded-md border border-white/[0.04] bg-black/20 px-1 py-1.5 text-center">
              <Icon className="mx-auto h-2.5 w-2.5 text-white/30" />
              <p className="mt-0.5 text-[5px] text-white/20">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
          <div className="flex items-center justify-between">
            <p className="text-[7px] font-medium tracking-wider text-white/25 uppercase">Embed theme</p>
            <span className="text-[6px] text-white/15">Teal selected</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {EMBED_COLORS.map((c) => (
              <div
                key={c.hex}
                title={c.name}
                className={`h-4 w-4 rounded-full border-2 ${c.hex === activeColor ? 'border-white/35 scale-110' : 'border-transparent opacity-70'}`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
          <div className="mt-3 rounded-lg border border-white/[0.04] border-l-2 bg-black/20 p-2.5" style={{ borderLeftColor: activeColor }}>
            <div className="mb-1 flex items-center gap-1.5">
              <img src="/evict.png" alt="" className="h-4 w-4 rounded-full object-cover" />
              <span className="text-[7px] font-medium text-white/40">evict</span>
            </div>
            <p className="text-[8px] font-semibold text-white/55">Member Banned</p>
            <p className="mt-0.5 text-[7px] text-white/30">@toxicuser was banned for raiding</p>
            <p className="mt-1 text-[6px] text-white/20">Reason: mass kick wave detected</p>
            <div className="mt-1.5 flex items-center gap-1.5 text-[6px] text-white/15">
              <span>Today at 12:04 PM</span>
              <span>·</span>
              <span>evict</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
          <div className="flex items-center justify-between">
            <p className="text-[7px] font-medium tracking-wider text-white/25 uppercase">Context emojis</p>
            <span className="text-[6px] text-white/15">6 configured</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {CONTEXT_EMOJIS.map(({ label, Icon, color }) => (
              <div key={label} className="flex items-center gap-1.5 rounded-lg border border-white/[0.03] bg-black/20 px-2 py-1">
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded ${color}`}>
                  <Icon className="h-2.5 w-2.5" />
                </span>
                <span className="text-[7px] text-white/30">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const extras = [
  {
    num: '06',
    label: 'SOCIAL',
    title: 'Your content, everywhere',
    desc: 'Auto-repost from Instagram, TikTok, X, and more. Keep your server fed with fresh content without lifting a finger.',
    span: 'sm:col-span-2',
    mock: (
      <div className="space-y-2.5">
        {[
          {
            platform: 'Instagram',
            icon: (
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-accent/70" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            ),
            handle: '@evictbot',
            time: '2m ago',
            likes: '2.4K',
            comments: '142',
            shares: '38',
            caption: 'New update dropping tonight... stay tuned 👀',
            hasMedia: true,
            progress: 85,
          },
          {
            platform: 'TikTok',
            icon: (
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-accent/70" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .55.04.81.1v-3.5a6.37 6.37 0 0 0-.81-.05A6.34 6.34 0 0 0 3.15 15.7 6.34 6.34 0 0 0 9.49 22a6.34 6.34 0 0 0 6.34-6.34V9.4a8.16 8.16 0 0 0 3.76.92V6.69z" />
              </svg>
            ),
            handle: '@evict',
            time: '15m ago',
            likes: '892',
            comments: '67',
            shares: '214',
            caption: 'POV: your server is finally safe from raiders',
            hasMedia: true,
            progress: 62,
          },
          {
            platform: 'X',
            icon: (
              <svg viewBox="0 0 24 24" className="h-3 w-3 text-accent/70" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            ),
            handle: '@evictbot',
            time: '1h ago',
            likes: '5.1K',
            comments: '234',
            shares: '1.2K',
            caption: 'evict v4.2 is live. anti-nuke just got 10x faster. your server has never been safer.',
            hasMedia: false,
            progress: 94,
          },
        ].map((post, i) => (
          <div key={i} className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10">{post.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-white/50">{post.platform}</span>
                  <span className="text-[9px] text-white/25">{post.handle}</span>
                </div>
              </div>
              <span className="text-[8px] text-white/20">{post.time}</span>
            </div>

            <p className="mt-2.5 text-[9px] leading-relaxed text-white/35">{post.caption}</p>

            {post.hasMedia && (
              <div className="mt-2.5 flex gap-2">
                <div className="h-14 flex-1 rounded-lg bg-gradient-to-br from-accent/10 to-accent/3 border border-white/[0.04]" />
                <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.04]" />
              </div>
            )}

            <div className="mt-2.5 flex items-center gap-4">
              <span className="flex items-center gap-1 text-[8px] text-white/25">
                <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                {post.likes}
              </span>
              <span className="flex items-center gap-1 text-[8px] text-white/25">
                <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                {post.comments}
              </span>
              <span className="flex items-center gap-1 text-[8px] text-white/25">
                <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                {post.shares}
              </span>
              <span className="ml-auto rounded-full bg-accent/10 px-2 py-0.5 text-[7px] font-semibold text-accent/60">REPOSTED</span>
            </div>

            {/* Engagement bar */}
            <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.03]">
              <div className="h-full rounded-full bg-accent/25" style={{ width: `${post.progress}%` }} />
            </div>
          </div>
        ))}

        {/* Feed status bar */}
        <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400/60 animate-pulse" />
              <span className="text-[9px] font-medium text-white/30">Monitoring 12 feeds</span>
            </div>
            <span className="text-[8px] text-white/20">47 posts today</span>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-1.5">
            {[
              { name: 'Instagram', count: 18 },
              { name: 'TikTok', count: 12 },
              { name: 'X', count: 9 },
              { name: 'YouTube', count: 8 },
            ].map((feed) => (
              <div key={feed.name} className="rounded-md bg-white/[0.02] px-2 py-1 text-center">
                <p className="text-[7px] text-white/15">{feed.name}</p>
                <p className="text-[9px] font-semibold text-white/35">{feed.count}</p>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between text-[8px] text-white/15">
            <span>next check in 4m</span>
            <span>avg. 3.2 posts/hr</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    num: '07',
    label: 'ROLES',
    title: 'Pick your identity',
    desc: 'Reaction roles, button roles, and dropdown menus. Let members self-assign without ever typing a command.',
    span: '',
    mock: <RolesMock />,
  },
  {
    num: '08',
    label: 'STARBOARD',
    title: 'The best of your server',
    desc: 'Pin standout messages to a dedicated channel with a star reaction threshold. Let the community curate the highlights.',
    span: '',
    mock: 'starboard_users',
  },
  {
    num: '09',
    label: 'LOGS',
    title: 'Nothing happens unseen',
    desc: 'Comprehensive audit logs for every action. Message edits, deletions, joins, leaves, role changes — all tracked.',
    span: 'sm:col-span-2',
    mock: (
      <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/[0.04] px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-medium text-white/30">#audit-logs</span>
            <span className="rounded bg-accent/10 px-1 py-0.5 text-[6px] text-accent/50">LIVE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-white/[0.06] px-1.5 py-0.5 text-[6px] text-white/20">All</span>
            <span className="rounded-full border border-white/[0.04] px-1.5 py-0.5 text-[6px] text-white/15">Mods</span>
            <span className="rounded-full border border-white/[0.04] px-1.5 py-0.5 text-[6px] text-white/15">Joins</span>
          </div>
        </div>
        <div className="p-3 font-mono text-[8px] leading-[1.8] space-y-0.5">
          <p className="text-white/15"><span className="text-white/10">12:04:32</span> <span className="rounded bg-blue-400/10 px-1 text-blue-400/50">EDIT</span> <span className="text-white/30">#general</span> @toxicuser edited message</p>
          <p className="pl-[52px] text-white/10">- &quot;hello there&quot; → &quot;hello everyone&quot;</p>
          <p className="text-white/15"><span className="text-white/10">12:04:18</span> <span className="rounded bg-red-400/10 px-1 text-red-400/50">DELETE</span> <span className="text-white/30">#memes</span> @spammer message removed</p>
          <p className="text-white/15"><span className="text-white/10">12:03:55</span> <span className="rounded bg-yellow-400/10 px-1 text-yellow-400/50">ROLE</span> <span className="text-white/30">@moderator</span> added Muted to @toxicuser</p>
          <p className="text-white/15"><span className="text-white/10">12:03:41</span> <span className="rounded bg-green-400/10 px-1 text-green-400/50">JOIN</span> <span className="text-white/30">@newbie</span> joined the server <span className="text-white/10">(inv: discord.gg/evict)</span></p>
          <p className="text-white/15"><span className="text-white/10">12:03:12</span> <span className="rounded bg-purple-400/10 px-1 text-purple-400/50">VOICE</span> <span className="text-white/30">@shawn</span> moved to Lounge 2</p>
          <p className="text-white/15"><span className="text-white/10">12:02:58</span> <span className="rounded bg-orange-400/10 px-1 text-orange-400/50">BAN</span> <span className="text-white/30">@raidbot</span> banned by antinuke <span className="text-white/10">(mass kick detected)</span></p>
        </div>
      </div>
    ),
  },
  {
    num: '10',
    label: 'CUSTOMIZE',
    title: 'Make it unmistakably yours',
    desc: 'Custom banner, avatar, bio, embed colors, and context emojis. Your bot, your brand, your rules.',
    span: 'sm:col-span-2',
    mock: <CustomizeMock />,
  },
]

const STARBOARD_IDS = ['604463848526708757', '368896789438529538', '357975942276055041']
const STARBOARD_FALLBACKS: Record<string, string> = {
  '604463848526708757': 'vael',
  '368896789438529538': 'isia',
  '357975942276055041': 'fshua',
}
const STARBOARD_MESSAGES = [
  { stars: 24, text: 'This announcement is huge fr', channel: '#general', time: '2h ago' },
  { stars: 18, text: 'New feature just dropped 🔥', channel: '#updates', time: '5h ago' },
  { stars: 12, text: 'Can we appreciate this UI tho', channel: '#off-topic', time: '8h ago' },
]

function StarboardMock({ userMap }: { userMap: Record<string, { display_name: string; avatar: string | null }> }) {
  return (
    <div className="space-y-2">
      {STARBOARD_MESSAGES.map((row, i) => {
        const id = STARBOARD_IDS[i]
        const user = userMap[id]
        const name = user?.display_name || STARBOARD_FALLBACKS[id]
        const avatar = user?.avatar || null
        return (
          <div key={i} className="rounded-xl border border-white/[0.03] bg-white/[0.02] p-2.5">
            <div className="flex items-start gap-2">
              {avatar ? (
                <img src={avatar} alt="" className="h-5 w-5 shrink-0 rounded-full object-cover" />
              ) : (
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[7px] font-medium text-accent/50">
                  {name[0].toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] font-medium text-white/40">{name}</span>
                  <span className="text-[7px] text-white/12">{row.channel}</span>
                  <span className="ml-auto text-[7px] text-white/10">{row.time}</span>
                </div>
                <p className="mt-0.5 text-[8px] text-white/25">{row.text}</p>
              </div>
            </div>
            <div className="mt-1.5 flex items-center gap-1 border-t border-white/[0.03] pt-1.5">
              <span className="text-[9px] text-yellow-400/50">★</span>
              <span className="text-[8px] font-medium text-yellow-400/40">{row.stars}</span>
              <div className="ml-1 h-1 flex-1 overflow-hidden rounded-full bg-white/[0.03]">
                <div className="h-full rounded-full bg-yellow-400/20" style={{ width: `${Math.min((row.stars / 30) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function RevealLine() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <div ref={ref} className="relative mx-auto my-6 h-px w-full max-w-xs overflow-hidden">
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : undefined}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="h-full origin-center bg-gradient-to-r from-transparent via-accent/30 to-transparent"
      />
    </div>
  )
}

export default function ExtrasSection() {
  const userMap = useUsers(STARBOARD_IDS)

  return (
    <section className="relative overflow-hidden px-6 py-24">
      <div className="line-grid absolute inset-0 opacity-20" />

      <div className="relative mx-auto max-w-5xl">
        <SectionHeader
          label="Beyond the basics"
          headline={<>
            The rest is
            <br />
            <span className="text-accent">just as important.</span>
          </>}
        />

        <RevealLine />

        <div className="grid gap-4 sm:grid-cols-2">
          {extras.map((card, i) => (
            <GlassCard key={card.num} span={card.span} delay={i}>
              <div className="mb-4">
                {card.mock === 'starboard_users'
                  ? <StarboardMock userMap={userMap} />
                  : card.mock}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-white/40">{card.num}</span>
                <span className="text-[10px] font-medium tracking-wider text-white/50">{card.label}</span>
              </div>
              <h3 className="mt-2 text-[15px] font-semibold text-white">{card.title}</h3>
              <p className="mt-1.5 text-[12px] leading-relaxed text-white/60">{card.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
