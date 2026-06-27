import { Suspense } from 'react'
import type { Metadata } from 'next'
import ResultClient from './ResultClient'
import { decodeShare } from '@/lib/share'
import { GRADE_CONFIG } from '@/lib/scoring'

const BASE_URL = 'https://chalteok.kro.kr'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ d?: string; s?: string; g?: string }>
}): Promise<Metadata> {
  const { d, s, g } = await searchParams

  if (s && g && ['S', 'A', 'B', 'C', 'D'].includes(g)) {
    const score = parseInt(s, 10)
    if (!isNaN(score)) {
      const gradeLabel = GRADE_CONFIG[g as keyof typeof GRADE_CONFIG]?.label ?? ''
      return {
        title: `찰떡 궁합 테스트 — ${score}점 (${g}등급)`,
        openGraph: {
          url: `${BASE_URL}/bond/result?s=${score}&g=${g}`,
          type: 'website',
          siteName: '찰떡 궁합 테스트',
          title: `내 찰떡 궁합 점수: ${score}점 (${g}등급 — ${gradeLabel})`,
          description: '찰떡 궁합 테스트는 자기 성찰 도구이며, 관계 진단이 아닙니다.',
          images: [{ url: `${BASE_URL}/og/${g}.png`, width: 1200, height: 630 }],
        },
      }
    }
  }

  const payload = d ? decodeShare(d) : null
  if (payload) {
    const score = Math.round(payload.finalScore)
    const gradeLabel = GRADE_CONFIG[payload.grade]?.label ?? ''
    const ogImageUrl = `${BASE_URL}/og/${payload.grade}.png`
    const pageUrl = `${BASE_URL}/bond/result?d=${encodeURIComponent(d!)}`
    return {
      title: `찰떡 궁합 테스트 — ${score}점 (${payload.grade}등급)`,
      openGraph: {
        url: pageUrl,
        type: 'website',
        siteName: '찰떡 궁합 테스트',
        title: `내 찰떡 궁합 점수: ${score}점 (${payload.grade}등급 — ${gradeLabel})`,
        description: '찰떡 궁합 테스트는 자기 성찰 도구이며, 관계 진단이 아닙니다.',
        images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      },
    }
  }

  return {
    title: '찰떡 궁합 테스트 — 결과',
    openGraph: {
      url: `${BASE_URL}/bond/result`,
      type: 'website',
      siteName: '찰떡 궁합 테스트',
      title: '찰떡 궁합 테스트',
      description: '나와 그 사람, 찰떡일까? 관계 적합도 자기 성찰 도구',
      images: [{ url: `${BASE_URL}/og/root.png`, width: 1200, height: 630 }],
    },
  }
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
