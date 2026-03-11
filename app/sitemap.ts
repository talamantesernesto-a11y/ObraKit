import type { MetadataRoute } from 'next'
import { getAllStateSlugs } from '@/lib/waivers/state-slugs'

export default function sitemap(): MetadataRoute.Sitemap {
  const statePages = getAllStateSlugs().map((slug) => ({
    url: `https://obrakit.ai/lien-waivers/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: 'https://obrakit.ai',
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: 'https://obrakit.ai/signup',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: 'https://obrakit.ai/login',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: 'https://obrakit.ai/lien-waivers',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    ...statePages,
  ]
}
