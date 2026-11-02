// 사이트 전체 테스트 목록 (홈·카테고리 페이지·결과 페이지 추천·구조화 데이터 공용).
// 엔진 테스트(src/content/tests)는 자동 포함, 엔진 이전에 만든 테스트(bond, attachment)는 LEGACY에 수동 등록.
import { listTests, isNewTest, SITE_URL } from './tests'
import { estimatedMinutes } from '@/lib/tests/scoring'
import type { TestCategory, ThemeKey } from '@/lib/tests/types'

export interface CatalogItem {
  href: string
  title: string
  subtitle: string
  emoji: string
  category: TestCategory
  theme: ThemeKey
  questions: number
  minutes: number
  publishedAt: string
  badge?: '인기' | '신규'
}

export const CATEGORIES: Record<TestCategory, { label: string; emoji: string; title: string; heading: string; description: string }> = {
  love: {
    label: '연애',
    emoji: '💘',
    title: '연애 심리테스트 모음 — 궁합·애착유형·연애 스타일 | 찰떡 테스트',
    heading: '연애 심리테스트',
    description: '연인과의 궁합부터 내 연애 패턴까지. 무료 연애 심리테스트를 한 곳에 모았어요. 결과는 카톡으로 바로 공유할 수 있어요.',
  },
  personality: {
    label: '성격',
    emoji: '🧩',
    title: '성격 심리테스트 모음 — 나는 어떤 사람일까? | 찰떡 테스트',
    heading: '성격 심리테스트',
    description: '나도 몰랐던 내 성격과 성향을 알아보는 무료 성격 심리테스트 모음. 1분이면 끝나요.',
  },
  friend: {
    label: '인간관계',
    emoji: '🤝',
    title: '인간관계 심리테스트 모음 — 친구·가족·동료 | 찰떡 테스트',
    heading: '인간관계 심리테스트',
    description: '친구, 가족, 동료와의 관계 속 나를 알아보는 무료 인간관계 심리테스트 모음.',
  },
  life: {
    label: '직장·일상',
    emoji: '💼',
    title: '직장·일상 심리테스트 모음 — 퇴사·이직·라이프스타일 | 찰떡 테스트',
    heading: '직장·일상 심리테스트',
    description: '퇴사 타이밍부터 일상 속 내 스타일까지. 직장인을 위한 무료 심리테스트 모음.',
  },
}

const LEGACY: CatalogItem[] = [
  {
    href: '/bond',
    title: '찰떡 궁합 테스트',
    subtitle: '두 사람의 관계를 8개 영역에서 살펴봐요',
    emoji: '💑',
    category: 'love',
    theme: 'rose',
    questions: 45,
    minutes: 10,
    publishedAt: '2026-05-22',
    badge: '인기',
  },
  {
    href: '/attachment',
    title: '애착유형 테스트',
    subtitle: '나의 연애 애착 패턴은 어떤 바다일까?',
    emoji: '🌊',
    category: 'love',
    theme: 'sky',
    questions: 12,
    minutes: 3,
    publishedAt: '2026-06-15',
  },
]

/** 인기 → 최신순 */
export function getCatalog(): CatalogItem[] {
  const engine: CatalogItem[] = listTests().map((t) => ({
    href: `/t/${t.slug}`,
    title: t.title,
    subtitle: t.subtitle,
    emoji: t.emoji,
    category: t.category,
    theme: t.theme,
    questions: t.questions.length,
    minutes: estimatedMinutes(t),
    publishedAt: t.publishedAt,
    badge: isNewTest(t) ? '신규' : undefined,
  }))
  return [...engine, ...LEGACY].sort((a, b) => {
    if ((a.badge === '인기') !== (b.badge === '인기')) return a.badge === '인기' ? -1 : 1
    return b.publishedAt.localeCompare(a.publishedAt)
  })
}

/** 테스트가 1개 이상 있는 카테고리만 (빈 카테고리 페이지는 만들지 않는다) */
export function activeCategories(): TestCategory[] {
  const used = new Set(getCatalog().map((i) => i.category))
  return (Object.keys(CATEGORIES) as TestCategory[]).filter((c) => used.has(c))
}

export function itemListJsonLd(items: CatalogItem[], name: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}${item.href}`,
      name: item.title,
    })),
  }
}
