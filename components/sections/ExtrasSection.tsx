'use client'

import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import GlassCard from '@/components/ui/GlassCard'

const extras = [
  {
    num: '06',
    label: 'SOCIAL',
    title: 'Your content, everywhere',
    desc: 'Auto-repost from Instagram, TikTok, X, and more. Keep your server fed with fresh content without lifting a finger.',
    span: 'sm:col-span-2',
    mock: (
      <div className="space-y-2">
        {[
          { platform: 'Instagram', handle: '@evictbot', time: '2m ago', likes: '2.4K', comments: '142', img: true },
          { platform: 'TikTok', handle: '@evict', time: '15m ago', likes: '892', comments: '67', img: true },
          { platform: 'X', handle: '@evictbot', time: '1h ago', likes: '5.1K', comments: '234', img: false },
        ].map((post, i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-xl border border-white/[0.03] bg-white/[0.015] p-2.5">
            {post.img && (
              <div className="h-8 w-8 shrink-0 rounded-lg bg-accent/10" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[8px] font-medium text-white/40">{post.platform}</span>
                <span className="text-[7px] text-white/15">{post.handle}</span>
                <span className="ml-auto text-[7px] text-white/12">{post.time}</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[7px] text-white/20">♥ {post.likes}</span>
                <span className="text-[7px] text-white/20">↳ {post.comments}</span>
                <span className="ml-auto rounded bg-accent/8 px-1 py-0.5 text-[6px] text-accent/40">REPOSTED</span>
              </div>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-1.5 rounded-lg bg-white/[0.02] px-2.5 py-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-green-400/40 animate-pulse" />
          <span className="text-[8px] text-white/20">Watching 12 feeds — next check in 4m</span>
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
    mock: (
      <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
        <p className="text-[8px] text-white/25">Tap to assign</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {[
            { emoji: '⚔️', role: 'Gamer', color: 'bg-accent/10 border-accent/10' },
            { emoji: '🎨', role: 'Artist', color: 'bg-white/[0.02] border-white/[0.04]' },
            { emoji: '🎵', role: 'Music', color: 'bg-white/[0.02] border-white/[0.04]' },
            { emoji: '📰', role: 'News', color: 'bg-white/[0.02] border-white/[0.04]' },
          ].map((r) => (
            <button
              key={r.role}
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[8px] text-white/40 ${r.color}`}
            >
              <span>{r.emoji}</span>
              <span>{r.role}</span>
            </button>
          ))}
        </div>
      </div>
    ),
  },
  {
    num: '08',
    label: 'STARBOARD',
    title: 'The best of your server',
    desc: 'Pin standout messages to a dedicated channel with a star reaction threshold. Let the community curate the highlights.',
    span: '',
    mock: (
      <div className="space-y-1.5">
        {[
          { stars: 24, text: 'This announcement is huge' },
          { stars: 18, text: 'New feature just dropped' },
        ].map((row, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg border border-white/[0.03] bg-white/[0.02] px-2.5 py-1.5">
            <span className="text-[8px] text-accent/50">★</span>
            <span className="text-[8px] text-white/35">{row.stars}</span>
            <span className="text-[8px] text-white/25">{row.text}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    num: '09',
    label: 'LOGS',
    title: 'Nothing happens unseen',
    desc: 'Comprehensive audit logs for every action. Message edits, deletions, joins, leaves, role changes — all tracked.',
    span: 'sm:col-span-2',
    mock: (
      <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
        <div className="font-mono text-[8px] leading-relaxed">
          <p className="text-white/20">[<span className="text-accent/50">EDIT</span>] #general @user</p>
          <p className="mt-1 text-white/10">old: hello there</p>
          <p className="text-white/10">new: hello everyone</p>
          <p className="mt-1.5 text-white/20">[<span className="text-accent/50">ROLE</span>] @user +Muted</p>
          <p className="mt-1 text-white/20">[<span className="text-accent/50">JOIN</span>] @newbie arrived</p>
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
    mock: (
      <div className="flex gap-3">
        <div className="w-24 shrink-0 rounded-xl border border-white/[0.04] bg-white/[0.02] p-2.5">
          <div className="h-10 w-full rounded-lg bg-accent/10" />
          <img src="/evict.png" alt="evict" className="mx-auto -mt-4 h-8 w-8 rounded-full border-2 border-black object-cover" />
          <p className="mt-1 text-center text-[7px] text-white/30">evict#6621</p>
        </div>
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.03] bg-white/[0.02] px-2.5 py-1.5">
            <span className="text-[7px] text-white/20">Banner</span>
            <span className="ml-auto h-2 w-8 rounded-full bg-accent/15" />
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.03] bg-white/[0.02] px-2.5 py-1.5">
            <span className="text-[7px] text-white/20">Bio</span>
            <span className="ml-auto text-[7px] text-white/15">48/120</span>
          </div>
          <div className="flex items-center gap-2">
            {['#5f828d', '#3d5a66', '#1a2e35'].map((c) => (
              <div key={c} className="h-4 flex-1 rounded-md" style={{ backgroundColor: c }} />
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            {[
              <svg key="check" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>,
              <svg key="warn" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
              <svg key="x" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
            ].map((icon, i) => (
              <span key={i} className="flex h-5 w-5 items-center justify-center rounded bg-white/[0.03] text-white/30">{icon}</span>
            ))}
            <span className="text-[7px] text-white/15">Context emojis</span>
          </div>
        </div>
      </div>
    ),
  },
]

export default function ExtrasSection() {
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

        <div className="grid gap-4 sm:grid-cols-2">
          {extras.map((card, i) => (
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
