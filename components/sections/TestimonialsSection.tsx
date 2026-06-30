'use client'

import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import { SUPPORT_SERVER_URL } from '@/lib/constants'

export default function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden px-6 py-24">
      <div className="line-grid absolute inset-0 opacity-20" />

      <div className="relative mx-auto max-w-3xl">
        <SectionHeader
          label="Trusted by thousands"
          headline={<>
            They said it,
            <br />
            <span className="text-accent">not us.</span>
          </>}
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-sm text-white/40">
            Reviews coming soon.
          </p>
          <p className="mt-2 text-[11px] text-white/20">
            Join the support server to get your review featured here.
          </p>
          <a
            href={SUPPORT_SERVER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-accent/20 px-6 py-2.5 text-[11px] font-medium text-accent/70 transition-all hover:border-accent/40 hover:text-accent"
          >
            Join Support Server
            <span>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
