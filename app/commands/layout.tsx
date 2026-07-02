import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Evict • Commands',
  description: 'Browse all Evict bot commands by category.',
}

export default function CommandsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
