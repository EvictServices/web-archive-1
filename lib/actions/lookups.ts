'use server'

import type { GuildLookup } from '@/lib/status'
import { BACKEND_URL } from '@/lib/constants'

export type UserLookup = {
  user_id: string
  username?: string
  display_name?: string
  avatar?: string | null
}

function normalizeUser(raw: Record<string, unknown>): UserLookup | null {
  const userId = raw.user_id
  if (userId == null) return null
  const id = String(userId)
  if (!/^\d{5,}$/.test(id)) return null

  return {
    user_id: id,
    username: typeof raw.username === 'string' ? raw.username : undefined,
    display_name: typeof raw.display_name === 'string' ? raw.display_name : undefined,
    avatar: typeof raw.avatar === 'string' ? raw.avatar : null,
  }
}

function quoteSnowflakes(raw: string): string {
  return raw.replace(/"user_id"\s*:\s*(\d+)/g, '"user_id":"$1"')
}

export async function findUsers(userIds: string[]): Promise<UserLookup[]> {
  try {
    const ids = userIds.map(String).filter((id) => /^\d{5,}$/.test(id))
    if (ids.length === 0) return []

    const res = await fetch(`${BACKEND_URL}/users/find`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_ids: ids }),
    })
    if (!res.ok) return []

    const parsed: Record<string, unknown>[] = JSON.parse(quoteSnowflakes(await res.text()))
    const found = parsed
      .map(normalizeUser)
      .filter((user): user is UserLookup => Boolean(user))

    const foundIds = new Set(found.map((user) => user.user_id))
    const missing = ids.filter((id) => !foundIds.has(id))

    if (missing.length === 0) return found

    const recovered: UserLookup[] = []
    const BATCH = 10
    for (let i = 0; i < missing.length; i += BATCH) {
      const slice = missing.slice(i, i + BATCH)
      const results = await Promise.all(
        slice.map(async (userId) => {
          try {
            const one = await fetch(`${BACKEND_URL}/user/find`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user_id: userId }),
            })
            if (!one.ok) return null
            const oneRaw = JSON.parse(quoteSnowflakes(await one.text())) as
              | Record<string, unknown>
              | null
            if (!oneRaw) return null
            return normalizeUser(oneRaw)
          } catch {
            return null
          }
        })
      )
      recovered.push(...results.filter((user): user is UserLookup => Boolean(user)))
    }

    return [...found, ...recovered]
  } catch {
    return []
  }
}

export async function findGuild(idx: string): Promise<GuildLookup | null> {
  if (!/^\d{5,}$/.test(idx)) return null

  try {
    const res = await fetch(`${BACKEND_URL}/guild/find?idx=${encodeURIComponent(idx)}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return (await res.json()) as GuildLookup
  } catch {
    return null
  }
}
