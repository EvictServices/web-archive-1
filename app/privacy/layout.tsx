import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Evict • Privacy Policy',
  description: 'Privacy policy for Evict and this website.',
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
