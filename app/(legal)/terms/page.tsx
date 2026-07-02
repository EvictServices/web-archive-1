import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import PageHeader from '@/components/ui/PageHeader'
import { PAGE_TOP_PADDING, PAGE_X_PADDING } from '@/lib/pageLayout'

const sections = [
  { id: 'agreement', title: 'Agreement' },
  { id: 'disclaimer', title: 'Disclaimer' },
  { id: 'website', title: 'Website Usage' },
  { id: 'bot', title: 'Bot Usage' },
  { id: 'termination', title: 'Termination' },
  { id: 'indemnity', title: 'Indemnity' },
  { id: 'changes', title: 'Changes' },
]

export default function TermsPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="line-grid absolute inset-0 opacity-10" />
      <Navbar />

      <div className="relative flex-1">
        <div className={`mx-auto max-w-5xl pb-24 ${PAGE_X_PADDING} ${PAGE_TOP_PADDING}`}>
          <PageHeader
            label="Legal"
            title="Terms of Service"
            description="Last updated March 30, 2026"
          />

          <div className="mt-12 flex flex-col gap-12 lg:flex-row">
            <aside className="hidden lg:block lg:w-48 lg:flex-shrink-0">
              <div className="sticky top-24">
                <p className="mb-3 text-[9px] font-medium tracking-[0.15em] text-white/60 uppercase">Contents</p>
                <nav className="space-y-1 border-l border-white/[0.06]">
                  {sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="block border-l-2 border-transparent pl-3 py-1 text-[11px] text-white/40 transition-all hover:border-accent/40 hover:text-white/70"
                    >
                      {s.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            <main className="flex-1">
              <div className="max-w-2xl space-y-10">
                <section id="agreement">
                  <h2 className="mb-3 text-[13px] font-semibold tracking-tight text-white">Agreement</h2>
                  <p className="text-[12px] leading-7 text-white/60">
                    By visiting (&quot;Evict&quot;) or inviting (&quot;Evict Bot&quot;) to your Discord
                    or logging into our website (&quot;evict.bot&quot;), you agree and consent to the terms displayed on this page,
                    including our policies (Privacy Policy).
                    When we state &quot;Evict&quot;, &quot;we&quot;, &quot;us&quot;, and &quot;our&quot; in these terms, we mean Evict,
                    operated by Azron, LLC. &quot;Services&quot; refers to the services provided by Evict to users.
                  </p>
                  <p className="mt-4 text-[12px] leading-7 text-white/60">
                    If any information stated here seems misleading, please contact us at{" "}
                    <a href="mailto:legal@azron.net" className="text-accent/70 underline decoration-accent/20 underline-offset-2 transition-colors hover:text-accent">
                      legal@azron.net
                    </a>
                  </p>
                </section>

                <section id="disclaimer" className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-5">
                  <h2 className="mb-3 text-[13px] font-semibold tracking-tight text-white">Disclaimer</h2>
                  <p className="text-[12px] leading-7 text-white/60">
                    You may not use Evict to violate any applicable laws or regulations
                    as well as Discord&apos;s Terms of Service and Community Guidelines. If
                    you encounter individuals or communities doing so, please send an
                    email to{" "}
                    <a href="mailto:legal@azron.net" className="text-accent/70 underline decoration-accent/20 underline-offset-2 transition-colors hover:text-accent">
                      legal@azron.net
                    </a>
                    . If you are refunded under any circumstances, your Discord account
                    may be subject to blacklist and a ban from all of our services.
                  </p>
                </section>

                <section id="website">
                  <h2 className="mb-3 text-[13px] font-semibold tracking-tight text-white">Evict Website Usage</h2>
                  <p className="text-[12px] leading-7 text-white/60">
                    You are required to be compliant with the terms shown on this page.
                    You are not to do any of the following:
                  </p>
                  <ul className="mt-3 space-y-2">
                    {[
                      'Malicious attempts of exploiting the website.',
                      'Malicious use of the website.',
                      'Scraping content on this website for malicious use.',
                      'Framing a portion or all of the website.',
                      'Copy Evict\'s website and claiming it as your own work.',
                      'Commands labeled as 18+ shall only be used by users 18+, anybody under 18 using these commands are subject to blacklist.',
                    ].map((item) => (
                      <li key={item} className="flex gap-3 text-[12px] leading-7 text-white/60">
                        <span className="mt-2.5 h-1 w-1 flex-shrink-0 rounded-full bg-accent/40" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                <section id="bot">
                  <h2 className="mb-3 text-[13px] font-semibold tracking-tight text-white">Evict Bot Usage</h2>
                  <p className="text-[12px] leading-7 text-white/60">
                    You are not to do any of the following:
                  </p>
                  <ul className="mt-3 space-y-2">
                    {[
                      'Violate the Discord Terms of Service.',
                      'Copy Evict\'s services or features.',
                      'Assist anyone in copying Evict\'s services or features.',
                      'Abuse or exploit Evict or any of our services.',
                      'Run a Discord Server that has been terminated repeatedly.',
                    ].map((item) => (
                      <li key={item} className="flex gap-3 text-[12px] leading-7 text-white/60">
                        <span className="mt-2.5 h-1 w-1 flex-shrink-0 rounded-full bg-accent/40" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                <section id="termination">
                  <h2 className="mb-3 text-[13px] font-semibold tracking-tight text-white">Termination</h2>
                  <p className="text-[12px] leading-7 text-white/60">
                    We reserve the right to terminate your access to our services
                    immediately (under our sole discretion) without prior notice or
                    liability for any reason (including, but not limited to, a breach of
                    the terms).
                  </p>
                </section>

                <section id="indemnity" className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-5">
                  <h2 className="mb-3 text-[13px] font-semibold tracking-tight text-white">Indemnity</h2>
                  <p className="text-[12px] leading-7 text-white/60">
                    You shall indemnify us against all liabilities, costs, expenses,
                    damages and losses (including any direct, indirect or consequential
                    losses, loss of profit, loss of reputation and all interest,
                    penalties and legal and other reasonable professional costs and
                    expenses) suffered or incurred by you arising out of or in
                    connection with your use of the service, or a breach of the terms.
                  </p>
                </section>

                <section id="changes">
                  <h2 className="mb-3 text-[13px] font-semibold tracking-tight text-white">Changes to the Terms of Service</h2>
                  <p className="text-[12px] leading-7 text-white/60">
                    We can update these terms at any time without notice. Continuing to
                    use our services after any changes will mean that you agree with these
                    terms and violation of our terms of service could result in a
                    permanent ban across all of our services.
                  </p>
                </section>
              </div>
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
