const CDN_URL = 'https://cdn.azron.net'

const DEFAULT_CDN_API_KEY = 'cdn_9a4e7b1d0f2c4e6a8d3b5c7f1e2a9b4c'

export function getCdnApiKey(): string {
  return process.env.CDN_API_KEY ?? DEFAULT_CDN_API_KEY
}

export function getCdnUrl(path: string): string {
  return `${CDN_URL}${path.startsWith('/') ? path : `/${path}`}`
}
