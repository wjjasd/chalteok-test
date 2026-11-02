import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        // 공유·OG 이미지(/api/og/)는 검색엔진·SNS 크롤러가 가져갈 수 있어야 한다 (더 긴 경로 규칙이 우선)
        allow: ['/', '/api/og/'],
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://chalteok.com/sitemap.xml',
  }
}
