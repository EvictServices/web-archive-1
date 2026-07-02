import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Evict • Updates',
  description: 'Release notes and changelog for Evict.',
}

export default function UpdatesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
