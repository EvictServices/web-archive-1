import { NextResponse } from 'next/server'

type UserData = {
  user_id: string
  username?: string
  display_name?: string
  avatar?: string | null
}

function normalizeUser(raw: Record<string, unknown>): UserData | null {
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

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const ids: string[] = Array.isArray(body.user_ids)
      ? body.user_ids.map((id: unknown) => String(id)).filter((id: string) => /^\d{5,}$/.test(id))
      : []
    if (ids.length === 0) return NextResponse.json([], { status: 200 })

    const res = await fetch('http://127.0.0.1:8000/users/find', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_ids: ids }),
    })
    if (!res.ok) {
      return NextResponse.json([], { status: 200 })
    }

    const raw = await res.text()
    const parsed: Record<string, unknown>[] = JSON.parse(
      raw.replace(/"user_id"\s*:\s*(\d+)/g, '"user_id":"$1"')
    )
    const found = parsed
      .map(normalizeUser)
      .filter((user): user is UserData => Boolean(user))

    const foundIds = new Set(found.map((user) => user.user_id))
    const missing = ids.filter((id) => !foundIds.has(id))

    if (missing.length === 0) {
      return NextResponse.json(found)
    }

    const recovered: UserData[] = []
    const BATCH = 10
    for (let i = 0; i < missing.length; i += BATCH) {
      const slice = missing.slice(i, i + BATCH)
      const results = await Promise.all(
        slice.map(async (userId) => {
          try {
            const one = await fetch('http://127.0.0.1:8000/user/find', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user_id: userId }),
            })
            if (!one.ok) return null
            const oneText = await one.text()
            const oneRaw = JSON.parse(
              oneText.replace(/"user_id"\s*:\s*(\d+)/g, '"user_id":"$1"')
            ) as Record<string, unknown> | null
            if (!oneRaw) return null
            return normalizeUser(oneRaw)
          } catch {
            return null
          }
        })
      )
      recovered.push(...results.filter((user): user is UserData => Boolean(user)))
    }

    return NextResponse.json([...found, ...recovered])
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
