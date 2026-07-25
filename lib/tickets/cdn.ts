import { CDN_URL } from '@/lib/constants'

export function getCdnApiKey(): string {
  return process.env.CDN_API_KEY ?? ''
}

export function getCdnUrl(path: string): string {
  return `${CDN_URL}${path.startsWith('/') ? path : `/${path}`}`
}
