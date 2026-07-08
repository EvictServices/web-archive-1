import type { IconType } from 'react-icons'

export function LegalLayout({
  sections,
  children,
}: {
  sections: { id: string; title: string }[]
  children: React.ReactNode
}) {
  return (
    <div className="mt-12 flex flex-col gap-12 lg:flex-row">
      <aside className="hidden lg:block lg:w-52 lg:flex-shrink-0">
        <div className="sticky top-24">
          <p className="mb-4 text-[11px] font-semibold tracking-[0.2em] text-accent uppercase">
            Contents
          </p>
          <nav className="space-y-0.5">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block rounded-lg px-3 py-1.5 text-[13px] text-white/45 transition-colors hover:bg-white/[0.04] hover:text-white/85"
              >
                {s.title}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <div className="space-y-4">{children}</div>
      </main>
    </div>
  )
}

export function LegalSection({
  id,
  Icon,
  title,
  children,
}: {
  id: string
  Icon: IconType
  title: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 rounded-3xl border border-white/[0.07] bg-card p-6 sm:p-8"
    >
      <div className="flex items-center gap-3.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10">
          <Icon className="h-4.5 w-4.5 text-accent" />
        </span>
        <h2 className="font-display text-lg font-semibold tracking-tight text-white">{title}</h2>
      </div>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-white/55">{children}</div>
    </section>
  )
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 rounded-xl border border-white/[0.05] bg-black/25 px-4 py-2.5 text-[13px] leading-relaxed text-white/60"
        >
          <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent/70" />
          {item}
        </li>
      ))}
    </ul>
  )
}

export function LegalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="font-medium text-accent underline decoration-accent/30 underline-offset-2 transition-colors hover:text-white"
    >
      {children}
    </a>
  )
}
