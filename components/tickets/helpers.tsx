import type { TicketUser as User } from '@/lib/tickets'

const linkClass = 'text-[#00a8fc] hover:underline break-all'

function Link({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
      {children}
    </a>
  )
}

function linkifyPlainText(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  const urlRegex = /https?:\/\/[^\s<>\]},)]+/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }
    const url = match[0]
    nodes.push(
      <Link key={`${keyPrefix}-url-${match.index}`} href={url}>
        {url}
      </Link>,
    )
    lastIndex = match.index + url.length
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes.length > 0 ? nodes : [text]
}

export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  const isYesterday = new Date(now.getTime() - 86400000).toDateString() === date.toDateString()
  const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })

  if (isToday) return `Today at ${time}`
  if (isYesterday) return `Yesterday at ${time}`
  return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) + ` ${time}`
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(2) + ' MB'
}

export function getFallbackAvatar(discriminator?: string): string {
  const disc = Number(discriminator || '0')
  const index = Number.isFinite(disc) ? Math.abs(disc) % 5 : 0
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`
}

export function getAvatarUrl(user: User): string {
  return user.avatar || getFallbackAvatar(user.discriminator)
}

export function getInvolvedLabel(user: User | undefined): string {
  if (!user) return 'Unknown (@unknown)'
  const handle = user.username.split('#')[0].toLowerCase()
  const display = (user.global_name || user.username.split('#')[0]).trim()
  return `${display} (@${handle})`
}

export function parseContent(content: string, userMap: Map<string, User>): React.ReactNode[] {
  const mentionStyle: React.CSSProperties = {
    background: 'rgba(88, 101, 242, 0.3)',
    color: '#dee0fc',
    borderRadius: '3px',
    padding: '0 2px',
    fontWeight: 500,
    cursor: 'default',
  }
  const codeBlockStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '4px',
    padding: '0.5rem',
    fontFamily: 'Consolas, Monaco, monospace',
    fontSize: '0.875rem',
    display: 'block',
    whiteSpace: 'pre',
    overflowX: 'auto',
    margin: '0.25rem 0',
  }
  const inlineCodeStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '3px',
    padding: '0.1rem 0.3rem',
    fontFamily: 'Consolas, Monaco, monospace',
    fontSize: '0.85em',
  }

  const codeBlockRegex = /```(?:\w+)?\n?([\s\S]*?)```/g
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  const processInline = (text: string, keyPrefix: string): React.ReactNode[] => {
    const nodes: React.ReactNode[] = []
    const inlineRegex =
      /(<@!?(\d+)>)|(<#(\d+)>)|(<@&(\d+)>)|(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\))|(<(https?:\/\/[^>]+)>)|(`([^`]+)`)|(\_\_(.+?)\_\_)|(\.{2}(.+?)\.{2})|(\*\*\*(.+?)\*\*\*)|(\*\*(.+?)\*\*)|(\*(.+?)\*)|(~~(.+?)~~)|(\|\|(.+?)\|\|)/g
    let inlineLastIndex = 0
    let inlineMatch: RegExpExecArray | null

    while ((inlineMatch = inlineRegex.exec(text)) !== null) {
      if (inlineMatch.index > inlineLastIndex) {
        nodes.push(...linkifyPlainText(text.slice(inlineLastIndex, inlineMatch.index), `${keyPrefix}-${inlineLastIndex}`))
      }

      const key = `${keyPrefix}-${inlineMatch.index}`

      if (inlineMatch[1]) {
        const userId = inlineMatch[2]
        const user = userMap.get(userId)
        const name = user ? (user.global_name || user.username) : 'Unknown User'
        nodes.push(<span key={key} style={mentionStyle}>@{name}</span>)
      } else if (inlineMatch[3]) {
        nodes.push(<span key={key} style={mentionStyle}>#channel</span>)
      } else if (inlineMatch[5]) {
        nodes.push(<span key={key} style={mentionStyle}>@role</span>)
      } else if (inlineMatch[7]) {
        nodes.push(
          <Link key={key} href={inlineMatch[9]}>
            {inlineMatch[8]}
          </Link>,
        )
      } else if (inlineMatch[10]) {
        nodes.push(
          <Link key={key} href={inlineMatch[11]}>
            {inlineMatch[11]}
          </Link>,
        )
      } else if (inlineMatch[12]) {
        nodes.push(<code key={key} style={inlineCodeStyle}>{inlineMatch[13]}</code>)
      } else if (inlineMatch[14]) {
        nodes.push(<u key={key}>{inlineMatch[15]}</u>)
      } else if (inlineMatch[16]) {
        nodes.push(
          <span key={key} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '3px', padding: '0 2px', cursor: 'pointer' }}>
            {inlineMatch[17]}
          </span>
        )
      } else if (inlineMatch[18]) {
        nodes.push(<strong key={key}><em>{inlineMatch[19]}</em></strong>)
      } else if (inlineMatch[20]) {
        nodes.push(<strong key={key}>{inlineMatch[21]}</strong>)
      } else if (inlineMatch[22]) {
        nodes.push(<em key={key}>{inlineMatch[23]}</em>)
      } else if (inlineMatch[24]) {
        nodes.push(<s key={key}>{inlineMatch[25]}</s>)
      } else if (inlineMatch[26]) {
        nodes.push(
          <span key={key} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '3px', padding: '0 2px', cursor: 'pointer' }}>
            {inlineMatch[27]}
          </span>
        )
      }

      inlineLastIndex = inlineMatch.index + inlineMatch[0].length
    }

    if (inlineLastIndex < text.length) {
      nodes.push(...linkifyPlainText(text.slice(inlineLastIndex), `${keyPrefix}-end`))
    }

    return nodes.length > 0 ? nodes : [text]
  }

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(...processInline(content.slice(lastIndex, match.index), `pre-${lastIndex}`))
    }
    parts.push(
      <code key={`cb-${match.index}`} style={codeBlockStyle}>
        {match[1]}
      </code>
    )
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < content.length) {
    parts.push(...processInline(content.slice(lastIndex), `post-${lastIndex}`))
  }

  return parts
}

const contentCache = new Map<string, React.ReactNode[]>()
const CONTENT_CACHE_MAX = 512

export function parseContentCached(content: string, userMap: Map<string, User>): React.ReactNode[] {
  const mentionKey = [...content.matchAll(/<@!?(\d+)>/g)]
    .map((m) => {
      const u = userMap.get(m[1])
      return u ? `${m[1]}:${u.global_name || u.username}` : m[1]
    })
    .join('|')
  const key = `${content}\0${mentionKey}`

  const cached = contentCache.get(key)
  if (cached) return cached

  const parsed = parseContent(content, userMap)
  if (contentCache.size >= CONTENT_CACHE_MAX) {
    const first = contentCache.keys().next().value
    if (first) contentCache.delete(first)
  }
  contentCache.set(key, parsed)
  return parsed
}
