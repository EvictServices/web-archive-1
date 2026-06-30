'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
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
    mock: 'rewards_user',
  },
  {
    num: '03',
    label: 'VOICE',
    title: 'Voice channels, reimagined',
    desc: 'Users spawn their own temp channels with custom limits, permissions, and names. You set the rules, they make the space.',
    span: '',
    mock: (
      <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
        <div className="flex items-center justify-between">
          <span className="text-[8px] text-white/30">Active Channels</span>
          <span className="text-[7px] text-white/15">8/20</span>
        </div>
        <div className="mt-2 space-y-1">
          {['Squad', 'Lo-Fi', 'Tournament'].map((name) => (
            <div key={name} className="flex items-center gap-2 rounded bg-white/[0.02] px-2 py-1">
              <div className="h-2 w-2 rounded-full bg-accent/30" />
              <span className="text-[8px] text-white/30">{name}</span>
              <div className="ml-auto flex -space-x-1">
                {[1, 2].map((i) => (
                  <div key={i} className="h-3 w-3 rounded-full border border-black bg-white/[0.08]" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    num: '04',
    label: 'MESSAGES',
    title: 'Every moment, captured',
    desc: 'Welcome new members, celebrate boosts, and say goodbye with custom embeds, variables, and images for every event.',
    span: 'sm:col-span-2',
    mock: (
      <div className="flex gap-3">
        {[
          { type: 'Welcome', user: '@newbie', color: 'bg-accent/10' },
          { type: 'Boost', user: '@booster', color: 'bg-accent/15' },
          { type: 'Leave', user: '@gone', color: 'bg-white/[0.02]' },
        ].map((m, i) => (
          <div key={i} className={`flex-1 rounded-xl ${m.color} p-2.5`}>
            <p className="text-[7px] font-medium tracking-wider text-white/30 uppercase">{m.type}</p>
            <p className="mt-1 text-[8px] text-white/50">{m.user}</p>
            <div className="mt-2 h-px w-full bg-white/[0.04]" />
            <div className="mt-1.5 h-1.5 w-3/4 rounded-full bg-white/[0.04]" />
            <div className="mt-1 h-1 w-1/2 rounded-full bg-white/[0.03]" />
          </div>
        ))}
      </div>
    ),
  },
  {
    num: '05',
    label: 'BOOSTS',
    title: 'Boosters deserve the best',
    desc: 'Auto-assign booster roles, custom colors, and exclusive channels. Make supporting your server feel premium.',
    span: 'sm:col-span-2',
    mock: (
      <div className="flex items-center gap-4">
        <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/15 text-[8px] text-accent">B</div>
            <div>
              <p className="text-[9px] font-medium text-white/60">Server Booster</p>
              <p className="text-[8px] text-white/20">Role granted</p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <div className="h-4 flex-1 rounded-full bg-accent/10" />
            <span className="text-[7px] text-accent/40">3 boosts</span>
          </div>
        </div>
        <div className="flex gap-2">
          {['Color', 'Icon', 'Badge'].map((p) => (
            <div key={p} className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-2 py-1.5 text-[7px] text-white/25">{p}</div>
          ))}
        </div>
      </div>
    ),
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

function RewardsUserMock({ avatar, name }: { avatar?: string | null; name?: string }) {
  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
      <div className="flex items-center gap-2">
        {avatar ? (
          <img src={avatar} alt="" className="h-6 w-6 rounded-full object-cover" />
        ) : (
          <div className="h-6 w-6 rounded-full bg-accent/15" />
        )}
        <div>
          <p className="text-[9px] font-medium text-white/60">@{name || 'vip_member'}</p>
          <p className="text-[8px] text-white/20">Legendary tag unlocked</p>
        </div>
      </div>
      <div className="mt-2 flex gap-1">
        {['VIP', 'OG', 'ELITE'].map((t) => (
          <span key={t} className="rounded border border-accent/10 px-1.5 py-0.5 text-[7px] text-accent/50">{t}</span>
        ))}
      </div>
    </div>
  )
}

export default function FeaturesSection() {
  const users = useUsers(['604463848526708757'])
  const rewardsUser = users['604463848526708757']

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
              <div className="mb-4">
                {card.mock === 'rewards_user'
                  ? <RewardsUserMock avatar={rewardsUser?.avatar} name={rewardsUser?.display_name} />
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
