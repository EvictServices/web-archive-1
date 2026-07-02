import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Evict • Avatar History',
  description: 'View archived Discord avatar history.',
}

export default function AvatarsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
