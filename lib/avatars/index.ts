export type AvatarRecord = {
  id: number
  url: string
  created_at: number
}

export type AvatarUserInfo = {
  display_name?: string
  username?: string
  avatar?: string | null
}

const CDN = 'https://cdn.discordapp.com'

function defaultUserAvatarIndex(userId: string): number {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash + userId.charCodeAt(i)) | 0
  }
  return Math.abs(hash) % 6
}

export function userAvatarUrl(
  userId: string,
  avatarHash: string | null | undefined,
  size = 128
): string {
  const raw = avatarHash?.trim()
  if (!raw) {
    return `${CDN}/embed/avatars/${defaultUserAvatarIndex(userId)}.png`
  }
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    try {
      const url = new URL(raw)
      url.searchParams.set('size', String(size))
      return url.toString()
    } catch {
      return raw
    }
  }
  const ext = raw.startsWith('a_') ? 'gif' : 'webp'
  return `${CDN}/avatars/${userId}/${raw}.${ext}?size=${size}`
}

export function avatarThumbUrl(url: string, size = 160): string {
  try {
    const u = new URL(url)
    const host = u.hostname.toLowerCase()
    if (host.includes('discordapp.com') || host.includes('discord.com')) {
      u.searchParams.set('size', String(size))
      return u.toString()
    }
    return url
  } catch {
    return url
  }
}

export function formatFullDate(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeTime(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000)
  const diff = now - timestamp
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`
  return `${Math.floor(diff / 31536000)}y ago`
}

export function sortAvatarsNewestFirst(avatars: AvatarRecord[]): AvatarRecord[] {
  return [...avatars].sort((a, b) => b.id - a.id)
}
