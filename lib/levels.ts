export interface LevelLeaderboardEntry {
  user_id: string
  level: number
  xp: number
  total_xp: number
}

export interface LevelUser {
  user_id: string
  username: string
  display_name: string
  avatar: string | null
}

export function requiredXp(level: number, multiplier = 1): number {
  const cap = Math.max(level, 0)
  let total = 0
  for (let i = 0; i < cap; i++) total += i * 100 + 75
  return Math.round(total * multiplier)
}

export function nextLevelXp(level: number, multiplier = 1): number {
  return requiredXp(level + 1, multiplier)
}

export function progressPercent(entry: LevelLeaderboardEntry, multiplier = 1): number {
  const cap = Math.max(nextLevelXp(entry.level, multiplier), 1)
  return Math.max(0, Math.min((entry.xp / cap) * 100, 100))
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n)
}

function seeded(seed: number): () => number {
  let t = seed >>> 0
  return () => {
    t += 0x6D2B79F5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

export function mockLeaderboard(guildId: string, size = 25): LevelLeaderboardEntry[] {
  const rand = seeded(Number(guildId.slice(-9)) || 1337)
  const out: LevelLeaderboardEntry[] = []
  for (let i = 0; i < size; i++) {
    const level = Math.max(1, Math.floor(55 - i * 1.6 + rand() * 3))
    const nextXp = nextLevelXp(level, 1)
    const xp = Math.floor(nextXp * (0.08 + rand() * 0.85))
    const bonus = Math.floor(rand() * 30000)
    const total_xp = requiredXp(level, 1) + xp + bonus
    out.push({
      user_id: `1${guildId.slice(0, 6)}${String(i + 11).padStart(3, '0')}`,
      level,
      xp,
      total_xp,
    })
  }
  return out.sort((a, b) => b.total_xp - a.total_xp)
}
