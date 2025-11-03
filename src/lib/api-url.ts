export function getApiUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL

  if (baseUrl) {
    return `${baseUrl}${path}`
  }

  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const host = process.env.VERCEL_URL || 'localhost:3000'

  return `${protocol}://${host}${path}`
}
