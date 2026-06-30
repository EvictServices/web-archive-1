import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const ids: string[] = body.user_ids || []

    const res = await fetch('http://127.0.0.1:8000/users/find', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_ids: ids }),
    })
    if (!res.ok) {
      return NextResponse.json([], { status: 200 })
    }

    const raw = await res.text()
    const data: Record<string, unknown>[] = JSON.parse(
      raw.replace(/"user_id"\s*:\s*(\d+)/g, '"user_id":"$1"')
    )

    return NextResponse.json(data)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}
