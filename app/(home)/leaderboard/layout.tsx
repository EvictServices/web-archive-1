import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Evict • Leaderboard',
  description: 'View server level rankings powered by the level schema.',
}

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
