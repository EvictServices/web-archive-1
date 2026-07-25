import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AvatarsView from '@/components/avatars/AvatarsView'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import { sortAvatarsNewestFirst, type AvatarRecord, type AvatarUserInfo } from '@/lib/avatars'
import { BACKEND_URL, CDN_URL } from '@/lib/constants'

async function fetchAvatars(userId: string): Promise<AvatarRecord[]> {
  try {
    const res = await fetch(`${CDN_URL}/api/avatars/${userId}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data.avatars as AvatarRecord[]) ?? []
  } catch {
    return []
  }
}

async function fetchUserInfo(userId: string): Promise<AvatarUserInfo | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/user/find`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return (await res.json()) as AvatarUserInfo | null
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const userInfo = await fetchUserInfo(id)
  const username = userInfo?.display_name || userInfo?.username || null
  return {
    title: username ? `Evict • ${username} - Avatar History` : 'Evict • Avatar History',
  }
}

export default async function AvatarsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  if (!id || !/^\d+$/.test(id)) {
    notFound()
  }

  const [avatars, userInfo] = await Promise.all([
    fetchAvatars(id),
    fetchUserInfo(id),
  ])

  if (avatars.length === 0) {
    notFound()
  }

  const sortedAvatars = sortAvatarsNewestFirst(avatars)
  const username = userInfo?.display_name || userInfo?.username || null
  const avatarHash = userInfo?.avatar ?? null

  return (
    <>
      <Navbar />
      <AvatarsView
        avatars={sortedAvatars}
        userId={id}
        username={username}
        avatarHash={avatarHash}
      />
      <Footer />
    </>
  )
}
