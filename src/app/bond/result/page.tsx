import { Suspense } from 'react'
import type { Metadata } from 'next'
import ResultClient from './ResultClient'

const BASE_URL = 'https://chalteok.com'

// 정적 export라 쿼리(?d=, ?s=&g=)별 메타를 만들 수 없다 → 공용 카드. 결과는 ResultClient가 쿼리를 읽어 표시
export const metadata: Metadata = {
  title: '찰떡 궁합 테스트 — 결과',
  openGraph: {
    url: `${BASE_URL}/bond/result`,
    type: 'website',
    siteName: '찰떡 궁합 테스트',
    title: '찰떡 궁합 테스트',
    description: '관계 적합도 자기 성찰 도구',
    images: [{ url: `${BASE_URL}/og/root.png`, width: 1200, height: 630 }],
  },
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-400">
          결과를 불러오는 중...
        </div>
      }
    >
      <ResultClient />
    </Suspense>
  )
}
