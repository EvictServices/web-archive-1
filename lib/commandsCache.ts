import { type Command } from '@/types/command'
import { parseCommands } from '@/lib/commands'

const STORAGE_KEY = 'evict:commands'

let memoryCache: Command[] | null = null
let inflight: Promise<Command[]> | null = null

function readSessionCache(): Command[] | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Command[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null
  } catch {
    return null
  }
}

function writeSessionCache(commands: Command[]) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(commands))
  } catch {}
}

export function fetchCommandsCached(): Promise<Command[]> {
  if (memoryCache) return Promise.resolve(memoryCache)

  const session = readSessionCache()
  if (session) {
    memoryCache = session
    return Promise.resolve(session)
  }

  if (inflight) return inflight

  inflight = fetch('/api/commands')
    .then((r) => (r.ok ? r.json() : { data: { commands: {} } }))
    .then((parsed) => {
      const cmds = parseCommands(parsed)
      memoryCache = cmds
      writeSessionCache(cmds)
      return cmds
    })
    .finally(() => {
      inflight = null
    })

  return inflight
}

export type CommandsIndex = {
  byCategory: Map<string, Command[]>
  byName: Map<string, Command>
  categories: string[]
  counts: Record<string, number>
  displayCounts: Record<string, string>
  grouped: [string, Command[]][]
  searchText: Map<string, string>
}

export function buildCommandsIndex(commands: Command[]): CommandsIndex {
  const byCategory = new Map<string, Command[]>()
  const byName = new Map<string, Command>()
  const searchText = new Map<string, string>()
  const categories: string[] = []
  const counts: Record<string, number> = {}

  for (const cmd of commands) {
    byName.set(cmd.name, cmd)
    searchText.set(cmd.name, `${cmd.name} ${cmd.description}`.toLowerCase())

    let list = byCategory.get(cmd.category)
    if (!list) {
      list = []
      byCategory.set(cmd.category, list)
      categories.push(cmd.category)
    }
    list.push(cmd)
    counts[cmd.category] = (counts[cmd.category] || 0) + 1
  }

  categories.sort()

  const displayCounts: Record<string, string> = { all: String(commands.length) }
  for (const cat of categories) {
    displayCounts[cat] = String(counts[cat] ?? 0)
  }

  const grouped = [...byCategory.entries()].sort(([a], [b]) => a.localeCompare(b))

  return { byCategory, byName, categories, counts, displayCounts, grouped, searchText }
}

export function filterCommands(
  commands: Command[],
  query: string,
  searchText: Map<string, string>
): Command[] {
  const ql = query.trim().toLowerCase()
  if (!ql) return commands
  const out: Command[] = []
  for (const cmd of commands) {
    const text = searchText.get(cmd.name)
    if (text?.includes(ql)) out.push(cmd)
  }
  return out
}
