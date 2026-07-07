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
} from 'react-icons/tb'
import SectionHeader from '@/components/ui/SectionHeader'
import GlassCard from '@/components/ui/GlassCard'

const extras: { Icon: IconType; title: string; desc: string }[] = [
  {
    Icon: TbStar,
    title: 'Starboard',
    desc: 'The community pins its own highlights. Messages that hit a star threshold get reposted to a dedicated channel.',
  },
  {
    Icon: TbListDetails,
    title: 'Audit logs',
    desc: 'Edits, deletions, joins, leaves, role changes — every action lands in your log channel with full context.',
  },
  {
    Icon: TbBrandInstagram,
    title: 'Social reposts',
    desc: 'New posts from Instagram, TikTok, X, and YouTube land in your server automatically, minutes after they go up.',
  },
  {
    Icon: TbPalette,
    title: 'Your branding',
    desc: 'Custom avatar, banner, bio, embed colors, and context emojis. evict looks like part of your server, not a guest.',
  },
  {
    Icon: TbLayoutBoard,
    title: 'Embed builder',
    desc: 'Design rich embeds visually and drop them anywhere — announcements, rules, welcome messages.',
  },
  {
    Icon: TbChartBar,
    title: 'Leaderboards',
    desc: 'Public rankings for messages and activity, so members can see where they stand at a glance.',
  },
]

export default function ExtrasSection() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          label="Beyond the basics"
          headline="Small things, done properly."
          subline="The details that make a server feel looked after — included, not sold separately."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {extras.map((item, i) => (
            <GlassCard key={item.title} delay={i} className="!p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <item.Icon className="h-5 w-5 text-accent" />
              </span>
              <h3 className="font-display mt-4 text-base font-semibold tracking-tight text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">{item.desc}</p>
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
