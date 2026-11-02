import type { MetadataRoute } from 'next'
import { getCatalog, activeCategories } from '@/content/catalog'
import { SITE_URL } from '@/content/tests'

// lastmod는 실제 내용이 바뀐 날짜만 쓴다. 배포 시각(new Date())을 쓰면 매 배포마다 전 페이지가
// '수정됨'이 되어 검색엔진이 사이트 전체의 lastmod를 신뢰하지 않게 된다.
const PRIVACY_UPDATED = '2026-11-02' // 개인정보처리방침 내용·메타 수정 시 갱신
const SITE_SHELL_UPDATED = '2026-11-02' // 홈·카테고리 페이지 자체 디자인/문구 수정 시 갱신

const latest = (dates: string[]) => dates.reduce((a, b) => (a > b ? a : b))

export default function sitemap(): MetadataRoute.Sitemap {
  const items = getCatalog()
  const listUpdated = (list = items) => new Date(latest([SITE_SHELL_UPDATED, ...list.map((i) => i.updatedAt)]))

  return [
    { url: SITE_URL, lastModified: listUpdated(), changeFrequency: 'weekly', priority: 1 },
    ...activeCategories().map((c) => ({
      url: `${SITE_URL}/c/${c}`,
      lastModified: listUpdated(items.filter((i) => i.category === c)),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    ...items.map((i) => ({
      url: `${SITE_URL}${i.href}`,
      lastModified: new Date(i.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/privacy`, lastModified: new Date(PRIVACY_UPDATED), changeFrequency: 'yearly', priority: 0.3 },
  ]
}
