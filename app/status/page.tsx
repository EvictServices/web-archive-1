'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import ClusterModal from '@/components/status/ClusterModal'
import StatusHero, { StatusHeroSkeleton } from '@/components/status/StatusHero'
import { useLightMotion } from '@/hooks/useLightMotion'

const ease = [0.23, 1, 0.32, 1] as const

const clusterGridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.035, delayChildren: 0.04 },
  },
}

const clusterCardVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.28, ease },
  },
}

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

  const onlineShards = useMemo(
    () => clusters.reduce((sum, c) => sum + (c.alive ? c.shards?.length || 0 : 0), 0),
    [clusters]
  )

  const operational = useMemo(
    () => clusters.length > 0 && clusters.every((c) => c.alive),
    [clusters]
  )

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="line-grid absolute inset-0 opacity-20" />
      <Navbar />

      <div className="relative mx-auto w-full max-w-6xl flex-1 px-4 pt-20 pb-16 sm:px-6 sm:pt-24 sm:pb-24">
        <motion.header
          className="mb-8 text-center sm:mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: lightMotion ? 0.2 : 0.35, ease }}
        >
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/[0.06]" />
            <span className="text-[9px] font-medium tracking-[0.2em] text-white/60 uppercase">Infrastructure</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/[0.06]" />
          </div>
          <div className="mt-6 flex items-center justify-center gap-2.5">
            <StatusDot alive={!error && !!data} />
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Status</h1>
          </div>
          <p className="mx-auto mt-3 max-w-sm text-[11px] leading-relaxed text-white/50">
            Real-time system and cluster health. Auto-refreshes every 30s.
          </p>
        </motion.header>

        {loading ? (
          <StatusHeroSkeleton />
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
            <StatusHero
              users={data.users}
              guilds={data.guilds}
              latencyMs={Math.round((data.system?.latency ?? 0) * 1000)}
              shardsOnline={onlineShards}
              shardsTotal={totalShards}
              lastUpdate={lastUpdate}
              operational={operational}
            />

            {/* Clusters */}
            <div className="mt-8">
              <motion.div
                className="mb-4 flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: lightMotion ? 0.2 : 0.3, delay: lightMotion ? 0 : 0.08, ease }}
              >
                <h2 className="text-xs font-semibold tracking-wider text-white/30 uppercase">
                  Clusters
                </h2>
                <span className="text-[10px] text-white/20">{clusters.length} total</span>
              </motion.div>
              <motion.div
                className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
                variants={lightMotion ? undefined : clusterGridVariants}
                initial={lightMotion ? { opacity: 0 } : 'hidden'}
                animate={lightMotion ? { opacity: 1 } : 'show'}
                transition={lightMotion ? { duration: 0.2 } : undefined}
              >
                {clusters.map((cluster, i) => {
                  const cardClass =
                    'group relative cursor-pointer overflow-hidden rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 transition-[border-color,background-color] duration-200 hover:border-accent/15 hover:bg-white/[0.03]'
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
                      variants={clusterCardVariants}
                      className={cardClass}
                      onClick={() => setSelectedCluster(cluster)}
                    >
                      {cardBody}
                    </motion.div>
                  )
                })}
              </motion.div>
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
