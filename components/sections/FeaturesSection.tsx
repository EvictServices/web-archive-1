'use client'

import type { IconType } from 'react-icons'
import {
  TbAlertTriangle,
  TbCheck,
  TbCrown,
  TbHeadphones,
  TbLock,
  TbMessage,
  TbRocket,
  TbShieldBolt,
  TbTags,
  TbVolume,
} from 'react-icons/tb'
import SectionHeader from '@/components/ui/SectionHeader'
import GlassCard from '@/components/ui/GlassCard'
import { useUsers } from '@/hooks/useUsers'

const MOCK_USER_IDS = {
  welcome: '357975942276055041',
  boost: '368896789438529538',
  member: '604463848526708757',
} as const

const MOCK_USER_FALLBACKS: Record<string, string> = {
  [MOCK_USER_IDS.welcome]: 'fshua',
  [MOCK_USER_IDS.boost]: 'isia',
  [MOCK_USER_IDS.member]: 'vael',
}

function displayName(id: string, user?: { display_name?: string; username?: string }): string {
  return user?.display_name || user?.username?.split('#')[0] || MOCK_USER_FALLBACKS[id] || 'member'
}

function FeatureIcon({ Icon }: { Icon: IconType }) {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent/10 sm:h-10 sm:w-10">
      <Icon className="h-4 w-4 text-accent sm:h-5 sm:w-5" />
    </span>
  )
}

function CardText({
  Icon,
  title,
  desc,
}: {
  Icon: IconType
  title: string
  desc: string
}) {
  return (
    <div>
      <FeatureIcon Icon={Icon} />
      <h3 className="font-display mt-2.5 text-[15px] font-semibold tracking-tight text-white sm:mt-4 sm:text-lg">{title}</h3>
      <p className="mt-1.5 text-xs leading-relaxed text-white/50 sm:mt-2 sm:text-sm">{desc}</p>
    </div>
  )
}

