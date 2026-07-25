import { BACKEND_URL } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export async function GET() {
  const res = await fetch(`${BACKEND_URL}/health`, { cache: 'no-store' })
  if (!res.ok) {
    return Response.json({ error: 'unreachable' }, { status: 503 })
  }
  return Response.json(await res.json())
}
