import type { MetadataRoute } from 'next'
import { listTests } from '@/content/tests'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://chalteok.com'
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/bond`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/attachment`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    ...listTests().map((t) => ({
      url: `${base}/t/${t.slug}`,
      lastModified: new Date(t.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]
}
