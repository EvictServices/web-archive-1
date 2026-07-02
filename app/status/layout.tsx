import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Evict • Status',
  description: 'View the current status of the bot.',
}

export default function StatusLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
