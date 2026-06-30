export const BUTTON_STYLES = [
  { value: 'link', label: 'Link (Blurple)' },
  { value: 'green', label: 'Green' },
  { value: 'red', label: 'Red' },
  { value: 'gray', label: 'Gray' },
]

export const BUTTON_STYLE_COLORS: Record<string, string> = {
  link: '#5865f2',
  green: '#57f287',
  red: '#ed4245',
  gray: '#4f545c',
}

export const VARIABLE_CATEGORIES = [
  { category: 'User', vars: [
    { name: '{user}', desc: 'User mention' },
    { name: '{user.mention}', desc: 'User mention' },
    { name: '{user.name}', desc: 'Username' },
    { name: '{user.display_name}', desc: 'Display name' },
    { name: '{user.id}', desc: 'User ID' },
    { name: '{user.avatar}', desc: 'Avatar URL' },
    { name: '{user.created_at}', desc: 'Creation date' },
  ]},
  { category: 'Guild', vars: [
    { name: '{guild.name}', desc: 'Server name' },
    { name: '{guild.id}', desc: 'Server ID' },
    { name: '{guild.icon}', desc: 'Icon URL' },
    { name: '{guild.member_count}', desc: 'Member count' },
    { name: '{guild.boost_count}', desc: 'Boost count' },
  ]},
  { category: 'Channel', vars: [
    { name: '{channel.name}', desc: 'Channel name' },
    { name: '{channel.id}', desc: 'Channel ID' },
    { name: '{channel.mention}', desc: 'Channel mention' },
    { name: '{channel.topic}', desc: 'Channel topic' },
  ]},
  { category: 'Role', vars: [
    { name: '{role}', desc: 'Role mention' },
    { name: '{role.mention}', desc: 'Role mention' },
    { name: '{role.name}', desc: 'Role name' },
    { name: '{role.id}', desc: 'Role ID' },
    { name: '{role.color}', desc: 'Role color' },
    { name: '{role.position}', desc: 'Role position' },
    { name: '{role.member_count}', desc: 'Members with role' },
  ]},
]

export const ALL_VARIABLES = VARIABLE_CATEGORIES.flatMap((c) => c.vars)
