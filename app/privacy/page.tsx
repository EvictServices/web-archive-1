import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import PageHeader, { PAGE_TOP_PADDING, PAGE_X_PADDING } from '@/components/ui/PageHeader'

const sections = [
  { id: 'overview', title: 'Overview' },
  { id: 'collection', title: 'Information We Collect' },
  { id: 'usage', title: 'How We Use Data' },
  { id: 'sharing', title: 'Data Sharing' },
  { id: 'removal', title: 'Data Removal' },
  { id: 'storage', title: 'Storage & Backups' },
  { id: 'changes', title: 'Changes' },
]

export default function PrivacyPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="line-grid absolute inset-0 opacity-10" />
      <Navbar />

      <div className="relative flex-1">
        <div className={`mx-auto max-w-5xl pb-24 ${PAGE_X_PADDING} ${PAGE_TOP_PADDING}`}>
          <PageHeader
            label="Legal"
            title="Privacy Policy"
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
                <section id="overview">
                  <h2 className="mb-3 text-[13px] font-semibold tracking-tight text-white">Overview</h2>
                  <p className="text-[12px] leading-7 text-white/60">
                    Any information we collect is not used in any malicious manner. If
                    anything shown seems misleading, please contact us at{" "}
                    <a href="mailto:legal@azron.net" className="text-accent/70 underline decoration-accent/20 underline-offset-2 transition-colors hover:text-accent">
                      legal@azron.net
                    </a>
                  </p>
                </section>

                <section id="collection" className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-5">
                  <h2 className="mb-3 text-[13px] font-semibold tracking-tight text-white">Information We Collect</h2>
                  <ul className="space-y-2">
                    {[
                      'Guild IDs',
                      'Guild Names',
                      'Channel IDs',
                      'Role IDs',
                      'User IDs',
                      'Message Timestamps',
                      'Message IDs',
                      'Past Avatars',
                      'Nicknames and Usernames',
                      'Message content when a command is ran (stored for a max of 14 days)',
                      'Last deleted message content (stored for a max of 2 hours or less)',
                      'Last message edit history (stored for a max of 2 hours or less)',
                      'Last Emoji Reaction History (stored for a max of 2 hours or less)',
                    ].map((item) => (
                      <li key={item} className="flex gap-3 text-[12px] leading-7 text-white/60">
                        <span className="mt-2.5 h-1 w-1 flex-shrink-0 rounded-full bg-accent/40" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                <section id="usage">
                  <h2 className="mb-3 text-[13px] font-semibold tracking-tight text-white">How We Use Data</h2>
                  <p className="text-[12px] leading-7 text-white/60">
                    When a command is invoked, we store the message content for a maximum of 14 days
                    for debugging purposes. We also store a maximum of 18 entries for edited messages
                    and sniping messages that will expire in two hours or less in volatile memory.
                  </p>
                  <p className="mt-4 text-[12px] leading-7 text-white/60">
                    Guild IDs, Channel IDs, Role IDs, User IDs and Message IDs are all stored for our
                    system to aggregate values to find data.
                  </p>
                  <p className="mt-4 text-[12px] leading-7 text-white/60">
                    Nickname, Username and Avatar changes are logged in order for the &quot;namehistory&quot;
                    and &quot;avatarhistory&quot; commands to function. Users can clear this data themselves at
                    any time.
                  </p>
                  <p className="mt-4 text-[12px] leading-7 text-white/60">
                    Guild name changes are logged in order for the &quot;gnames&quot; command to function.
                    Server administrators can clear this data themselves at any time.
                  </p>
                </section>

                <section id="sharing">
                  <h2 className="mb-3 text-[13px] font-semibold tracking-tight text-white">Data Sharing</h2>
                  <p className="text-[12px] leading-7 text-white/60">
                    We do not sell or expose your information to others, and, or third parties.
                  </p>
                </section>

                <section id="removal" className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-5">
                  <h2 className="mb-3 text-[13px] font-semibold tracking-tight text-white">Data Removal</h2>
                  <p className="text-[12px] leading-7 text-white/60">
                    Email{" "}
                    <a href="mailto:legal@azron.net" className="text-accent/70 underline decoration-accent/20 underline-offset-2 transition-colors hover:text-accent">
                      legal@azron.net
                    </a>{" "}
                    for all of your data that we are currently storing. Response times may vary and could take up to 7 days.
                  </p>
                </section>

                <section id="storage">
                  <h2 className="mb-3 text-[13px] font-semibold tracking-tight text-white">Data Storage and Backups</h2>
                  <p className="text-[12px] leading-7 text-white/60">
                    Our primary data storage is located in Ashburn, Virginia. For redundancy and
                    disaster recovery, we maintain replicated backups across data centers in
                    Secaucus, New Jersey.
                  </p>
                </section>

                <section id="changes">
                  <h2 className="mb-3 text-[13px] font-semibold tracking-tight text-white">Changes to the Privacy Policy</h2>
                  <p className="text-[12px] leading-7 text-white/60">
                    We can update these terms at any time without notice. Continuing to use our
                    services after any changes will mean that you agree with these terms and
                    violation of our terms of service could result in a permanent ban across all of
                    our services.
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
