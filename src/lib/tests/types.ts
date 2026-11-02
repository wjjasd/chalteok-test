// 범용 테스트 엔진 스키마.
// 테스트 하나 = src/content/tests/<slug>.ts 파일 하나. 이 파일은 `import type`만 써야 한다
// (scripts/validate-tests.ts가 Node 타입 스트리핑으로 직접 import하기 때문).

export type ThemeKey = 'rose' | 'sky' | 'violet' | 'amber' | 'emerald' | 'pink' | 'indigo' | 'teal'

export type TestCategory = 'love' | 'personality' | 'friend' | 'life'

/**
 * - type:  선택지마다 결과 유형에 가중치를 더하고, 합이 가장 큰 유형이 결과 (동점이면 results 배열 앞쪽 우선)
 * - score: 선택지마다 점수를 더하고, 총점이 들어가는 [minScore, maxScore] 구간의 결과
 */
export type ScoringModel = 'type' | 'score'

export interface TestOption {
  label: string
  /** scoring = 'type'일 때 필수. key는 결과 id */
  weights?: Partial<Record<string, number>>
  /** scoring = 'score'일 때 필수 */
  score?: number
}

export interface TestQuestion {
  id: string
  text: string
  options: TestOption[]
}

export interface TestResult {
  /** URL에 들어가므로 영문 소문자·숫자·하이픈만 */
  id: string
  name: string
  emoji: string
  /** 한 줄 요약. 공유 카드·OG 이미지에 노출 */
  tagline: string
  /** 2~4문장 해설 */
  description: string
  /** 특징 3~5개 */
  traits: string[]
  /** 한 줄 조언 */
  advice: string
  /** 잘 맞는 결과 id (선택) */
  bestMatch?: string
  /** 안 맞는 결과 id (선택) */
  worstMatch?: string
  /** scoring = 'score'일 때 필수 (양 끝 포함) */
  minScore?: number
  maxScore?: number
}

export interface TestDefinition {
  /** URL 경로 /t/<slug>. 영문 소문자·숫자·하이픈만 */
  slug: string
  /** 화면 표시용 제목 (예: '연애 온도 테스트') */
  title: string
  /** 소개 화면 부제 한 줄 */
  subtitle: string
  /** 소개 화면 본문 2~3문장 */
  intro: string
  emoji: string
  theme: ThemeKey
  category: TestCategory
  scoring: ScoringModel
  /** YYYY-MM-DD. 홈 정렬·신규 배지에 사용 */
  publishedAt: string
  /** YYYY-MM-DD. 문항·결과·SEO 본문을 고친 날. sitemap lastmod에 사용 (없으면 publishedAt) */
  updatedAt?: string
  seo: {
    /** <title>. 노릴 검색어로 시작. '… | 찰떡 테스트'까지 포함, 60자 이내 권장 */
    title: string
    /** meta description. 노릴 검색어를 앞쪽에. 80~150자 */
    description: string
    /** 소개 화면 <h1>. 노릴 검색어를 그대로 포함 (없으면 title 사용) */
    h1?: string
    /** meta keywords. 노릴 검색어 + 변형 3~8개 */
    keywords?: string[]
  }
  /** 소개 화면 하단 해설 섹션 (검색엔진이 읽는 본문). 섹션 2~3개 권장 */
  guide?: { heading: string; body: string[] }[]
  /** 자주 묻는 질문 3~5개. FAQPage 구조화 데이터로도 출력 */
  faq?: { q: string; a: string }[]
  /** 카카오 공유 제목 템플릿. {name} {emoji} 치환 (예: '나는 {name} {emoji}') */
  shareTitle: string
  questions: TestQuestion[]
  results: TestResult[]
}
