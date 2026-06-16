export const dynamic = 'force-dynamic'

export async function GET() {
  const res = await fetch('http://127.0.0.1:8000/commands', { cache: 'no-store' })
  if (!res.ok) {
    return Response.json({ error: 'unreachable' }, { status: 503 })
  }
  return Response.json(await res.json())
}
