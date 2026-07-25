'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import ClusterModal from '@/components/status/ClusterModal'
import ClustersSection from '@/components/status/ClustersSection'
import SystemPanel from '@/components/status/SystemPanel'
import StatusHero, { StatusHeroSkeleton } from '@/components/status/StatusHero'
import PageHeader from '@/components/ui/PageHeader'
import { PAGE_TOP_PADDING, PAGE_X_PADDING } from '@/lib/pageLayout'
import { useLightMotion } from '@/hooks/useLightMotion'
import { type Cluster, type HealthData, latencyToMs, getShardCount, formatClusterStatus } from '@/lib/status'

const REFRESH_INTERVAL = 30

export default function StatusPage() {
  const lightMotion = useLightMotion()
  const [data, setData] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [refreshIn, setRefreshIn] = useState(REFRESH_INTERVAL)
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null)
  const [highlightedClusterId, setHighlightedClusterId] = useState<string | null>(null)

  const fetchHealth = useCallback(async () => {
    try {
      const res = await fetch('/api/health', { cache: 'no-store' })
      if (!res.ok) throw new Error()
      const json = await res.json()
      setData(json)
      setError(false)
      setLastUpdate(new Date())
      setRefreshIn(REFRESH_INTERVAL)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHealth()
    const interval = setInterval(fetchHealth, REFRESH_INTERVAL * 1000)
    return () => clearInterval(interval)
  }, [fetchHealth])

  useEffect(() => {
    const tick = setInterval(() => {
      setRefreshIn((s) => (s <= 1 ? REFRESH_INTERVAL : s - 1))
    }, 1000)
    return () => clearInterval(tick)
  }, [])

  const clusters = useMemo(() => {
    if (!data?.clusters) return []
    return Object.entries(data.clusters).map(([id, c]) => ({ ...c, id }))
  }, [data])

  const operational = useMemo(() => {
    if (clusters.length === 0 || getShardCount(clusters) === 0) return false
    return clusters.every((c) => {
      const status = formatClusterStatus(c.status, c.alive)
      return status === 'ready' || status === 'online'
    })
  }, [clusters])

  const starting = useMemo(
    () => clusters.some((c) => formatClusterStatus(c.status, c.alive) === 'connecting'),
    [clusters],
  )

  useEffect(() => {
    if (!highlightedClusterId) return
    document.getElementById(`cluster-${highlightedClusterId}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }, [highlightedClusterId])

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="line-grid pointer-events-none absolute inset-0 opacity-10" />
      <Navbar />

      <div className={`relative mx-auto w-full max-w-6xl flex-1 pb-16 sm:pb-24 ${PAGE_X_PADDING} ${PAGE_TOP_PADDING}`}>
        <PageHeader
          label="Is evict up?"
          title="Status"
          description={`Real-time cluster health, shard latency, and host metrics. Refreshes every ${REFRESH_INTERVAL}s.`}
        />

        <div className="mt-8 sm:mt-12">
        {loading ? (
          <StatusHeroSkeleton />
        ) : error || !data ? (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-12 text-center">
            <p className="text-sm text-white/40">Unable to reach the health endpoint.</p>
            <button
              type="button"
              onClick={fetchHealth}
              className="mt-4 rounded-full bg-accent px-5 py-2 text-xs font-semibold text-black transition-all hover:scale-[1.02]"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            <StatusHero
              users={data.users}
              guilds={data.guilds}
              latencyMs={latencyToMs(data.system?.latency ?? 0)}
              lastUpdate={lastUpdate}
              operational={operational}
              starting={starting}
              refreshIn={refreshIn}
            />

            <SystemPanel system={data.system} />

            <ClustersSection
              clusters={clusters}
              highlightedClusterId={highlightedClusterId}
              onHighlightCluster={setHighlightedClusterId}
              onSelectCluster={setSelectedCluster}
              lightMotion={lightMotion}
            />
          </div>
        )}
        </div>
      </div>

      <ClusterModal
        cluster={selectedCluster}
        clusterIndex={selectedCluster ? clusters.findIndex((c) => c.id === selectedCluster.id) : 0}
        onClose={() => setSelectedCluster(null)}
      />

      <Footer />
    </div>
  )
}
