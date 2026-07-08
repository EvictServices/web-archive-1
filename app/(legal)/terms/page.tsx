import {
  TbAlertTriangle,
  TbBan,
  TbFileText,
  TbRefresh,
  TbRobot,
  TbScale,
  TbWorld,
} from 'react-icons/tb'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import PageHeader from '@/components/ui/PageHeader'
import { LegalLayout, LegalLink, LegalList, LegalSection } from '@/components/legal/LegalPage'
import { PAGE_TOP_PADDING, PAGE_X_PADDING } from '@/lib/pageLayout'

const sections = [
  { id: 'agreement', title: 'Agreement' },
  { id: 'disclaimer', title: 'Disclaimer' },
  { id: 'website', title: 'Website usage' },
  { id: 'bot', title: 'Bot usage' },
  { id: 'termination', title: 'Termination' },
  { id: 'indemnity', title: 'Indemnity' },
  { id: 'changes', title: 'Changes' },
]

export default function TermsPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />

      <div className="relative flex-1">
        <div className={`mx-auto max-w-5xl pb-24 ${PAGE_X_PADDING} ${PAGE_TOP_PADDING}`}>
          <PageHeader
            label="The fine print"
            title="Terms of Service"
            description="Last updated March 30, 2026"
          />

          <LegalLayout sections={sections}>
            <LegalSection id="agreement" Icon={TbFileText} title="Agreement">
              <p>
                By visiting (&quot;Evict&quot;) or inviting (&quot;Evict Bot&quot;) to your Discord
                or logging into our website (&quot;evict.bot&quot;), you agree and consent to the
                terms displayed on this page, including our policies (Privacy Policy). When we
                state &quot;Evict&quot;, &quot;we&quot;, &quot;us&quot;, and &quot;our&quot; in
                these terms, we mean Evict, operated by Azron, LLC. &quot;Services&quot; refers to
                the services provided by Evict to users.
              </p>
              <p>
                If any information stated here seems misleading, please contact us at{' '}
                <LegalLink href="mailto:legal@azron.net">legal@azron.net</LegalLink>
              </p>
            </LegalSection>

            <LegalSection id="disclaimer" Icon={TbAlertTriangle} title="Disclaimer">
              <p>
                You may not use Evict to violate any applicable laws or regulations as well as
                Discord&apos;s Terms of Service and Community Guidelines. If you encounter
                individuals or communities doing so, please send an email to{' '}
                <LegalLink href="mailto:legal@azron.net">legal@azron.net</LegalLink>. If you are
                refunded under any circumstances, your Discord account may be subject to blacklist
                and a ban from all of our services.
              </p>
            </LegalSection>

            <LegalSection id="website" Icon={TbWorld} title="Evict website usage">
              <p>
                You are required to be compliant with the terms shown on this page. You are not to
                do any of the following:
              </p>
              <LegalList
                items={[
                  'Malicious attempts of exploiting the website.',
                  'Malicious use of the website.',
                  'Scraping content on this website for malicious use.',
                  'Framing a portion or all of the website.',
                  "Copy Evict's website and claiming it as your own work.",
                  'Commands labeled as 18+ shall only be used by users 18+, anybody under 18 using these commands are subject to blacklist.',
                ]}
              />
            </LegalSection>

            <LegalSection id="bot" Icon={TbRobot} title="Evict bot usage">
              <p>You are not to do any of the following:</p>
              <LegalList
                items={[
                  'Violate the Discord Terms of Service.',
                  "Copy Evict's services or features.",
                  "Assist anyone in copying Evict's services or features.",
                  'Abuse or exploit Evict or any of our services.',
                  'Run a Discord Server that has been terminated repeatedly.',
                ]}
              />
            </LegalSection>

            <LegalSection id="termination" Icon={TbBan} title="Termination">
              <p>
                We reserve the right to terminate your access to our services immediately (under
                our sole discretion) without prior notice or liability for any reason (including,
                but not limited to, a breach of the terms).
              </p>
            </LegalSection>

            <LegalSection id="indemnity" Icon={TbScale} title="Indemnity">
              <p>
                You shall indemnify us against all liabilities, costs, expenses, damages and losses
                (including any direct, indirect or consequential losses, loss of profit, loss of
                reputation and all interest, penalties and legal and other reasonable professional
                costs and expenses) suffered or incurred by you arising out of or in connection
                with your use of the service, or a breach of the terms.
              </p>
            </LegalSection>

            <LegalSection id="changes" Icon={TbRefresh} title="Changes to the Terms of Service">
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
