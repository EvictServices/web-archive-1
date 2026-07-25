import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const grotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://evict.bot'),
  title: 'Evict',
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
    <html lang="en" className={`${inter.variable} ${grotesk.variable}`}>
      <body className="min-h-screen font-sans">
        {children}
      </body>
    </html>
  )
}
