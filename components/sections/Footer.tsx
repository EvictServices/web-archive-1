import Link from 'next/link'
import { SUPPORT_SERVER_URL } from '@/lib/constants'

const productLinks = [
  { label: 'Commands', href: '/commands' },
  { label: 'Status', href: '/status' },
  { label: 'Embeds', href: '/embed' },
  { label: 'Updates', href: '/updates' },
  { label: 'Documentation', href: '/docs' },
]

const communityLinks = [
  { label: 'Discord', href: SUPPORT_SERVER_URL },
  { label: 'Support', href: SUPPORT_SERVER_URL },
  { label: 'Feedback', href: SUPPORT_SERVER_URL },
]

const legalLinks = [
  { label: 'Terms', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Refunds', href: '/refunds' },
]

const groups = [
  { title: 'Product', items: productLinks },
  { title: 'Community', items: communityLinks },
  { title: 'Legal', items: legalLinks },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-20" />

      <div className="mx-auto max-w-6xl px-6 pt-16 pb-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/evict.png" alt="evict" className="h-6 w-6 rounded-full object-cover" />
              <span className="font-display text-sm font-semibold tracking-tight text-white">evict</span>
            </Link>
            <p className="mt-4 max-w-[240px] text-[13px] leading-relaxed text-white/45">
              The all-in-one solution for seamless server management — powerful, polished, and visually refined.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-12 gap-y-8">
            {groups.map((group) => (
              <div key={group.title}>
                <p className="mb-4 text-[11px] font-semibold tracking-[0.15em] text-white/70 uppercase">
                  {group.title}
                </p>
                <ul className="space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      {item.href.startsWith('/') ? (
                        <Link
                          href={item.href}
                          className="text-[13px] text-white/50 transition-colors hover:text-white/90"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[13px] text-white/50 transition-colors hover:text-white/90"
                        >
                          {item.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-white/40">
            &copy; 2026 evict.bot All rights reserved.
          </p>
          <a
            href="https://azron.net"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/40 transition-colors hover:text-white/70"
          >
            Operated by Azron, LLC (1480587)
          </a>
        </div>
      </div>
    </footer>
  )
}
