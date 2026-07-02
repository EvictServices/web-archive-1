import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Evict',
  description: 'The all-in-one solution for seamless server management — powerful, polished, and visually refined.',
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
