'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import ClusterModal from '@/components/status/ClusterModal'
import StatusCard from '@/components/status/StatusCard'
import { useLightMotion } from '@/hooks/useLightMotion'

const iconClass = 'h-4 w-4 text-white/35 transition-colors group-hover:text-accent/80'

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

interface HealthData {
  users: number
  guilds: number
  system: {
    cpu: number | Record<string, unknown>
    memory: number | Record<string, unknown>
    network: number | Record<string, unknown>
    latency: number
  }
  clusters: Record<string, Cluster>
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
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
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

export default function StatusPage() {
  const lightMotion = useLightMotion()
  const [data, setData] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null)

  async function fetchHealth() {
    try {
      const res = await fetch('/api/health', { cache: 'no-store' })
      if (!res.ok) throw new Error()
      const json = await res.json()
      setData(json)
      setError(false)
      setLastUpdate(new Date())
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealth()
    const interval = setInterval(fetchHealth, 30_000)
    return () => clearInterval(interval)
  }, [])

  const clusters = useMemo(() => {
    if (!data?.clusters) return []
    return Object.entries(data.clusters).map(([id, c]) => ({ ...c, id }))
  }, [data])

  const totalShards = useMemo(
    () => clusters.reduce((sum, c) => sum + (c.shards?.length || 0), 0),
    [clusters]
  )

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="line-grid absolute inset-0 opacity-20" />
      <Navbar />

      <div className="relative flex-1 mx-auto max-w-6xl w-full px-6 pt-20 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2">
            <StatusDot alive={!error && !!data} />
            <h1 className="text-2xl font-bold tracking-tight text-white">Status</h1>
          </div>
          <p className="mt-1 text-[11px] text-white/60">
            Real-time system and cluster health. Auto-refreshes every 30s.
            {lastUpdate && (
              <span className="ml-1 text-white/40">
                Last updated {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </p>
        </motion.div>

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-5">
                <div className="h-2.5 w-16 animate-pulse rounded bg-white/[0.06]" />
                <div className="mt-3 h-7 w-24 animate-pulse rounded bg-white/[0.06]" />
              </div>
            ))}
          </div>
        ) : error || !data ? (
          <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-8 text-center">
            <p className="text-sm text-white/30">Unable to reach health endpoint.</p>
            <button
              onClick={fetchHealth}
              className="mt-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-[10px] font-medium text-white/40 transition-all hover:bg-white/[0.06] hover:text-white/60"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Status Banner */}
            <div className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-400/80 animate-pulse" />
                    <span className="text-sm font-bold text-white">All Systems Operational</span>
                  </div>
                  <p className="mt-1 text-[11px] text-white/60">
                    Powering {formatNumber(data.users)} users across {formatNumber(data.guilds)} communities
                  </p>
                  <p className="mt-0.5 text-[10px] text-white/40">
                    {lastUpdate?.toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-medium tracking-wider text-white/60 uppercase">Shards Online</p>
                  <p className="text-xl font-bold tracking-tight text-white">{totalShards}<span className="text-white/30">/{totalShards}</span></p>
                </div>
              </div>
            </div>

            {/* Metric Cards */}
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <StatusCard
                label="Avg Latency"
                value={`${(data.system?.latency * 1000).toFixed(0)}ms`}
                icon={
                  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                    <line x1="12" y1="20" x2="12.01" y2="20" />
                  </svg>
                }
              />
              <StatusCard
                label="Total Servers"
                value={formatNumber(data.guilds)}
                icon={
                  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                }
              />
              <StatusCard
                label="Total Users"
                value={formatNumber(data.users)}
                icon={
                  <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                }
              />
            </div>

            {/* Clusters */}
            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xs font-semibold tracking-wider text-white/30 uppercase">
                  Clusters
                </h2>
                <span className="text-[10px] text-white/20">{clusters.length} total</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {clusters.map((cluster, i) => {
                  const cardClass =
                    'group relative cursor-pointer overflow-hidden rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 transition-all duration-300 hover:border-accent/15 hover:bg-white/[0.03]'
                  const cardBody = (
                    <div className="relative">
                      <div className="flex items-center gap-2">
                        <StatusDot alive={cluster.alive} />
                        <span className="text-[11px] font-semibold text-white/60">
                          Cluster {i + 1}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[9px] font-medium tracking-wider text-white/60 uppercase">
                            Servers
                          </p>
                          <p className="mt-0.5 text-sm font-bold text-white/70">
                            {formatNumber(cluster.guilds)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-medium tracking-wider text-white/60 uppercase">
                            Users
                          </p>
                          <p className="mt-0.5 text-sm font-bold text-white/70">
                            {formatNumber(cluster.users)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[9px] font-medium tracking-wider text-white/60 uppercase">
                          Latency
                        </span>
                        <span className="text-[11px] font-semibold text-green-400/70">
                          {(cluster.average_latency * 1000).toFixed(0)}ms
                        </span>
                      </div>
                      <div className="mt-1 h-px w-full bg-white/[0.04]" />
                      <div
                        className="mt-1 h-[2px] rounded-full bg-green-400/30"
                        style={{
                          width: `${Math.min((cluster.average_latency * 1000 / 100) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  )

                  if (lightMotion) {
                    return (
                      <div key={cluster.id} className={cardClass} onClick={() => setSelectedCluster(cluster)}>
                        {cardBody}
                      </div>
                    )
                  }

                  return (
                    <motion.div
                      key={cluster.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.2 + Math.min(i * 0.04, 0.4),
                        duration: 0.3,
                        ease: [0.23, 1, 0.32, 1],
                      }}
                      className={cardClass}
                      onClick={() => setSelectedCluster(cluster)}
                    >
                      {cardBody}
                    </motion.div>
                  )
                })}
              </div>
            </div>

            <ClusterModal
              cluster={selectedCluster}
              clusterIndex={selectedCluster ? clusters.findIndex((c) => c.id === selectedCluster.id) : 0}
              onClose={() => setSelectedCluster(null)}
            />
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}
