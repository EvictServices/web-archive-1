'use client'

import { useState, useEffect } from 'react'

interface UserData {
  user_id: string
  username: string
  display_name: string
  avatar: string | null
}

const cache: Record<string, UserData> = {}
let batchIds: Set<string> = new Set()
let batchPromise: Promise<void> | null = null
let batchResolvers: (() => void)[] = []

function scheduleBatch(): Promise<void> {
  return new Promise<void>((resolve) => {
    batchResolvers.push(resolve)

    if (!batchPromise) {
      batchPromise = new Promise<void>((batchResolve) => {
        setTimeout(() => {
          const ids = [...batchIds].filter((id) => !cache[id])
          batchIds = new Set()
          const resolvers = [...batchResolvers]
          batchResolvers = []
          batchPromise = null

          if (ids.length === 0) {
            resolvers.forEach((r) => r())
            batchResolve()
            return
          }

          fetch('/api/users/find', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_ids: ids }),
          })
            .then((r) => r.json())
            .then((data: UserData[]) => {
              for (const u of data) {
                if (u.user_id) cache[u.user_id] = u
              }
            })
            .catch(() => {})
            .finally(() => {
              resolvers.forEach((r) => r())
              batchResolve()
            })
        }, 0)
      })
    }
  })
}

export function useUsers(ids: string[]): Record<string, UserData> {
  const [users, setUsers] = useState<Record<string, UserData>>(() => {
    const out: Record<string, UserData> = {}
    for (const id of ids) {
      if (cache[id]) out[id] = cache[id]
    }
    return out
  })

  useEffect(() => {
    const missing = ids.filter((id) => !cache[id])
    if (missing.length === 0) {
      const out: Record<string, UserData> = {}
      for (const id of ids) {
        if (cache[id]) out[id] = cache[id]
      }
      setUsers(out)
      return
    }

    for (const id of missing) {
      batchIds.add(id)
    }

    scheduleBatch().then(() => {
      const out: Record<string, UserData> = {}
      for (const id of ids) {
        if (cache[id]) out[id] = cache[id]
      }
      setUsers(out)
    })
  }, [ids.join(',')])

  return users
}
