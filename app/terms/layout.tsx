import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Evict • Terms of Service',
  description: 'Terms of service for using Evict.',
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
