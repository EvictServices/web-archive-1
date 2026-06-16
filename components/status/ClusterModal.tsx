'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StatusCard from '@/components/status/StatusCard'
import { useLightMotion } from '@/hooks/useLightMotion'

interface Shard {
  id: number
  latency: number
  users: number
  guilds: number
  uptime: number
  seen: number
}

interface Cluster {
  id: string
  config: { shard: { start: number; end: number } }
  last_heartbeat: number
  uptime: number
  alive: boolean
  users: number
  guilds: number
  average_latency: number
  shards: Shard[]
}

interface ClusterModalProps {
  cluster: Cluster | null
  clusterIndex: number
  onClose: () => void
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return String(n)
}

function formatDuration(seconds: number): string {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (d > 0) return `${d}d ${h}h ${m}m`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function uptimeToSeconds(value: number): number {
  if (value > 1_000_000_000) return Date.now() / 1000 - value
  return value
}

function StatusDot({ alive }: { alive: boolean }) {
  return (
    <span
      className={`inline-block h-1.5 w-1.5 rounded-full ${
        alive ? 'bg-green-400/70' : 'bg-red-400/70'
      }`}
    />
  )
}

export default function ClusterModal({ cluster, clusterIndex, onClose }: ClusterModalProps) {
  const lightMotion = useLightMotion()

  useEffect(() => {
    document.documentElement.style.overflow = cluster ? 'hidden' : ''
    document.body.style.overflow = cluster ? 'hidden' : ''
  }, [cluster])

  if (!cluster) return null

  return (
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
            className="relative max-h-[min(90dvh,calc(100vh-2rem))] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/[0.07] bg-[#0a0a0a] shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
          >
            <div className="border-b border-white/[0.06] px-5 py-5">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-xl font-light leading-none text-white/25 transition-colors hover:text-white/70"
              >
                &times;
              </button>

              <div className="flex items-start gap-3 pr-8">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03]">
                  <StatusDot alive={cluster.alive} />
                </div>
                <div>
                  <p className="text-lg font-semibold tracking-tight text-white">
                    Cluster {clusterIndex + 1}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium tracking-wide text-white/35 uppercase">
                    {cluster.alive ? 'Operational' : 'Offline'}
                  </p>
                  <p className="mt-2 text-[11px] text-white/60">
                    Uptime {formatDuration(uptimeToSeconds(cluster.uptime))} · Heartbeat{' '}
                    {new Date(cluster.last_heartbeat * 1000).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 px-4 py-4 sm:gap-3 sm:px-5">
              <StatusCard variant="stat" label="Users" value={formatNumber(cluster.users)} />
              <StatusCard variant="stat" label="Guilds" value={formatNumber(cluster.guilds)} />
              <StatusCard
                variant="stat"
                label="Latency"
                value={`${Math.ceil(cluster.average_latency * 1000)}ms`}
              />
            </div>

            <div className="border-t border-white/[0.04] px-5 pb-5">
              <p className="py-3 text-[9px] font-medium tracking-wider text-white/25 uppercase">Shards</p>
              <div className="overflow-hidden rounded-xl border border-white/[0.04] bg-white/[0.02]">
                <div className="grid grid-cols-6 gap-2 border-b border-white/[0.04] px-4 py-2 text-[9px] font-medium tracking-wider text-white/25 uppercase">
                  <span>Shard</span>
                  <span className="text-right">Latency</span>
                  <span className="text-right">Uptime</span>
                  <span className="text-right">Users</span>
                  <span className="text-right">Guilds</span>
                  <span className="text-right">Status</span>
                </div>
                {cluster.shards.map((shard) => (
                  <div
                    key={shard.id}
                    className="grid grid-cols-6 gap-2 border-b border-white/[0.03] px-4 py-2.5 text-[11px] text-white/50 last:border-b-0"
                  >
                    <span className="text-white/40">#{shard.id}</span>
                    <span className="text-right">{Math.ceil(shard.latency * 1000)}ms</span>
                    <span className="text-right">{formatDuration(uptimeToSeconds(shard.uptime))}</span>
                    <span className="text-right">{formatNumber(shard.users)}</span>
                    <span className="text-right">{formatNumber(shard.guilds)}</span>
                    <span className="flex items-center justify-end">
                      <span
                        className={`inline-block h-1.5 w-1.5 rounded-full ${
                          shard.latency < 0.05
                            ? 'bg-green-400/70'
                            : shard.latency < 0.1
                              ? 'bg-yellow-400/70'
                              : 'bg-red-400/70'
                        }`}
                      />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
