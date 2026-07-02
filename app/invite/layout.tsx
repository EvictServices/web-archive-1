import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Evict • Invite',
  description: 'Add Evict to your Discord server.',
}

export default function InviteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
