import { redirect } from 'next/navigation'
import { DISCORD_INVITE_URL } from '@/lib/constants'

export default function InvitePage() {
  redirect(DISCORD_INVITE_URL)
}
