'use client'

import { useState, useCallback, useRef, type ClipboardEvent, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { TbSearch, TbStack2 } from 'react-icons/tb'
import ClusterCard from '@/components/status/ClusterCard'
import {
  type Cluster,
  type GuildLookup,
  guildIdToShardId,
  getShardCount,
  locateShard,
} from '@/lib/status'

const ease = [0.23, 1, 0.32, 1] as const

interface ClustersSectionProps {
  clusters: Cluster[]
  highlightedClusterId: string | null
  onHighlightCluster: (clusterId: string | null) => void
  onSelectCluster: (cluster: Cluster) => void
  lightMotion: boolean
}

function GuildAvatar({ guild }: { guild: GuildLookup }) {
  if (guild.icon_url) {
    return (
      <img
        src={guild.icon_url}
        alt=""
        className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-white/[0.08]"
      />
    )
  }

  const initial = (guild.name?.[0] ?? '?').toUpperCase()
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent/80 ring-1 ring-white/[0.08]">
      {initial}
    </div>
  )
}

export default function ClustersSection({
  clusters,
  highlightedClusterId,
  onHighlightCluster,
  onSelectCluster,
  lightMotion,
}: ClustersSectionProps) {
  const [guildId, setGuildId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [guild, setGuild] = useState<GuildLookup | null>(null)
  const searchAbortRef = useRef<AbortController | null>(null)
  const guildIdRef = useRef(guildId)
  guildIdRef.current = guildId

  const clearLookup = useCallback(() => {
    searchAbortRef.current?.abort()
    searchAbortRef.current = null
    setLoading(false)
    setError(null)
    setGuild(null)
    onHighlightCluster(null)
  }, [onHighlightCluster])

  const search = useCallback(async (idOverride?: string) => {
    setError(null)
    setGuild(null)
    onHighlightCluster(null)
    searchAbortRef.current?.abort()

    const trimmed = (idOverride ?? guildId).trim()
    if (!trimmed) {
      setLoading(false)
      return
    }

    const shardCount = getShardCount(clusters)
    if (shardCount === 0) {
      setError('Shard data is unavailable.')
      return
    }

    const shardId = guildIdToShardId(trimmed, shardCount)
    if (shardId === null) {
      setError('Enter a valid guild ID.')
      return
    }

    const location = locateShard(clusters, shardId)
    if (!location) {
      setError(`Shard ${shardId} was not found in the current health data.`)
      return
    }

    onHighlightCluster(location.cluster.id)

    const controller = new AbortController()
    searchAbortRef.current = controller
    setLoading(true)

    try {
      const res = await fetch(`/api/guild/find?idx=${encodeURIComponent(trimmed)}`, {
        cache: 'no-store',
        signal: controller.signal,
      })
      if (controller.signal.aborted || guildIdRef.current.trim() !== trimmed) return
      if (res.ok) {
        setGuild((await res.json()) as GuildLookup)
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
        if (searchAbortRef.current === controller) searchAbortRef.current = null
      }
    }
  }, [clusters, guildId, onHighlightCluster])

  const onPaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '')
      if (!pasted) return
      e.preventDefault()
      guildIdRef.current = pasted
      setGuildId(pasted)
      void search(pasted)
    },
    [search],
  )

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    void search()
  }

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03]">
          <TbStack2 className="h-4 w-4 text-white/35" />
        </div>
        <h2 className="shrink-0 text-sm font-semibold text-white">Clusters</h2>

        <form onSubmit={onSubmit} className="min-w-[180px] flex-1 sm:max-w-[260px] sm:ml-auto">
          <div className="relative">
            <TbSearch className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-white/25" />
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              spellCheck={false}
              placeholder="Guild ID"
              value={guildId}
              disabled={loading}
              onPaste={onPaste}
              onChange={(e) => {
                const next = e.target.value.replace(/\D/g, '')
                setGuildId(next)
                if (!next) {
                  clearLookup()
                  return
                }
                setError(null)
                setGuild(null)
                onHighlightCluster(null)
                searchAbortRef.current?.abort()
                searchAbortRef.current = null
                setLoading(false)
              }}
              className="w-full rounded-full border border-white/[0.06] bg-white/[0.02] py-2 pr-4 pl-9 font-mono text-xs text-white/80 placeholder:text-white/25 outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.03] disabled:opacity-60"
            />
          </div>
        </form>
      </div>

      {error && <p className="mb-3 text-[11px] text-red-400/70">{error}</p>}

      {guild && guildId && (
        <div className="mb-4 flex max-w-md items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <GuildAvatar guild={guild} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white/85">{guild.name}</p>
            <p className="mt-0.5 text-[11px] text-white/40">
              {guild.member_count.toLocaleString()} members
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-white/20">{guild.guild_id}</p>
          </div>
        </div>
      )}

      <motion.div
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: lightMotion ? 0.2 : 0.35, delay: lightMotion ? 0 : 0.06, ease }}
      >
        {clusters.map((cluster, i) => (
          <ClusterCard
            key={cluster.id}
            cluster={cluster}
            index={i}
            highlighted={cluster.id === highlightedClusterId}
            onClick={() => onSelectCluster(cluster)}
          />
        ))}
      </motion.div>
    </section>
  )
}
