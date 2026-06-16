'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { DISCORD_INVITE_URL } from '@/lib/constants'

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="dot-grid absolute inset-0 opacity-30" />

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-4 text-[10px] font-medium tracking-[0.3em] text-accent/40 uppercase">
            Error 404
          </p>

          <h1 className="text-7xl font-bold tracking-tighter text-white sm:text-9xl">
            4<span className="text-accent">0</span>4
          </h1>

          <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-white/20">
            This page doesn&apos;t exist. It may have been moved or deleted.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-xs font-semibold text-black transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(95,130,141,0.3)]"
          >
            Back to Home
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
