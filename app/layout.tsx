import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://evict.bot'),
  title: {
    default: 'evict',
    template: '%s | Evict',
  },
  description: 'The all-in-one solution for seamless server management — powerful, polished, and visually refined.',
  openGraph: {
    title: 'Evict',
    description: 'The all-in-one solution for seamless server management — powerful, polished, and visually refined.',
    type: 'website',
    images: [{ url: '/evict.png', width: 512, height: 512 }],
  },
  twitter: {
    card: 'summary',
    title: 'Evict',
    description: 'The all-in-one solution for seamless server management — powerful, polished, and visually refined.',
    images: ['/evict.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#5f828d',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
