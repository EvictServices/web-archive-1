import { NextResponse } from 'next/server'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const res = await fetch(`https://cdn.azron.net/avatars/${id}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) {
      return NextResponse.json({ avatars: [] }, { status: 200 })
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ avatars: [] }, { status: 200 })
  }
}
