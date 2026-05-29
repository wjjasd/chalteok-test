import { Suspense } from 'react'
import type { Metadata } from 'next'
import ResultClient from './ResultClient'
import { decodeShare } from '@/lib/share'
import { GRADE_CONFIG } from '@/lib/scoring'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>
}): Promise<Metadata> {
  const { d } = await searchParams
  const payload = d ? decodeShare(d) : null

  if (payload) {
    const score = Math.round(payload.finalScore)
    const gradeLabel = GRADE_CONFIG[payload.grade]?.label ?? ''
    return {
      title: `찰떡 궁합 테스트 — ${score}점 (${payload.grade}등급)`,
      openGraph: {
        title: `내 찰떡 궁합 점수: ${score}점 (${payload.grade}등급 — ${gradeLabel})`,
        description: '찰떡 궁합 테스트는 자기 성찰 도구이며, 관계 진단이 아닙니다.',
        images: [
          {
            url: `/api/og?d=${encodeURIComponent(d!)}`,
            width: 1200,
            height: 630,
          },
        ],
      },
    }
  }

  return {
    title: '찰떡 궁합 테스트 — 결과',
    openGraph: {
      title: '찰떡 궁합 테스트',
      description: '나와 그 사람, 찰떡일까? 관계 적합도 자기 성찰 도구',
      images: [{ url: '/api/og', width: 1200, height: 630 }],
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
