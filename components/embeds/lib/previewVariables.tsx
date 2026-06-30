import { type ReactNode } from 'react'

const SAMPLE = {
  user: 'user',
  displayName: 'User',
  role: 'Member',
  channel: 'general',
  guild: 'My Server',
  id: '123456789012345678',
  avatar: 'https://cdn.discordapp.com/avatars/123456789012345678/abc123.png',
  guildIcon: 'https://cdn.discordapp.com/icons/987654321098765432/icon.png',
  createdAt: 'Jan 1, 2020',
  memberCount: '1,234',
  boostCount: '12',
  roleColor: '#5865f2',
  rolePosition: '3',
  roleMemberCount: '42',
  topic: 'Welcome to the server!',
}

const PREVIEW_VALUES: Record<string, ReactNode> = {
  '{user}': null,
  '{user.mention}': null,
  '{user.name}': SAMPLE.user,
  '{user.display_name}': SAMPLE.displayName,
  '{user.id}': SAMPLE.id,
  '{user.avatar}': SAMPLE.avatar,
  '{user.created_at}': SAMPLE.createdAt,
  '{guild.name}': SAMPLE.guild,
  '{guild.id}': '987654321098765432',
  '{guild.icon}': SAMPLE.guildIcon,
  '{guild.member_count}': SAMPLE.memberCount,
  '{guild.boost_count}': SAMPLE.boostCount,
  '{channel.name}': SAMPLE.channel,
  '{channel.id}': '111222333444555666',
  '{channel.mention}': null,
  '{channel.topic}': SAMPLE.topic,
  '{role}': null,
  '{role.mention}': null,
  '{role.name}': SAMPLE.role,
  '{role.id}': '222333444555666777',
  '{role.color}': SAMPLE.roleColor,
  '{role.position}': SAMPLE.rolePosition,
  '{role.member_count}': SAMPLE.roleMemberCount,
}

function UserMention() {
  return (
    <span
      className="rounded-[3px] px-0.5 font-medium"
      style={{ backgroundColor: 'rgba(88, 101, 242, 0.35)', color: '#c9cdfb' }}
    >
      @{SAMPLE.user}
    </span>
  )
}

function RoleMention() {
  const color = SAMPLE.roleColor
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)
  return (
    <span
      className="rounded-[3px] px-0.5 font-medium"
      style={{ backgroundColor: `rgba(${r}, ${g}, ${b}, 0.35)`, color: '#dee0fc' }}
    >
      @{SAMPLE.role}
    </span>
  )
}

function ChannelMention() {
  return (
    <span
      className="rounded-[3px] px-0.5 font-medium"
      style={{ backgroundColor: 'rgba(88, 101, 242, 0.35)', color: '#c9cdfb' }}
    >
      #{SAMPLE.channel}
    </span>
  )
}

function renderVariable(token: string, key: number): ReactNode {
  if (token === '{user}' || token === '{user.mention}') return <UserMention key={key} />
  if (token === '{role}' || token === '{role.mention}') return <RoleMention key={key} />
  if (token === '{channel.mention}') return <ChannelMention key={key} />

  const value = PREVIEW_VALUES[token]
  if (value !== undefined && value !== null) return <span key={key}>{value}</span>

  return <span key={key}>{token}</span>
}

export function PreviewText({ text }: { text: string }) {
  const parts: ReactNode[] = []
  const regex = /\{[\w.]+\}/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    parts.push(renderVariable(match[0], key++))
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return <>{parts}</>
}
