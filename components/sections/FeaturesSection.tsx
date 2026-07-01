'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { TbAward, TbBadge, TbBolt, TbCrown, TbLock, TbMicrophone, TbPalette, TbSparkles, TbStarFilled, TbUsers } from 'react-icons/tb'
import SectionHeader from '@/components/ui/SectionHeader'
import GlassCard from '@/components/ui/GlassCard'
import { useUsers } from '@/hooks/useUsers'

const tags = [
  { label: 'Anti-Nuke', icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> },
  { label: 'Rewards', icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg> },
  { label: 'Voicemaster', icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /></svg> },
  { label: 'Messages', icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> },
  { label: 'Boosts', icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg> },
]

const MOCK_USER_IDS = {
  welcome: '357975942276055041',
  boost: '368896789438529538',
  leave: '604463848526708757',
} as const

const MOCK_USER_FALLBACKS: Record<string, string> = {
  [MOCK_USER_IDS.welcome]: 'fshua',
  [MOCK_USER_IDS.boost]: 'isia',
  [MOCK_USER_IDS.leave]: 'vael',
}

function userHandle(id: string, user?: { display_name?: string; username?: string }): string {
  const fallback = MOCK_USER_FALLBACKS[id] || 'user'
  const name = (user?.display_name || user?.username?.split('#')[0] || fallback).toLowerCase()
  return `@${name}`
}

