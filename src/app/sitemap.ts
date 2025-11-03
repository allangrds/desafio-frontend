import type { MetadataRoute } from 'next'

import { getApiUrl } from '@/lib/api-url'

const sitemap = (): MetadataRoute.Sitemap => {
  return [
    {
      url: getApiUrl('/'),
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: getApiUrl('/results'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: getApiUrl('/upload'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]
}

export default sitemap
