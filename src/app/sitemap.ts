import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://chalteok.com'
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/bond`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/attachment`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
  ]
}
