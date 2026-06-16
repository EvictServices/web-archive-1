'use client'

import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import { SUPPORT_SERVER_URL } from '@/lib/constants'

const testimonials = [
  {
    quote: 'Switched from MEE6 and never looked back. The anti-nuke alone saved my server three times.',
    author: 'shawn',
    role: 'Owner, 45K members',
    server: 'Lofi Lounge',
  },
  {
    quote: 'Finally a bot that does everything without needing six others. Voice channels, social feeds, logs — all in one.',
    author: 'elph',
    role: 'Admin, 120K members',
    server: 'Creative Hub',
  },
  {
    quote: 'The customization is unreal. Our bot looks like it was built just for us. Members actually notice.',
    author: 'fshua',
    role: 'Founder, 28K members',
    server: 'Design Collective',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden px-6 py-24">
      <div className="line-grid absolute inset-0 opacity-20" />

      <div className="relative mx-auto max-w-5xl">
        <SectionHeader
          label="Trusted by thousands"
          headline={<>
            They said it,
            <br />
            <span className="text-accent">not us.</span>
          </>}
        />

        <div className="relative">
          <div className="grid gap-4 sm:grid-cols-3" style={{ perspective: 1200 }}>
            {testimonials.map((t, i) => (
              <div
                key={t.author}
                className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-5 opacity-20 blur-[2px]"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full border border-accent/15 bg-accent/[0.06]" />
                  <div>
                    <div className="h-2 w-12 rounded-full bg-white/[0.08]" />
                    <div className="mt-1 h-1.5 w-20 rounded-full bg-white/[0.04]" />
                  </div>
                </div>
                <div className="mt-4 space-y-1.5">
                  <div className="h-2 w-full rounded-full bg-white/[0.04]" />
                  <div className="h-2 w-5/6 rounded-full bg-white/[0.04]" />
                  <div className="h-2 w-4/6 rounded-full bg-white/[0.04]" />
                </div>
              </div>
            ))}
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-2xl border border-accent/15 bg-black/60 px-8 py-6 text-center backdrop-blur-xl"
            >
              <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-accent/10 blur-2xl" />
              <div className="absolute -left-10 -bottom-10 h-24 w-24 rounded-full bg-accent/5 blur-2xl" />

              <div className="relative">
                <p className="text-xs font-medium text-white/60">
                  To be added here.
                </p>
                <p className="mt-1.5 text-[10px] text-white/25">
                  Join the support server to get your review featured.
                </p>
                <a
                  href={SUPPORT_SERVER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-[10px] font-semibold text-black transition-all hover:scale-105"
                >
                  Join Support Server
                  <span>→</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
