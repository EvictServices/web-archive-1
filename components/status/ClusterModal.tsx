'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import StatusCard from '@/components/status/StatusCard'
import {
  type Cluster,
  formatNumber,
  formatDuration,
  latencyToMs,
  latencyTone,
  uptimeToSeconds,
  LATENCY_DOT_CLASS,
  LATENCY_TONE_CLASS,
} from '@/lib/status'
import { useLightMotion } from '@/hooks/useLightMotion'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'

interface ClusterModalProps {
  cluster: Cluster | null
  clusterIndex: number
  onClose: () => void
}

export default function ClusterModal({ cluster, clusterIndex, onClose }: ClusterModalProps) {
  const lightMotion = useLightMotion()
  const [mounted, setMounted] = useState(false)
  useBodyScrollLock(!!cluster)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!cluster) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [cluster, onClose])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {cluster && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: lightMotion ? 0.1 : 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            initial={lightMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
            animate={lightMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={lightMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: lightMotion ? 0.12 : 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-h-[min(90dvh,calc(100vh-2rem))] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/[0.08] bg-card shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
          >
            <div className="border-b border-white/[0.06] px-5 py-5">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 text-xl font-light leading-none text-white/25 transition-colors hover:text-white/70"
                aria-label="Close"
              >
                &times;
              </button>

              <div className="flex items-start justify-between gap-3 pr-8">
                <div>
                  <p className="font-display text-lg font-semibold tracking-tight text-white">
                    Cluster {clusterIndex + 1}
                  </p>
                  <p className="mt-2 text-xs text-white/55">
                    Uptime {formatDuration(uptimeToSeconds(cluster.uptime))} · Heartbeat{' '}
                    {new Date(cluster.last_heartbeat * 1000).toLocaleTimeString()}
                  </p>
                </div>
                <span
                  className={`mt-0.5 shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase ${
                    cluster.alive
                      ? 'bg-emerald-400/10 text-emerald-300'
                      : 'bg-red-400/10 text-red-300'
                  }`}
                >
                  {cluster.alive ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 px-4 py-4 sm:gap-3 sm:px-5">
              <StatusCard variant="stat" label="Users" value={formatNumber(cluster.users)} />
              <StatusCard variant="stat" label="Guilds" value={formatNumber(cluster.guilds)} />
              <StatusCard
                variant="stat"
                label="Latency"
                value={`${latencyToMs(cluster.average_latency)}ms`}
                valueClass={
                  LATENCY_TONE_CLASS[cluster.alive ? latencyTone(latencyToMs(cluster.average_latency)) : 'bad']
                }
              />
            </div>

            <div className="border-t border-white/[0.06] px-5 pb-5">
              <p className="py-3 text-[11px] font-medium tracking-wider text-white/35 uppercase">Shards</p>
              <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-black/25">
                <div className="grid grid-cols-6 gap-2 border-b border-white/[0.06] px-4 py-2.5 text-[10px] font-medium tracking-wider text-white/35 uppercase">
                  <span>Shard</span>
                  <span className="text-right">Latency</span>
                  <span className="text-right">Uptime</span>
                  <span className="text-right">Users</span>
                  <span className="text-right">Guilds</span>
                  <span className="text-right">Status</span>
                </div>
                {cluster.shards.map((shard) => {
                  const ms = latencyToMs(shard.latency)
                  const tone = cluster.alive ? latencyTone(ms) : 'bad'
                  return (
                    <div
                      key={shard.id}
                      className="grid grid-cols-6 gap-2 border-b border-white/[0.04] px-4 py-2.5 text-xs text-white/55 last:border-b-0"
                    >
                      <span className="text-white/40">#{shard.id}</span>
                      <span className={`text-right ${LATENCY_TONE_CLASS[tone]}`}>{ms}ms</span>
                      <span className="text-right">{formatDuration(uptimeToSeconds(shard.uptime))}</span>
                      <span className="text-right">{formatNumber(shard.users)}</span>
                      <span className="text-right">{formatNumber(shard.guilds)}</span>
                      <span className="flex items-center justify-end">
                        <span
                          className={`w-1.5 rounded-sm ${cluster.alive ? LATENCY_DOT_CLASS[tone] : 'bg-red-400/40'} ${
                            tone === 'good' ? 'h-2.5' : tone === 'warn' ? 'h-3.5' : 'h-4'
                          }`}
                        />
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
