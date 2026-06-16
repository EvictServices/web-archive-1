import { type Command } from '@/types/command'

export function formatUsage(cmd: Command, forCopy = false): string {
  const sig = cmd.signature?.trim() ?? ''
  let usage: string

  if (!sig) {
    usage = cmd.name
  } else if (sig.startsWith(cmd.name)) {
    usage = sig
  } else if (sig.startsWith(`;${cmd.name}`)) {
    usage = sig.slice(1)
  } else {
    usage = `${cmd.name} ${sig}`
  }

  if (!forCopy) return usage
  return usage.startsWith(';') ? usage : `;${usage}`
}

export function fmtPermissions(permissions: unknown): string {
  if (!permissions || !Array.isArray(permissions) || permissions.length === 0) return 'none'
  return permissions
    .flatMap((p) => (typeof p === 'string' ? [p] : typeof p === 'object' && p ? Object.keys(p) : []))
    .map((s) => s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
    .join(', ')
}

export function parseCommands(parsed: unknown): Command[] {
  const payload: unknown =
    (parsed as { data?: { commands?: unknown } })?.data?.commands ??
    (parsed as { commands?: unknown })?.commands ??
    parsed ??
    []
  const rawCmds: Command[] = []

  if (Array.isArray(payload)) {
    payload.forEach((group: unknown) => {
      if (!group || typeof group !== 'object') return
      const category =
        typeof (group as { category?: unknown }).category === 'string'
          ? (group as { category: string }).category
          : 'Uncategorized'
      const cmds = (group as { commands?: unknown }).commands
      if (!Array.isArray(cmds)) return
      cmds.forEach((cmd: unknown) => {
        rawCmds.push({ ...(cmd as object), category } as Command)
      })
    })
  }

  if (typeof payload === 'object' && payload && !Array.isArray(payload)) {
    Object.entries(payload as Record<string, unknown[]>).forEach(([category, cmds]) => {
      if (!Array.isArray(cmds)) return
      cmds.forEach((cmd: unknown) => {
        rawCmds.push({ ...(cmd as object), category } as Command)
      })
    })
  }

  const seen = new Set<string>()
  return rawCmds
    .filter(
      (c) =>
        !(c as { hidden?: boolean }).hidden &&
        (c.category || '').toLowerCase() !== 'jishaku' &&
        c.name !== 'help'
    )
    .map((c, i) => ({
      name:
        (c as { qualified_name?: string }).qualified_name || c.name || `cmd${i}`,
      description: c.description || (c as { help?: string }).help || '',
      category: c.category || 'Uncategorized',
      aliases: c.aliases || [],
      signature: c.signature || '',
      permissions: c.permissions || [],
      example: c.example || '',
    }))
    .filter((c) => {
      if (seen.has(c.name)) return false
      seen.add(c.name)
      return true
    })
}
