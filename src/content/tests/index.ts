import type { TestDefinition } from '@/lib/tests/types'
// 새 테스트 등록: 아래 두 마커 위치에 한 줄씩 추가한다 (/new-test 스킬이 자동으로 처리).
// @new-test:imports
import quitTiming from './quit-timing'

export const TESTS: TestDefinition[] = [
  // @new-test:list
  quitTiming,
]

export function getTest(slug: string): TestDefinition | undefined {
  return TESTS.find((t) => t.slug === slug)
}

/** 최신순 */
export function listTests(): TestDefinition[] {
  return [...TESTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export const SITE_URL = 'https://chalteok.com'

const NEW_DAYS = 14
/** 공개 후 14일 이내면 '신규'. 정적 페이지라 배포 시점 기준으로 계산된다 */
export function isNewTest(t: TestDefinition): boolean {
  return Date.now() - new Date(t.publishedAt).getTime() < NEW_DAYS * 86400000
}