function AntiNukeMock() {
  const rows = [
    { threat: 'Mass kick wave', action: 'Blocked', time: '0.1s' },
    { threat: 'Channel deletions', action: 'Locked down', time: '0.3s' },
    { threat: 'Role wipe', action: 'Restored', time: '0.5s' },
  ]

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/25 p-3 sm:p-4">
      <span className="text-xs font-medium text-white/40">Threat log</span>
      <div className="mt-2.5 space-y-1.5 sm:mt-3 sm:space-y-2">
        {rows.map((row) => (
          <div
            key={row.threat}
            className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-2.5 py-1.5 sm:px-3.5 sm:py-2.5"
          >
            <TbAlertTriangle className="h-4 w-4 shrink-0 text-red-400/80" />
            <span className="truncate text-xs sm:text-[13px] text-white/70">{row.threat}</span>
            <span className="ml-auto shrink-0 rounded-md bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
              {row.action}
            </span>
            <span className="shrink-0 text-xs text-white/30">{row.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RewardsMock() {
  const users = useUsers([MOCK_USER_IDS.member])
  const user = users[MOCK_USER_IDS.member]
  const name = displayName(MOCK_USER_IDS.member, user)

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/25 p-3 sm:p-4">
      <div className="flex items-center gap-3">
        {user?.avatar ? (
          <img src={user.avatar} alt="" className="h-8 w-8 rounded-full object-cover ring-2 ring-accent/25 sm:h-10 sm:w-10" />
        ) : (
          <div className="h-8 w-8 rounded-full bg-accent/15 ring-2 ring-accent/25 sm:h-10 sm:w-10" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white/85">{name}</p>
          <p className="text-xs text-white/40">Level 12 · 42-day streak</p>
        </div>
        <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-semibold text-accent">
          VIP
        </span>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-white/40">
          <span>Progress to level 13</span>
          <span className="text-accent/80">2,450 / 3,000 XP</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.05]">
          <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-accent/50 to-accent" />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {['discord.gg/evict', 'custom role', 'chat highlight'].map((perk) => (
          <span
            key={perk}
            className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-xs text-white/50"
          >
            {perk}
          </span>
        ))}
      </div>
    </div>
  )
}

function VoiceMock() {
  const users = useUsers([MOCK_USER_IDS.member, MOCK_USER_IDS.boost, MOCK_USER_IDS.welcome])

  const channels = [
    { name: 'Squad', detail: '2/5 · open', locked: false, userIds: [MOCK_USER_IDS.member, MOCK_USER_IDS.boost] },
    { name: 'Lo-Fi', detail: '1/3 · open', locked: false, userIds: [MOCK_USER_IDS.welcome] },
    { name: 'Tournament', detail: '3/8 · locked', locked: true, userIds: [MOCK_USER_IDS.member, MOCK_USER_IDS.boost, MOCK_USER_IDS.welcome] },
  ]

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/25 p-3 sm:p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white/40">Temporary channels</span>
        <span className="text-xs text-white/30">8 active</span>
      </div>
      <div className="mt-2.5 space-y-1.5 sm:mt-3 sm:space-y-2">
        {channels.map((channel) => (
          <div
            key={channel.name}
            className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-2.5 py-1.5 sm:px-3.5 sm:py-2.5"
          >
            {channel.locked ? (
              <TbLock className="h-4 w-4 shrink-0 text-amber-400/80" />
            ) : (
              <TbVolume className="h-4 w-4 shrink-0 text-green-400/80" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-[13px] font-medium text-white/70">{channel.name}</p>
              <p className="text-xs text-white/35">{channel.detail}</p>
            </div>
            <div className="flex -space-x-1.5">
              {channel.userIds.map((id) => {
                const user = users[id]
                return user?.avatar ? (
                  <img key={id} src={user.avatar} alt="" className="h-5 w-5 rounded-full border-2 border-card object-cover" />
                ) : (
                  <div key={id} className="h-5 w-5 rounded-full border-2 border-card bg-white/[0.1]" />
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MessagesMock() {
  const users = useUsers([MOCK_USER_IDS.welcome, MOCK_USER_IDS.boost])
  const welcome = displayName(MOCK_USER_IDS.welcome, users[MOCK_USER_IDS.welcome])
  const booster = displayName(MOCK_USER_IDS.boost, users[MOCK_USER_IDS.boost])

  const events = [
    {
      type: 'Welcome',
      channel: '#welcome',
      accent: 'border-l-accent',
      title: `Welcome, ${welcome}!`,
      body: 'Glad you made it. Read #rules, then grab your roles in #setup.',
    },
    {
      type: 'Boost',
      channel: '#boosts',
      accent: 'border-l-pink-400/70',
      title: `${booster} just boosted the server`,
      body: 'Level 3 perks unlocked — custom role color and an emoji slot.',
    },
    {
      type: 'Goodbye',
      channel: '#goodbye',
      accent: 'border-l-white/25',
      title: 'See you around',
      body: 'Thanks for hanging out. The door is always open.',
    },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {events.map((event) => (
        <div key={event.type} className="rounded-2xl border border-white/[0.06] bg-black/25 p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium tracking-wide text-white/40 uppercase">{event.type}</span>
            <span className="font-mono text-xs text-accent/70">{event.channel}</span>
          </div>
          <div className={`mt-3 rounded-xl border-l-[3px] bg-white/[0.03] p-3.5 ${event.accent}`}>
            <p className="text-xs sm:text-[13px] font-semibold text-white/80">{event.title}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-white/45">{event.body}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function RolesMock() {
  const colorRoles = [
    { color: '#5f828d', name: 'Teal', active: true },
    { color: '#8b5cf6', name: 'Purple', active: false },
    { color: '#f59e0b', name: 'Amber', active: false },
    { color: '#ef4444', name: 'Rose', active: false },
  ]

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/25 p-3 sm:p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white/40">Pick a color</span>
        <span className="text-xs text-white/30">one per member</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {colorRoles.map((role) => (
          <span
            key={role.name}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
              role.active
                ? 'border-white/[0.15] bg-white/[0.05] text-white/85'
                : 'border-white/[0.06] text-white/40'
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: role.color }} />
            {role.name}
            {role.active && <TbCheck className="h-3.5 w-3.5 text-accent" />}
          </span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {['Gamer', 'Artist', 'Music', 'News'].map((role) => (
          <span
            key={role}
            className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-white/45"
          >
            {role}
          </span>
        ))}
      </div>
    </div>
  )
}

function BoostsMock() {
  const perks = [
    { label: 'Booster role assigned', done: true },
    { label: 'Custom color unlocked', done: true },
    { label: '#boost-lounge access', done: true },
  ]

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/25 p-3 sm:p-4">
      <div className="flex items-center justify-between text-xs text-white/40">
        <span>Progress to level 3</span>
        <span className="text-accent/80">3 / 5 boosts</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.05]">
        <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-pink-400/60 to-accent" />
      </div>
      <div className="mt-3 space-y-1.5 sm:mt-4 sm:space-y-2">
        {perks.map((perk) => (
          <div key={perk.label} className="flex items-center gap-2.5 rounded-xl bg-white/[0.02] px-3 py-2">
            <TbCheck className="h-3.5 w-3.5 shrink-0 text-accent" />
            <span className="text-xs sm:text-[13px] text-white/60">{perk.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function FeaturesSection() {
  return (
    <section className="relative px-5 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          label="What evict does"
          headline="Everything a busy server needs."
          subline="Protection, moderation, and community features that work out of the box. Set it up once and it quietly does its job."
        />

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          <GlassCard span="sm:col-span-2">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.2fr]">
              <CardText
                Icon={TbShieldBolt}
                title="Raids stop before they start"
                desc="evict watches for mass kicks, channel deletions, and role nukes, and shuts them down in milliseconds. Damage gets blocked, not cleaned up after."
              />
              <AntiNukeMock />
            </div>
          </GlassCard>

          <GlassCard>
            <CardText
              Icon={TbCrown}
              title="Reward the regulars"
              desc="Levels, streaks, vanity tags, and custom roles for the people who keep your server alive."
            />
            <div className="mt-4 sm:mt-6">
              <RewardsMock />
            </div>
          </GlassCard>

          <GlassCard>
            <CardText
              Icon={TbHeadphones}
              title="Voice channels on demand"
              desc="Members spawn their own temporary channels with their own limits and locks. You set the rules once."
            />
            <div className="mt-4 sm:mt-6">
              <VoiceMock />
            </div>
          </GlassCard>

          <GlassCard span="sm:col-span-2">
            <CardText
              Icon={TbMessage}
              title="Every arrival gets a hello"
              desc="Welcomes, boost announcements, and goodbyes with custom embeds and variables for every event."
            />
            <div className="mt-4 sm:mt-6">
              <MessagesMock />
            </div>
          </GlassCard>

          <GlassCard>
            <CardText
              Icon={TbTags}
              title="Self-serve roles"
              desc="Buttons, dropdowns, and reactions let members pick their own roles — no commands, no mod pings."
            />
            <div className="mt-4 sm:mt-6">
              <RolesMock />
            </div>
          </GlassCard>

          <GlassCard>
            <CardText
              Icon={TbRocket}
              title="Boosters get the best seats"
              desc="Auto-assigned roles, colors, and exclusive channels make supporting your server feel worth it."
            />
            <div className="mt-4 sm:mt-6">
              <BoostsMock />
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
