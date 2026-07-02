import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Evict • Ticket Transcript',
  description: 'View a support ticket transcript.',
}

export default function TicketsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
