import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const idx = new URL(req.url).searchParams.get('idx')
  if (!idx || !/^\d{5,}$/.test(idx)) {
    return NextResponse.json({ error: 'invalid_id' }, { status: 400 })
  }

  try {
    const res = await fetch(
      `http://127.0.0.1:8000/guild/find?idx=${encodeURIComponent(idx)}`,
      { cache: 'no-store' },
    )
    if (!res.ok) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 })
    }
    return NextResponse.json(await res.json())
  } catch {
    return NextResponse.json({ error: 'unreachable' }, { status: 503 })
  }
}
