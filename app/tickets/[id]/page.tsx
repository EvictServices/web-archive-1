import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import TicketView from '@/components/tickets/TicketView'
import { fetchTicketTranscript, isValidTicketId } from '@/lib/tickets'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  return {
    title: id ? `Ticket #${id}` : 'Ticket Transcript',
  }
}

export default async function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  if (!isValidTicketId(id)) {
    notFound()
  }

  const ticketData = await fetchTicketTranscript(id)
  if (!ticketData) {
    notFound()
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="line-grid pointer-events-none absolute inset-0 opacity-10" />
      <Navbar />
      <TicketView ticketData={ticketData} ticketId={id} />
      <Footer />
    </div>
  )
}
