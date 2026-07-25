export interface Shard {
  id: number
  latency: number
  users: number
  guilds: number
  uptime: number
  seen: number
}

export type ClusterStatus = 'connecting' | 'online' | 'ready' | 'offline'

export interface Cluster {
  id: string
  config: { shard: { start: number; end: number } }
  status?: ClusterStatus
  last_heartbeat: number
  uptime: number
  alive: boolean
  users: number
  guilds: number
  average_latency: number
  shards: Shard[]
}

export interface HealthData {
  users: number
  guilds: number
  system: {
    cpu: number | { percent?: number; count?: number }
    memory: number | { percent?: number; total?: number; used?: number; available?: number }
    network: number | Record<string, unknown>
    latency: number
  }
  clusters: Record<string, Cluster>
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

export function formatDuration(seconds: number): string {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function uptimeToSeconds(value: number): number {
  if (value > 1_000_000_000) return Date.now() / 1000 - value
  return value
}

export function latencyToMs(seconds: number): number {
  return Math.max(0, Math.round(seconds * 1000))
}

export function latencyTone(ms: number): 'good' | 'warn' | 'bad' {
  if (ms < 80) return 'good'
  if (ms < 150) return 'warn'
  return 'bad'
}

export const LATENCY_TONE_CLASS = {
  good: 'text-accent',
  warn: 'text-amber-300/90',
  bad: 'text-red-400/90',
} as const

export const LATENCY_DOT_CLASS = {
  good: 'bg-accent/80',
  warn: 'bg-amber-400/80',
  bad: 'bg-red-400/80',
} as const

export const CLUSTER_STATUS_CLASS: Record<ClusterStatus, string> = {
  ready: 'bg-emerald-400/10 text-emerald-300',
  online: 'bg-accent/10 text-accent',
  connecting: 'bg-amber-400/10 text-amber-300',
  offline: 'bg-red-400/10 text-red-300',
}

export const CLUSTER_STATUS_INFO: {
  status: ClusterStatus
  label: string
  description: string
}[] = [
  {
    status: 'connecting',
    label: 'Connecting',
    description: 'Booting or waiting for all assigned shards to come online.',
  },
  {
    status: 'online',
    label: 'Online',
    description: 'Every assigned shard is connected; finishing startup.',
  },
  {
    status: 'ready',
    label: 'Ready',
    description: 'Fully started and serving traffic normally.',
  },
  {
    status: 'offline',
    label: 'Offline',
    description: 'No recent heartbeat — the instance is down or unreachable.',
  },
]

export function formatClusterStatus(status: ClusterStatus | undefined, alive: boolean): ClusterStatus {
  if (status) return status
  return alive ? 'online' : 'offline'
}

export function systemPercent(
  value: number | { percent?: number },
): number | null {
  if (typeof value === 'number') return null
  return typeof value.percent === 'number' ? value.percent : null
}

export function getShardCount(clusters: Cluster[]): number {
  return clusters.reduce((sum, cluster) => sum + cluster.shards.length, 0)
}

export function guildIdToShardId(guildId: string, shardCount: number): number | null {
  const trimmed = guildId.trim()
  if (!/^\d{5,}$/.test(trimmed) || shardCount <= 0) return null

  try {
    return Number((BigInt(trimmed) >> BigInt(22)) % BigInt(shardCount))
  } catch {
    return null
  }
}

export function locateShard(
  clusters: Cluster[],
  shardId: number,
): { cluster: Cluster; shard: Shard; clusterIndex: number } | null {
  for (let i = 0; i < clusters.length; i++) {
    const shard = clusters[i].shards.find((s) => s.id === shardId)
    if (shard) return { cluster: clusters[i], shard, clusterIndex: i }
  }
  return null
}

export interface GuildLookup {
  name: string
  guild_id: string
  member_count: number
  icon_url: string | null
  shard_id?: number
  cluster_instance?: string
  error?: string
}
