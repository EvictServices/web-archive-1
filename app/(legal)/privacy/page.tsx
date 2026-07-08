import {
  TbDatabase,
  TbEye,
  TbRefresh,
  TbServer,
  TbSettings,
  TbShare,
  TbTrash,
} from 'react-icons/tb'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import PageHeader from '@/components/ui/PageHeader'
import { LegalLayout, LegalLink, LegalList, LegalSection } from '@/components/legal/LegalPage'
import { PAGE_TOP_PADDING, PAGE_X_PADDING } from '@/lib/pageLayout'

const sections = [
  { id: 'overview', title: 'Overview' },
  { id: 'collection', title: 'Information we collect' },
  { id: 'usage', title: 'How we use data' },
  { id: 'sharing', title: 'Data sharing' },
  { id: 'removal', title: 'Data removal' },
  { id: 'storage', title: 'Storage & backups' },
  { id: 'changes', title: 'Changes' },
]

export default function PrivacyPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />

      <div className="relative flex-1">
        <div className={`mx-auto max-w-5xl pb-24 ${PAGE_X_PADDING} ${PAGE_TOP_PADDING}`}>
          <PageHeader
            label="What we do with your data"
            title="Privacy Policy"
            description="Last updated March 30, 2026"
          />

          <LegalLayout sections={sections}>
            <LegalSection id="overview" Icon={TbEye} title="Overview">
              <p>
                Any information we collect is not used in any malicious manner. If anything shown
                seems misleading, please contact us at{' '}
                <LegalLink href="mailto:legal@azron.net">legal@azron.net</LegalLink>
              </p>
            </LegalSection>

            <LegalSection id="collection" Icon={TbDatabase} title="Information we collect">
              <LegalList
                items={[
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
                ]}
              />
            </LegalSection>

            <LegalSection id="usage" Icon={TbSettings} title="How we use data">
              <p>
                When a command is invoked, we store the message content for a maximum of 14 days
                for debugging purposes. We also store a maximum of 18 entries for edited messages
                and sniping messages that will expire in two hours or less in volatile memory.
              </p>
              <p>
                Guild IDs, Channel IDs, Role IDs, User IDs and Message IDs are all stored for our
                system to aggregate values to find data.
              </p>
              <p>
                Nickname, Username and Avatar changes are logged in order for the
                &quot;namehistory&quot; and &quot;avatarhistory&quot; commands to function. Users
                can clear this data themselves at any time.
              </p>
              <p>
                Guild name changes are logged in order for the &quot;gnames&quot; command to
                function. Server administrators can clear this data themselves at any time.
              </p>
            </LegalSection>

            <LegalSection id="sharing" Icon={TbShare} title="Data sharing">
              <p>We do not sell or expose your information to others, and, or third parties.</p>
            </LegalSection>

            <LegalSection id="removal" Icon={TbTrash} title="Data removal">
              <p>
                Email <LegalLink href="mailto:legal@azron.net">legal@azron.net</LegalLink> for all
                of your data that we are currently storing. Response times may vary and could take
                up to 7 days.
              </p>
            </LegalSection>

            <LegalSection id="storage" Icon={TbServer} title="Data storage and backups">
              <p>
                Our primary data storage is located in Ashburn, Virginia. For redundancy and
                disaster recovery, we maintain replicated backups across data centers in Secaucus,
                New Jersey.
              </p>
            </LegalSection>

            <LegalSection id="changes" Icon={TbRefresh} title="Changes to the Privacy Policy">
              <p>
                We can update these terms at any time without notice. Continuing to use our
                services after any changes will mean that you agree with these terms and violation
                of our terms of service could result in a permanent ban across all of our services.
              </p>
            </LegalSection>
          </LegalLayout>
        </div>
      </div>

      <Footer />
    </div>
  )
}