function MessagesMock() {
  const users = useUsers([MOCK_USER_IDS.welcome, MOCK_USER_IDS.boost, MOCK_USER_IDS.leave])

  const welcome = userHandle(MOCK_USER_IDS.welcome, users[MOCK_USER_IDS.welcome])
  const booster = userHandle(MOCK_USER_IDS.boost, users[MOCK_USER_IDS.boost])
  const leaving = userHandle(MOCK_USER_IDS.leave, users[MOCK_USER_IDS.leave])

  const events = [
    {
      type: 'Welcome',
      channel: '#welcome',
      time: '2s ago',
      accent: 'border-l-accent/50',
      embed: {
        title: 'Welcome to evict!',
        lines: [`Hey ${welcome} — glad you made it.`, 'Read #rules, then grab roles in #setup.'],
        footer: 'Member #12,847',
      },
    },
    {
      type: 'Boost',
      channel: '#boosts',
      time: 'just now',
      accent: 'border-l-pink-400/50',
      embed: {
        title: `${booster} just boosted the server!`,
        lines: ['+1 boost · Level 3 perks unlocked', 'Custom role color & emoji slot added'],
        footer: '3 total boosts',
      },
    },
    {
      type: 'Leave',
      channel: '#goodbye',
      time: '4m ago',
      accent: 'border-l-white/20',
      embed: {
        title: `See you later, ${leaving}`,
        lines: ['Thanks for hanging out with us.', 'The door is always open if you return.'],
        footer: 'Left after 42 days',
      },
    },
  ]

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {events.map((event) => (
        <div key={event.type} className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[7px] font-medium tracking-wider text-white/30 uppercase">{event.type}</span>
            <span className="text-[7px] text-white/15">{event.time}</span>
          </div>
          <p className="mt-1 font-mono text-[7px] text-accent/45">{event.channel}</p>
          <div className={`mt-2 rounded-lg border border-white/[0.04] border-l-2 bg-black/20 p-2 ${event.accent}`}>
            <p className="text-[8px] font-semibold text-white/65">{event.embed.title}</p>
            {event.embed.lines.map((line) => (
              <p key={line} className="mt-1 text-[7px] leading-relaxed text-white/35">{line}</p>
            ))}
            <p className="mt-1.5 text-[6px] text-white/20">{event.embed.footer}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function BoostsMock() {
  const users = useUsers([MOCK_USER_IDS.boost])
  const booster = users[MOCK_USER_IDS.boost]
  const boosterHandle = userHandle(MOCK_USER_IDS.boost, booster)

  const perks = [
    { label: 'Custom role color', value: '#5f828d', done: true },
    { label: 'Emoji slot', value: '2/30', done: true },
    { label: 'Banner upload', value: 'Level 3', done: false },
  ]

  return (
    <div className="grid gap-2 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            {booster?.avatar ? (
              <img src={booster.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-400/30 to-accent/30 text-[9px] font-semibold text-white/80">
                {boosterHandle.replace('@', '').charAt(0).toUpperCase()}
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-pink-400/20 text-pink-300/80">
              <TbStarFilled className="h-2 w-2" />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-medium text-white/70">{boosterHandle}</p>
            <p className="text-[7px] text-white/25">Server Booster · Tier 2</p>
          </div>
          <span className="rounded-full bg-pink-400/10 px-1.5 py-0.5 text-[6px] font-medium text-pink-300/70">LIVE</span>
        </div>

        <div className="mt-2.5">
          <div className="flex items-center justify-between text-[7px] text-white/25">
            <span>Progress to Level 3</span>
            <span className="text-accent/50">3 / 5 boosts</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
            <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-pink-400/40 to-accent/50" />
          </div>
        </div>

        <div className="mt-2.5 space-y-1">
          {perks.map((perk) => (
            <div key={perk.label} className="flex items-center justify-between rounded-md bg-white/[0.02] px-2 py-1">
              <div className="flex items-center gap-1.5">
                <span className={`h-1 w-1 rounded-full ${perk.done ? 'bg-accent/60' : 'bg-white/15'}`} />
                <span className="text-[7px] text-white/40">{perk.label}</span>
              </div>
              <span className="text-[7px] text-white/25">{perk.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-2.5">
          <p className="text-[7px] font-medium tracking-wider text-white/30 uppercase">Customize</p>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {[
              { label: 'Color', Icon: TbPalette, iconClass: 'text-accent/70', bg: 'bg-accent/15' },
              { label: 'Icon', Icon: TbBolt, iconClass: 'text-amber-300/80', bg: 'bg-accent/15' },
              { label: 'Badge', Icon: TbBadge, iconClass: 'text-pink-300/80', bg: 'bg-pink-400/15' },
            ].map(({ label, Icon, iconClass, bg }) => (
              <div key={label} className="rounded-lg border border-white/[0.04] bg-black/20 p-2 text-center">
                <div className={`mx-auto flex h-4 w-4 items-center justify-center rounded-full ${bg}`}>
                  <Icon className={`h-2.5 w-2.5 ${iconClass}`} />
                </div>
                <p className="mt-1.5 text-[7px] text-white/35">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-2.5">
          <p className="text-[7px] font-medium tracking-wider text-white/30 uppercase">Unlocked</p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {['#boost-lounge', '1080p stream', 'custom sticker'].map((item) => (
              <span key={item} className="rounded-md border border-accent/10 bg-accent/[0.04] px-1.5 py-0.5 text-[6px] text-accent/55">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function RewardsMock() {
  const users = useUsers([MOCK_USER_IDS.leave])
  const user = users[MOCK_USER_IDS.leave]
  const handle = userHandle(MOCK_USER_IDS.leave, user)
  const display = user?.display_name || MOCK_USER_FALLBACKS[MOCK_USER_IDS.leave]

  const rewardTags = [
    { label: 'VIP', Icon: TbCrown },
    { label: 'OG', Icon: TbStarFilled },
    { label: 'ELITE', Icon: TbAward },
  ]

  const perks = ['vanity.gg/vael', 'custom role', 'chat highlight']

  return (
    <div className="space-y-2">
      <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
        <div className="flex items-center gap-2.5">
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="h-8 w-8 rounded-full object-cover ring-2 ring-accent/20" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-accent/15 ring-2 ring-accent/20" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-[9px] font-medium text-white/70">{display}</p>
            <p className="text-[8px] text-white/30">{handle}</p>
          </div>
          <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-[6px] font-medium text-accent/70">LEGENDARY</span>
        </div>

        <p className="mt-2 text-[7px] text-white/25">Legendary tag unlocked</p>

        <div className="mt-2.5">
          <div className="flex items-center justify-between text-[7px] text-white/25">
            <span>Level 12</span>
            <span className="text-accent/50">2,450 / 3,000 XP</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
            <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-accent/30 to-accent/60" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {rewardTags.map(({ label, Icon }) => (
          <span key={label} className="inline-flex items-center gap-1 rounded-md border border-accent/10 bg-accent/[0.04] px-1.5 py-0.5 text-[7px] text-accent/55">
            <Icon className="h-2.5 w-2.5" />
            {label}
          </span>
        ))}
      </div>

      <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-2.5">
        <p className="text-[7px] font-medium tracking-wider text-white/30 uppercase">Unlocked perks</p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {perks.map((perk) => (
            <span key={perk} className="inline-flex items-center gap-1 rounded-md border border-white/[0.04] bg-black/20 px-1.5 py-0.5 text-[6px] text-white/35">
              <TbSparkles className="h-2 w-2 text-accent/45" />
              {perk}
            </span>
          ))}
        </div>
        <p className="mt-2 text-[6px] text-white/20">1,284 messages · 42-day streak</p>
      </div>
    </div>
  )
}

function VoiceMock() {
  const users = useUsers([MOCK_USER_IDS.leave, MOCK_USER_IDS.boost, MOCK_USER_IDS.welcome])

  const channels = [
    {
      name: 'Squad',
      members: 2,
      limit: 5,
      locked: false,
      userIds: [MOCK_USER_IDS.leave, MOCK_USER_IDS.boost],
    },
    {
      name: 'Lo-Fi',
      members: 1,
      limit: 3,
      locked: false,
      userIds: [MOCK_USER_IDS.welcome],
    },
    {
      name: 'Tournament',
      members: 3,
      limit: 8,
      locked: true,
      userIds: [MOCK_USER_IDS.leave, MOCK_USER_IDS.boost, MOCK_USER_IDS.welcome],
    },
  ]

  return (
    <div className="space-y-2">
      <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
        <div className="flex items-center justify-between">
          <span className="text-[8px] text-white/30">Active Channels</span>
          <span className="text-[7px] text-white/15">8 / 20</span>
        </div>

        <div className="mt-2 space-y-1">
          {channels.map((channel) => (
            <div key={channel.name} className="flex items-center gap-2 rounded-lg border border-white/[0.03] bg-black/20 px-2 py-1.5">
              <div className={`h-2 w-2 shrink-0 rounded-full ${channel.locked ? 'bg-amber-400/50' : 'bg-green-400/50'}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="truncate text-[8px] font-medium text-white/45">{channel.name}</span>
                  {channel.locked && <TbLock className="h-2 w-2 shrink-0 text-white/20" />}
                </div>
                <p className="text-[6px] text-white/20">
                  {channel.members}/{channel.limit} · {channel.locked ? 'locked' : 'open'}
                </p>
              </div>
              <div className="ml-auto flex -space-x-1">
                {channel.userIds.map((id) => {
                  const user = users[id]
                  return user?.avatar ? (
                    <img key={id} src={user.avatar} alt="" className="h-3.5 w-3.5 rounded-full border border-black object-cover" />
                  ) : (
                    <div key={id} className="h-3.5 w-3.5 rounded-full border border-black bg-white/[0.08]" />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {[
          { label: 'User limit', value: '5', Icon: TbUsers },
          { label: 'Bitrate', value: '64kbps', Icon: TbMicrophone },
          { label: 'Visibility', value: 'Private', Icon: TbLock },
        ].map(({ label, value, Icon }) => (
          <div key={label} className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-2 py-1.5 text-center">
            <Icon className="mx-auto h-2.5 w-2.5 text-accent/50" />
            <p className="mt-1 text-[6px] text-white/25">{label}</p>
            <p className="text-[7px] font-medium text-white/45">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const cards = [
  {
    num: '01',
    label: 'ANTI-NUKE',
    title: 'Raid? Never heard of it.',
    desc: 'Detects mass kicks, channel deletions, and role nukes in milliseconds. Locks down your server before the damage starts.',
    span: 'sm:col-span-2',
    mock: (
      <div className="space-y-1.5">
        {[
          { threat: 'Mass kick wave', action: 'Blocked', t: '0.1s' },
          { threat: 'Channel nuke', action: 'Locked', t: '0.3s' },
          { threat: 'Role wipe', action: 'Restored', t: '0.5s' },
        ].map((row, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg border border-white/[0.03] bg-white/[0.02] px-2.5 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-red-400/50" />
            <span className="text-[8px] text-white/35">{row.threat}</span>
            <span className="ml-auto rounded bg-accent/10 px-1 py-0.5 text-[7px] text-accent/60">{row.action}</span>
            <span className="text-[7px] text-white/12">{row.t}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    num: '02',
    label: 'REWARDS',
    title: 'Vanities that mean something',
    desc: 'Tag rewards, custom roles, and perks for your most active members. Make standing out worth it.',
    span: '',
    mock: <RewardsMock />,
  },
  {
    num: '03',
    label: 'VOICE',
    title: 'Voice channels, reimagined',
    desc: 'Users spawn their own temp channels with custom limits, permissions, and names. You set the rules, they make the space.',
    span: '',
    mock: <VoiceMock />,
  },
  {
    num: '04',
    label: 'MESSAGES',
    title: 'Every moment, captured',
    desc: 'Welcome new members, celebrate boosts, and say goodbye with custom embeds, variables, and images for every event.',
    span: 'sm:col-span-2',
    mock: <MessagesMock />,
  },
  {
    num: '05',
    label: 'BOOSTS',
    title: 'Boosters deserve the best',
    desc: 'Auto-assign booster roles, custom colors, and exclusive channels. Make supporting your server feel premium.',
    span: 'sm:col-span-2',
    mock: <BoostsMock />,
  },
]

function TagStrip({ tags }: { tags: { label: string; icon: React.ReactNode }[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20px' })

  const mid = Math.ceil(tags.length / 2)

  return (
    <div ref={ref} className="mb-10 flex flex-wrap justify-center gap-2 overflow-hidden">
      {tags.map((tag, i) => {
        const fromLeft = i < mid
        return (
          <motion.span
            key={tag.label}
            initial={{ opacity: 0, x: fromLeft ? -20 : 20 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={{ delay: 0.05 * i, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="group inline-flex items-center gap-1.5 rounded-full border border-white/[0.05] bg-white/[0.02] px-3 py-1.5 text-[9px] font-medium text-white/25 transition-all hover:border-accent/20 hover:bg-accent/[0.04] hover:text-accent/70"
          >
            <span className="text-[10px] opacity-50 transition-opacity group-hover:opacity-100">{tag.icon}</span>
            {tag.label}
          </motion.span>
        )
      })}
    </div>
  )
}

export default function FeaturesSection() {
  return (
    <section className="relative overflow-hidden px-6 py-24">
      <div className="line-grid absolute inset-0 opacity-20" />

      <div className="relative mx-auto max-w-5xl">
        <SectionHeader
          label="What you get"
          headline={<>
            Everything.
            <br />
            <span className="text-accent">Nothing missing.</span>
          </>}
        />

        <TagStrip tags={tags} />

        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map((card, i) => (
            <GlassCard key={card.num} span={card.span} delay={i}>
              <div className="mb-4">{card.mock}</div>
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
