const CDN_URL = 'https://cdn.azron.net'

export function getCdnApiKey(): string {
  return process.env.CDN_API_KEY ?? ''
}

export function getCdnUrl(path: string): string {
  return `${CDN_URL}${path.startsWith('/') ? path : `/${path}`}`
}
