import type { MetadataRoute } from 'next'

import { getApiUrl } from '@/lib/api-url'

const robots = (): MetadataRoute.Robots => {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${getApiUrl('/sitemap.xml')}`,
  }
}

export default robots
