import { getCdnApiKey, getCdnUrl } from '@/lib/cdn'

export interface TicketMessage {
  id: string
  author_id: string
  content: string
  timestamp: string
  edited_timestamp: string | null
  pinned: boolean
}

export interface TicketUser {
  id: string
  username: string
  global_name: string | null
  discriminator: string
  avatar: string | null
  bot: boolean
}

export interface TicketAttachment {
  filename: string
  url: string
  file_size: number
  message_id: string
}

export interface TicketEmbed {
  author: { icon_url: string | null; name: string | null; url: string | null } | null
  color: string | null
  description: string | null
  fields: { name: string; value: string; inline: boolean }[]
  footer: { icon_url: string | null; text: string | null } | null
  image: { url: string | null } | null
  message_id: string
  thumbnail: { url: string | null } | null
  timestamp: string | null
  title: string | null
  url: string | null
}

export interface TicketTranscript {
  messages: TicketMessage[]
  users: TicketUser[]
  attachments: TicketAttachment[]
  embeds: TicketEmbed[]
  ticket: {
    reason: string | null
    closed_by_id: string | null
    opened_by_id: string | null
    closed_at: string | null
  }
  channel: {
    name: string
    created_at: string
  }
}

export interface TicketTranscriptResponse {
  ticket: TicketTranscript
  people: string[]
}

const TICKET_ID_RE = /^[a-f0-9]{16}$/i

export function isValidTicketId(id: string): boolean {
  return TICKET_ID_RE.test(id)
}

export function parseTicketJson(raw: string): TicketTranscriptResponse {
  const safe = raw.replace(
    /"(id|author_id|opened_by_id|closed_by_id|channel_id|guild_id|message_id)"\s*:\s*(\d{16,})/g,
    '"$1":"$2"',
  )
  return JSON.parse(safe) as TicketTranscriptResponse
}

export async function fetchTicketTranscript(id: string): Promise<TicketTranscriptResponse | null> {
  if (!isValidTicketId(id)) return null

  try {
    const res = await fetch(getCdnUrl('/api/tickets/fetch'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getCdnApiKey()}`,
      },
      body: JSON.stringify({ id, bot: 'evict' }),
      next: { revalidate: 300 },
    })

    if (!res.ok) return null

    const data = parseTicketJson(await res.text())
    return data?.ticket ? data : null
  } catch {
    return null
  }
}
