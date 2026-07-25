'use server'

import { type Command } from '@/types/command'
import { parseCommands } from '@/lib/commands'
import { BACKEND_URL } from '@/lib/constants'

export async function fetchCommands(): Promise<Command[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/commands`, { cache: 'no-store' })
    if (!res.ok) return []
    return parseCommands(await res.json())
  } catch {
    return []
  }
}
