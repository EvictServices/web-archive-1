import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Evict • Embed Builder',
  description: 'Design embeds visually and copy the generated script for your server.',
}

export default function EmbedsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
