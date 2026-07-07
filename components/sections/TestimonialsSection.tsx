'use client'

import { motion } from 'framer-motion'
import { DISCORD_INVITE_URL, SUPPORT_SERVER_URL } from '@/lib/constants'

export default function TestimonialsSection() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0b1114] px-6 py-16 text-center sm:px-12"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-32 mx-auto h-64 w-[36rem] rounded-full bg-accent/10 blur-3xl"
          />

          <div className="relative">
            <img src="/evict.png" alt="" className="mx-auto h-14 w-14 rounded-full object-cover" />
            <h2 className="font-display mt-6 text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl">
              Ready when you are.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/50">
              Add evict to your server in under a minute. If you get stuck, real people in the
              support server will help you out.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-black transition-all hover:brightness-110 hover:shadow-[0_0_32px_rgba(95,130,141,0.35)]"
              >
                Add to Discord
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </a>
              <a
                href={SUPPORT_SERVER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full border border-white/[0.1] px-6 py-3 text-sm font-medium text-white/60 transition-colors hover:border-white/[0.2] hover:text-white/90"
              >
                Join the support server
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
